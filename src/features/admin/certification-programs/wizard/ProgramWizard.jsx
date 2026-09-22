import React, { useState, useEffect } from 'react';
import { BadgeDesignStep } from './BadgeDesignStep';
import { LiveBadgeRenderer } from '../components/LiveBadgeRenderer';
import {
  X,
  Award,
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Layers,
  Sparkles,
  Settings,
  Eye,
  Plus,
  Trash2,
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastNotification';
import clsx from 'clsx';

const STEPS = [
  { number: 1, title: 'Program Details', icon: Award },
  { number: 2, title: 'Badge Design', icon: Sparkles },
  { number: 3, title: 'Eligibility Rules', icon: Zap },
  { number: 4, title: 'LMS Milestones', icon: Layers },
  { number: 5, title: 'Skills Mapping', icon: Sparkles },
  { number: 6, title: 'Credential Settings', icon: Settings },
  { number: 7, title: 'Review & Publish', icon: Eye },
];

const PLATFORMS = ['CSOD', 'COURSERA', 'EDX', 'UDEMY', 'DOCEBO', 'UKG'];
const TIERS = ['FOUNDATION', 'STANDARD', 'GOLD', 'PLATINUM'];

const DEFAULT_BADGE = {
  shape: 'SHIELD',
  tier: 'GOLD',
  emblem: 'SHIELD_CHECK',
  primaryColor: '#33409E',
  secondaryColor: '#F59E0B',
  presetId: 'preset-sec-gold',
};

export const ProgramWizard = ({
  initialProgram,
  isOpen,
  onClose,
  onSave,
}) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [tier, setTier] = useState('GOLD');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('');
  const [validityMonths, setValidityMonths] = useState(12);
  const [eligibilitySummary, setEligibilitySummary] = useState('');
  const [matchType, setMatchType] = useState('ALL');

  // Badge State
  const [badge, setBadge] = useState(DEFAULT_BADGE);

  // Milestones State
  const [milestones, setMilestones] = useState([
    {
      id: `ms-${Date.now()}-1`,
      platform: 'COURSERA',
      courseName: 'Cloud Security Architecture & Compliance',
      completionRequired: true,
      minimumScore: 80,
      mandatory: true,
      estimatedHours: 24,
    },
  ]);

  // Skills State
  const [skills, setSkills] = useState([
    'Cloud Security',
    'Compliance',
    'DevSecOps',
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Credential Settings State
  const [credTitle, setCredTitle] = useState('');
  const [credDesc, setCredDesc] = useState('');
  const [gracePeriodDays, setGracePeriodDays] = useState(60);

  // Sync state when initialProgram changes
  useEffect(() => {
    if (initialProgram) {
      setName(initialProgram.name || '');
      setCode(initialProgram.code || '');
      setVersion(initialProgram.version || 'v1.0.0');
      setTier(initialProgram.tier || 'GOLD');
      setDescription(initialProgram.description || '');
      setAudience(initialProgram.audience || '');
      setValidityMonths(initialProgram.validityMonths || 12);
      setEligibilitySummary(initialProgram.eligibilitySummary || '');
      setMatchType(initialProgram.ruleGroups?.matchType || 'ALL');
      setBadge(initialProgram.badge || { ...DEFAULT_BADGE, tier: initialProgram.tier || 'GOLD' });
      setMilestones(initialProgram.milestones || []);
      setSkills(initialProgram.skills || []);
      setCredTitle(initialProgram.credentialSettings?.title || '');
      setCredDesc(initialProgram.credentialSettings?.description || '');
      setGracePeriodDays(initialProgram.credentialSettings?.gracePeriodDays || 60);
    } else {
      setName('');
      setCode('');
      setVersion('v1.0.0');
      setTier('GOLD');
      setDescription('');
      setAudience('');
      setValidityMonths(12);
      setEligibilitySummary('');
      setMatchType('ALL');
      setBadge(DEFAULT_BADGE);
      setMilestones([
        {
          id: `ms-${Date.now()}-1`,
          platform: 'COURSERA',
          courseName: 'Cloud Security Architecture & Compliance',
          completionRequired: true,
          minimumScore: 80,
          mandatory: true,
          estimatedHours: 24,
        },
      ]);
      setSkills(['Cloud Security', 'Compliance', 'DevSecOps']);
      setCredTitle('');
      setCredDesc('');
      setGracePeriodDays(60);
    }
    setCurrentStep(1);
  }, [initialProgram, isOpen]);

  if (!isOpen) return null;

  const handleTierChange = (newTier) => {
    setTier(newTier);
    setBadge((prev) => ({ ...prev, tier: newTier }));
  };

  const handleAddMilestone = () => {
    const newMs = {
      id: `ms-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      platform: 'CSOD',
      courseName: '',
      completionRequired: true,
      minimumScore: 80,
      mandatory: true,
      estimatedHours: 20,
    };
    setMilestones([...milestones, newMs]);
  };

  const handleUpdateMilestone = (
    id,
    updates
  ) => {
    setMilestones(
      milestones.map((ms) => (ms.id === id ? { ...ms, ...updates } : ms))
    );
  };

  const handleRemoveMilestone = (id) => {
    setMilestones(milestones.filter((ms) => ms.id !== id));
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleFinalSubmit = (isDraft) => {
    if (!name.trim()) {
      showToast('Program name is required.', { type: 'error' });
      setCurrentStep(1);
      return;
    }

    const payload = {
      name,
      code: code.trim() || `CLR-PROG-${Date.now().toString().slice(-4)}`,
      version: version.trim() || 'v1.0.0',
      tier,
      status: isDraft ? 'DRAFT' : 'PUBLISHED',
      description,
      audience,
      validityMonths,
      eligibilitySummary:
        eligibilitySummary.trim() ||
        `Automatically issue when learner satisfies ${matchType} of ${milestones.length} milestone requirements.`,
      ruleGroups: {
        id: `rg-${Date.now()}`,
        matchType,
        conditions: milestones.map((m) => ({
          id: m.id,
          platform: m.platform,
          courseName: m.courseName || 'General Milestone Requirement',
          completionRequired: m.completionRequired,
          minimumScore: m.minimumScore,
          mandatory: m.mandatory,
        })),
      },
      milestones,
      skills,
      credentialSettings: {
        title: credTitle || name,
        description: credDesc || description,
        validityMonths,
        gracePeriodDays,
        badgeStyle: 'MODERN',
        isPubliclyVerifiable: true,
      },
      badge,
    };

    onSave(payload, isDraft);
    showToast(
      isDraft
        ? 'Draft certification program saved.'
        : 'Certification program published successfully!',
      { type: 'success' }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Wizard Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-slide-up z-10">
        {/* Wizard Header */}
        <div className="p-5 sm:p-6 border-b border-[#E2E8F0] bg-gradient-to-r from-white via-[#F8FAFC] to-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#33409E] text-white flex items-center justify-center shadow-sm shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                {initialProgram ? 'Edit Certification Program' : 'Create Certification Program'}
              </h2>
              <p className="text-xs text-[#64748B]">
                Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
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

        {/* Step Progress Bar */}
        <div className="bg-[#F8FAFC] px-6 py-3 border-b border-[#E2E8F0] overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-max">
            {STEPS.map((step) => {
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;

              return (
                <button
                  key={step.number}
                  onClick={() => setCurrentStep(step.number)}
                  className={clsx(
                    'flex items-center space-x-2 text-xs font-bold px-3 py-1.5 rounded-xl transition-all',
                    isCurrent && 'bg-[#33409E] text-white shadow-sm',
                    isCompleted && 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20',
                    !isCurrent && !isCompleted && 'text-[#64748B] hover:bg-[#E2E8F0]/50'
                  )}
                >
                  <div
                    className={clsx(
                      'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black',
                      isCurrent && 'bg-white text-[#33409E]',
                      isCompleted && 'bg-[#10B981] text-white',
                      !isCurrent && !isCompleted && 'bg-[#CBD5E1] text-white'
                    )}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : step.number}
                  </div>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: PROGRAM DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-2xl mx-auto animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Program Name <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Clario Certified Cloud Security Practitioner"
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#33409E] focus:ring-1 focus:ring-[#33409E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Program Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CLR-SEC-2026"
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#33409E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Version
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="v1.0.0"
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#33409E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Program Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => handleTierChange(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#33409E]"
                  >
                    {TIERS.map((t) => (
                      <option key={t} value={t}>
                        {t} Tier
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Cloud Architects, DevSecOps Engineers, SecOps Leads"
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#33409E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Program Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive cross-platform certification recognizing enterprise cloud governance and security..."
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl p-3.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#33409E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Validity Period (Months)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={validityMonths}
                  onChange={(e) => setValidityMonths(Number(e.target.value))}
                  className="w-32 bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#33409E]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: BADGE DESIGN (First-Class Feature) */}
          {currentStep === 2 && (
            <BadgeDesignStep
              badge={badge}
              programName={name}
              programCode={code}
              onChange={(updates) => setBadge((prev) => ({ ...prev, ...updates }))}
              onReset={() => setBadge({ ...DEFAULT_BADGE, tier })}
            />
          )}

          {/* STEP 3: ELIGIBILITY RULES */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
              <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">
                      Condition Evaluation Engine
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Determine how multi-platform learning completions trigger automated issuance.
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-[#E2E8F0]">
                    <button
                      onClick={() => setMatchType('ALL')}
                      className={clsx(
                        'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                        matchType === 'ALL'
                          ? 'bg-[#33409E] text-white shadow-sm'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      )}
                    >
                      ALL Conditions
                    </button>
                    <button
                      onClick={() => setMatchType('ANY')}
                      className={clsx(
                        'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                        matchType === 'ANY'
                          ? 'bg-[#33409E] text-white shadow-sm'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      )}
                    >
                      ANY Condition
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#33409E]">
                    <Zap className="w-4 h-4" />
                    <span>Rule Logic Description</span>
                  </div>
                  <input
                    type="text"
                    value={eligibilitySummary}
                    onChange={(e) => setEligibilitySummary(e.target.value)}
                    placeholder="e.g. Automatically issue when learner satisfies all 3 required achievements..."
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#33409E]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: LMS MILESTONES */}
          {currentStep === 4 && (
            <div className="space-y-5 max-w-3xl mx-auto animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    Required LMS Platform Milestones
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Select external LMS providers and define mandatory course completion criteria.
                  </p>
                </div>
                <button
                  onClick={handleAddMilestone}
                  className="px-3.5 py-2 rounded-xl bg-[#33409E] text-white text-xs font-bold hover:bg-[#2C3688] flex items-center space-x-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {milestones.map((ms, idx) => (
                  <div
                    key={ms.id}
                    className="p-4 rounded-xl border border-[#E2E8F0] bg-white shadow-subtle space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#33409E]">
                        Milestone #{idx + 1}
                      </span>
                      {milestones.length > 1 && (
                        <button
                          onClick={() => handleRemoveMilestone(ms.id)}
                          className="p-1 text-[#64748B] hover:text-[#EF4444] rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Platform Selector Strip */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                        LMS Provider
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {PLATFORMS.map((platform) => {
                          const isSelected = ms.platform === platform;
                          return (
                            <button
                              key={platform}
                              type="button"
                              onClick={() => handleUpdateMilestone(ms.id, { platform })}
                              className={clsx(
                                'px-3 py-1.5 rounded-lg text-xs font-bold border transition-all',
                                isSelected
                                  ? 'bg-[#33409E] text-white border-[#33409E] shadow-sm'
                                  : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white'
                              )}
                            >
                              {platform}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Course Title & Minimum Score */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                          Course / Learning Activity Name
                        </label>
                        <input
                          type="text"
                          value={ms.courseName}
                          onChange={(e) =>
                            handleUpdateMilestone(ms.id, { courseName: e.target.value })
                          }
                          placeholder="e.g. Enterprise Security Architecture & Zero Trust"
                          className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#33409E]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                          Min. Score Requirement (%)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={ms.minimumScore || 80}
                          onChange={(e) =>
                            handleUpdateMilestone(ms.id, {
                              minimumScore: Number(e.target.value),
                            })
                          }
                          className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#33409E]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SKILLS MAPPING */}
          {currentStep === 5 && (
            <div className="space-y-4 max-w-2xl mx-auto animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  Skills & Competency Taxonomy Mapping
                </h3>
                <p className="text-xs text-[#64748B]">
                  Attach skill domains and proficiency tags rewarded upon credential issuance.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Type a skill and press enter (e.g. DevSecOps, Kafka, IAM)"
                  className="flex-1 bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#33409E]"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 rounded-xl bg-[#33409E] text-white text-xs font-bold hover:bg-[#2C3688] transition-colors"
                >
                  Add Skill
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] min-h-[120px] flex flex-wrap gap-2 items-start">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center space-x-1.5 bg-white text-[#33409E] border border-[#33409E]/20 text-xs font-bold px-3 py-1 rounded-lg shadow-subtle"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-[#64748B] hover:text-[#EF4444]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <p className="text-xs text-[#64748B] self-center mx-auto">
                    No skills mapped yet. Add skills to define credential proficiencies.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: CREDENTIAL SETTINGS */}
          {currentStep === 6 && (
            <div className="space-y-4 max-w-2xl mx-auto animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Official Credential Title
                </label>
                <input
                  type="text"
                  value={credTitle || name}
                  onChange={(e) => setCredTitle(e.target.value)}
                  placeholder="e.g. Clario Certified Cloud Security Practitioner (CCSP)"
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#33409E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Credential Description for Public Verification
                </label>
                <textarea
                  rows={3}
                  value={credDesc || description}
                  onChange={(e) => setCredDesc(e.target.value)}
                  placeholder="Public description shown to third parties when verifying this certificate..."
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl p-3.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#33409E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Renewal Grace Period (Days)
                  </label>
                  <input
                    type="number"
                    value={gracePeriodDays}
                    onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#33409E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Public Verification Protocol
                  </label>
                  <input
                    type="text"
                    disabled
                    value="W3C Verifiable Credentials & Open Badges 3.0"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2 text-xs text-[#64748B] cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW & PUBLISH (with Live Badge Preview Card) */}
          {currentStep === 7 && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
              {/* Top Banner with Badge */}
              <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="shrink-0">
                  <LiveBadgeRenderer badge={badge} size="lg" showVerification={true} />
                </div>
                <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#33409E] bg-[#33409E]/10 px-2 py-0.5 rounded-full">
                      {tier} Tier
                    </span>
                    <span className="font-mono text-xs font-bold text-[#64748B]">
                      {code || 'CLR-PROG-2026'} • {version}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A]">{name}</h3>
                  <p className="text-xs text-[#64748B] line-clamp-2">{description}</p>
                </div>
              </div>

              {/* Configuration Breakdown Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
                  <p className="text-[10px] font-bold uppercase text-[#64748B]">Validity</p>
                  <p className="text-sm font-bold text-[#0F172A] mt-1">{validityMonths} Months</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
                  <p className="text-[10px] font-bold uppercase text-[#64748B]">Rule Logic</p>
                  <p className="text-sm font-bold text-[#33409E] mt-1">{matchType} Conditions</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
                  <p className="text-[10px] font-bold uppercase text-[#64748B]">Milestones</p>
                  <p className="text-sm font-bold text-[#0F172A] mt-1">{milestones.length} LMS Courses</p>
                </div>
              </div>

              {/* Milestones Preview List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Configured Multi-LMS Milestones
                </h4>
                {milestones.map((ms, idx) => (
                  <div
                    key={ms.id}
                    className="p-3 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="font-mono font-bold text-[#64748B]">#{idx + 1}</span>
                      <span className="font-bold text-[#33409E] bg-[#33409E]/5 px-2 py-0.5 rounded border border-[#33409E]/10 uppercase text-[10px]">
                        {ms.platform}
                      </span>
                      <span className="font-medium text-[#0F172A] truncate">{ms.courseName}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#10B981] shrink-0">
                      {ms.minimumScore ? `≥${ms.minimumScore}%` : 'PASS'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wizard Navigation Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-xl border border-[#E2E8F0] bg-white text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:pointer-events-none flex items-center space-x-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => handleFinalSubmit(true)}
              className="px-4 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-white transition-colors"
            >
              Save Draft
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(STEPS.length, prev + 1))}
                className="px-5 py-2 rounded-xl bg-[#33409E] text-white text-xs font-bold hover:bg-[#2C3688] flex items-center space-x-1.5 shadow-sm transition-colors"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFinalSubmit(false)}
                className="px-6 py-2 rounded-xl bg-[#10B981] text-white text-xs font-black hover:bg-[#059669] flex items-center space-x-1.5 shadow-sm transition-colors uppercase tracking-wider"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Publish Program</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
