import React, { useState, useEffect } from 'react';
import { MOCK_TEST_LEARNERS } from '@/mock/eligibilitySimulator';
import { evaluateEligibility } from '@/services/eligibilityEvaluationEngine';
import {
  X,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  User,
  GraduationCap,
  ShieldCheck,
  Building,
  Award,
  BookOpen,
} from 'lucide-react';
import clsx from 'clsx';

export const EligibilitySimulatorModal = ({
  program,
  isOpen,
  onClose,
}) => {
  const [selectedLearnerId, setSelectedLearnerId] = useState(
    MOCK_TEST_LEARNERS[0].id
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState(null);

  const activeLearner =
    MOCK_TEST_LEARNERS.find((l) => l.id === selectedLearnerId) ||
    MOCK_TEST_LEARNERS[0];

  // Re-run evaluation when program or learner changes
  const runSimulation = () => {
    if (!program || !activeLearner) return;
    setIsSimulating(true);

    setTimeout(() => {
      const simResult = evaluateEligibility(program, activeLearner);
      setResult(simResult);
      setIsSimulating(false);
    }, 250);
  };

  useEffect(() => {
    if (isOpen && program) {
      runSimulation();
    }
  }, [isOpen, program, selectedLearnerId]);

  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-slide-up z-10">
        {/* Header */}
        <div className="p-6 border-b border-[#E2E8F0] bg-gradient-to-r from-white via-[#F8FAFC] to-white flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#33409E]/10 border border-[#33409E]/20 flex items-center justify-center text-[#33409E] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Rule Eligibility Simulator
                </h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded-full border border-[#10B981]/20">
                  100% Explainability
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Testing against: <span className="font-semibold text-[#0F172A]">{program.name}</span>{' '}
                <span className="font-mono text-[#33409E]">({program.code})</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-[#F8FAFC]/50">
          {/* Test Candidate Selector */}
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-subtle space-y-3">
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Select Test Learner Dataset
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MOCK_TEST_LEARNERS.map((learner) => {
                const isSelected = learner.id === selectedLearnerId;
                return (
                  <button
                    key={learner.id}
                    onClick={() => setSelectedLearnerId(learner.id)}
                    className={clsx(
                      'text-left p-3 rounded-xl border transition-all flex items-start space-x-3',
                      isSelected
                        ? 'bg-[#33409E]/5 border-[#33409E] ring-1 ring-[#33409E]/20'
                        : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]'
                    )}
                  >
                    <div
                      className={clsx(
                        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0',
                        isSelected
                          ? 'bg-[#33409E] text-white'
                          : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
                      )}
                    >
                      {learner.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#0F172A] truncate">
                          {learner.name}
                        </p>
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate">{learner.role}</p>
                      <p className="text-[10px] text-[#33409E] font-medium mt-1 line-clamp-1">
                        {learner.scenarioDescription}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Candidate Summary Strip */}
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold text-sm border border-[#10B981]/20">
                {activeLearner.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">{activeLearner.name}</p>
                <div className="flex items-center space-x-2 text-xs text-[#64748B]">
                  <span>{activeLearner.email}</span>
                  <span>•</span>
                  <span>{activeLearner.department}</span>
                </div>
              </div>
            </div>

            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white text-xs font-bold text-[#33409E] flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
            >
              <RotateCw className={clsx('w-3.5 h-3.5', isSimulating && 'animate-spin')} />
              <span>Re-evaluate</span>
            </button>
          </div>

          {/* Decision Outcome Card */}
          {result && (
            <div
              className={clsx(
                'rounded-2xl p-5 border shadow-subtle transition-all duration-300',
                result.isEligible
                  ? 'bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 border-[#10B981]/30'
                  : 'bg-gradient-to-br from-amber-50/80 via-white to-rose-50/30 border-amber-300/60'
              )}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={clsx(
                    'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm',
                    result.isEligible
                      ? 'bg-[#10B981] text-white border-[#10B981]'
                      : 'bg-amber-500 text-white border-amber-600'
                  )}
                >
                  {result.isEligible ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <XCircle className="w-7 h-7" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#64748B]">
                      Qualification Decision
                    </span>
                    <span
                      className={clsx(
                        'text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider',
                        result.isEligible
                          ? 'bg-[#10B981] text-white'
                          : 'bg-amber-500 text-white'
                      )}
                    >
                      {result.decisionTitle}
                    </span>
                  </div>

                  <h3
                    className={clsx(
                      'text-lg font-extrabold mt-1 tracking-tight',
                      result.isEligible ? 'text-[#065F46]' : 'text-[#9A3412]'
                    )}
                  >
                    {result.isEligible
                      ? 'Fully Qualified for Credential Issuance'
                      : 'Not Eligible for Automated Issuance'}
                  </h3>

                  <p className="text-xs text-[#0F172A] font-medium mt-1">
                    {result.summary} {result.explanation}
                  </p>

                  {result.failedReason && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-amber-100/70 border border-amber-200 text-xs text-amber-900 font-medium flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{result.failedReason}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Requirement Validation Log */}
          {result && (
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#33409E]" />
                    <span>Requirement Validation Log</span>
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Exact evaluation breakdown comparing program rules against learner transcripts.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#33409E] bg-[#33409E]/10 px-2 py-1 rounded-md">
                  {result.satisfiedRequirements} / {result.totalRequirements} Satisfied
                </span>
              </div>

              <div className="space-y-2.5">
                {result.evaluations.map((evalItem, idx) => (
                  <div
                    key={evalItem.id || idx}
                    className={clsx(
                      'p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors',
                      evalItem.isSatisfied
                        ? 'bg-white border-[#E2E8F0] hover:border-[#10B981]/40'
                        : 'bg-rose-50/30 border-rose-200'
                    )}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[#64748B]">#{idx + 1}</span>
                        <span className="font-bold text-[#0F172A] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0] uppercase text-[10px]">
                          {evalItem.platform}
                        </span>
                        <span className="font-bold text-[#0F172A] truncate">
                          {evalItem.courseName}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B]">
                        <span className="font-medium text-[#0F172A]">Result:</span>{' '}
                        {evalItem.statusReason}
                      </p>
                      <div className="flex items-center space-x-3 text-[11px] text-[#64748B]">
                        <span>
                          Required Score:{' '}
                          <strong className="text-[#0F172A]">
                            {evalItem.expectedScore ? `${evalItem.expectedScore}%` : 'PASS'}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Actual Score:{' '}
                          <strong
                            className={clsx(
                              evalItem.isSatisfied ? 'text-[#10B981]' : 'text-[#EF4444]'
                            )}
                          >
                            {evalItem.actualScore !== undefined
                              ? `${evalItem.actualScore}%`
                              : 'None'}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      <span
                        className={clsx(
                          'text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border flex items-center space-x-1',
                          evalItem.isSatisfied
                            ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30'
                            : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
                        )}
                      >
                        {evalItem.isSatisfied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>SATISFIED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>NOT SATISFIED</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
          <div className="text-xs text-[#64748B]">
            Real-time TypeScript engine evaluation • Zero backend latency
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
            >
              Close Simulator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
