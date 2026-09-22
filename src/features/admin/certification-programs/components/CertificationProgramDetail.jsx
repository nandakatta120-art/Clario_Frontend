import React, { useState } from 'react';
import { LiveBadgeRenderer } from './LiveBadgeRenderer';
import {
  X,
  Award,
  Shield,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Building,
  Users,
  Calendar,
  FileText,
  Activity,
  Edit,
  Copy,
  Archive,
  Eye,
  Play,
  ArrowLeft,
  Check,
} from 'lucide-react';
import clsx from 'clsx';

export const CertificationProgramDetail = ({
  program,
  onBack,
  onEdit,
  onDuplicate,
  onArchive,
  onSimulate,
  onPreview,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'rules', label: 'Eligibility Rules', icon: Zap },
    { id: 'milestones', label: `Milestones (${program.milestones.length})`, icon: Layers },
    { id: 'skills', label: `Skills (${program.skills.length})`, icon: Sparkles },
    { id: 'credentials', label: 'Credentials', icon: Award },
    { id: 'activity', label: 'Activity Log', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb / Back Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#64748B] hover:text-[#33409E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Certification Programs</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPreview(program)}
            className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] flex items-center space-x-1.5 transition-colors shadow-subtle"
          >
            <Eye className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Preview Credential</span>
          </button>
          <button
            onClick={() => onDuplicate(program)}
            className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] flex items-center space-x-1.5 transition-colors shadow-subtle"
          >
            <Copy className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Duplicate</span>
          </button>
          <button
            onClick={() => onEdit(program)}
            className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] flex items-center space-x-1.5 transition-colors shadow-subtle"
          >
            <Edit className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onSimulate(program)}
            className="px-4 py-1.5 rounded-xl bg-[#33409E] text-white text-xs font-bold hover:bg-[#2C3688] flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Eligibility</span>
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="shrink-0">
              <LiveBadgeRenderer badge={program.badge} size="md" showVerification={true} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#33409E] bg-[#33409E]/5 px-2 py-0.5 rounded border border-[#33409E]/10">
                  {program.code}
                </span>
                <span className="text-xs font-mono text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                  {program.version}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                  {program.tier} TIER
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 uppercase">
                  {program.status}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#0F172A] mt-2 font-display tracking-tight">
                {program.name}
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Target Audience: <span className="font-medium text-[#0F172A]">{program.audience}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0 border-t lg:border-t-0 lg:border-l border-[#E2E8F0] pt-4 lg:pt-0 lg:pl-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Issued</p>
              <p className="text-xl font-bold text-[#0F172A] font-display">{program.issuedCount}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Validity</p>
              <p className="text-xl font-bold text-[#0F172A] font-display">{program.validityMonths} mo</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Milestones</p>
              <p className="text-xl font-bold text-[#33409E] font-display">{program.milestones.length}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E2E8F0] mt-6 gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'pb-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-[#33409E] text-[#33409E]'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-subtle min-h-[350px]">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                Program Description
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">{program.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Target Audience
                </h4>
                <p className="text-xs text-[#64748B]">{program.audience}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Eligibility Rule Summary
                </h4>
                <p className="text-xs text-[#0F172A] font-medium">"{program.eligibilitySummary}"</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <span>Created on: {new Date(program.createdAt).toLocaleDateString()}</span>
              <span>Last updated: {new Date(program.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* RULES TAB */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Visual Eligibility Tree</h3>
                <p className="text-xs text-[#64748B]">
                  Evaluates whether incoming completions fulfill all or any program milestones.
                </p>
              </div>
              <span className="text-xs font-bold text-[#33409E] bg-[#33409E]/10 px-3 py-1 rounded-md border border-[#33409E]/20 uppercase">
                Match Condition: {program.ruleGroups?.matchType || 'ALL'}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#33409E] text-white flex items-center justify-center text-xs font-bold">
                  {program.ruleGroups?.matchType || 'ALL'}
                </div>
                <span className="text-xs font-bold text-[#0F172A]">
                  Require {program.ruleGroups?.matchType || 'ALL'} of the following conditions:
                </span>
              </div>

              <div className="pl-6 space-y-2 border-l-2 border-[#33409E]/30 ml-3">
                {program.milestones.map((ms, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-[#64748B]">#{idx + 1}</span>
                      <span className="font-bold text-[#33409E] bg-[#33409E]/5 px-2 py-0.5 rounded border border-[#33409E]/10">
                        {ms.platform}
                      </span>
                      <span className="font-medium text-[#0F172A]">{ms.courseName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                        {ms.minimumScore ? `Score ≥ ${ms.minimumScore}%` : 'Completion Only'}
                      </span>
                      {ms.mandatory && (
                        <span className="text-[10px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded uppercase">
                          Mandatory
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MILESTONES TAB */}
        {activeTab === 'milestones' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A]">
              Configured LMS Platform Milestones
            </h3>
            <div className="space-y-3">
              {program.milestones.map((ms, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-[#33409E]/10 text-[#33409E] flex items-center justify-center font-bold text-xs shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#33409E] bg-[#33409E]/5 px-2 py-0.5 rounded border border-[#33409E]/10 uppercase">
                          {ms.platform}
                        </span>
                        <span className="text-sm font-bold text-[#0F172A]">{ms.courseName}</span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1">
                        Est. Duration: {ms.estimatedHours || 20} hours • Passing criteria:{' '}
                        {ms.minimumScore ? `${ms.minimumScore}% score` : 'Course completion'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full border border-[#10B981]/20 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Verified Trigger</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A]">
              Mapped Competencies & Skills Taxonomy
            </h3>
            <p className="text-xs text-[#64748B]">
              Learners earning this credential have their skill profiles automatically credited with
              the following domains.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {program.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center space-x-2 shadow-subtle"
                >
                  <Sparkles className="w-4 h-4 text-[#33409E]" />
                  <span className="text-xs font-bold text-[#0F172A]">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREDENTIALS TAB */}
        {activeTab === 'credentials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Credential & Badge Branding</h3>
                <p className="text-xs text-[#64748B]">
                  Configured digital credential presentation and verifiable badge identity.
                </p>
              </div>
              <button
                onClick={() => onEdit(program)}
                className="px-3 py-1.5 rounded-xl bg-[#33409E] text-white text-xs font-bold hover:bg-[#2C3688] flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Badge Design</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-center gap-6">
              <LiveBadgeRenderer badge={program.badge} size="lg" showVerification={true} showTierRibbon={true} />
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#33409E] bg-[#33409E]/10 px-2 py-0.5 rounded-full">
                  {program.tier} Tier Digital Badge
                </span>
                <h4 className="text-lg font-bold text-[#0F172A]">
                  {program.credentialSettings?.title || program.name}
                </h4>
                <p className="text-xs text-[#64748B] max-w-md">
                  {program.credentialSettings?.description || program.description}
                </p>
                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start text-[11px] text-[#64748B] font-mono">
                  <span>Shape: {program.badge?.shape || 'SHIELD'}</span>
                  <span>•</span>
                  <span>Emblem: {program.badge?.emblem || 'SHIELD_CHECK'}</span>
                  <span>•</span>
                  <span>Primary: {program.badge?.primaryColor || '#33409E'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <p className="text-xs font-bold text-[#64748B] uppercase">Credential Title</p>
                <p className="text-sm font-bold text-[#0F172A]">
                  {program.credentialSettings?.title || program.name}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <p className="text-xs font-bold text-[#64748B] uppercase">Badge Design Style</p>
                <p className="text-sm font-bold text-[#0F172A]">
                  {program.credentialSettings?.badgeStyle || 'MODERN'} Vector Shape
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <p className="text-xs font-bold text-[#64748B] uppercase">Renewal Grace Period</p>
                <p className="text-sm font-bold text-[#0F172A]">
                  {program.credentialSettings?.gracePeriodDays || 60} Days
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <p className="text-xs font-bold text-[#64748B] uppercase">Public Verification</p>
                <p className="text-sm font-bold text-[#10B981]">Enabled (W3C Standard & Open Badges 3.0)</p>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0F172A]">Program Audit Trail</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#33409E]" />
                  <span className="font-semibold text-[#0F172A]">
                    Eligibility rules updated & version bumped to {program.version}
                  </span>
                </div>
                <span className="text-[#64748B]">{new Date(program.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="p-3 rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span className="font-semibold text-[#0F172A]">
                    Program published and live for multi-platform LMS completions
                  </span>
                </div>
                <span className="text-[#64748B]">{new Date(program.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
