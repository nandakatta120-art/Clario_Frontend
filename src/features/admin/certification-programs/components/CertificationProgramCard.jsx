import React from 'react';
import { LiveBadgeRenderer } from './LiveBadgeRenderer';
import {
  Award,
  Shield,
  Clock,
  CheckCircle,
  Copy,
  Archive,
  Eye,
  Edit,
  Play,
  Zap,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';

const TIER_BADGES = {
  FOUNDATION: {
    label: 'Foundation',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    iconBg: 'bg-slate-100 text-slate-600',
  },
  STANDARD: {
    label: 'Standard',
    bg: 'bg-blue-50/70',
    text: 'text-[#33409E]',
    border: 'border-[#33409E]/20',
    iconBg: 'bg-[#33409E]/10 text-[#33409E]',
  },
  GOLD: {
    label: 'Gold Tier',
    bg: 'bg-amber-50/80',
    text: 'text-amber-800',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  PLATINUM: {
    label: 'Platinum Elite',
    bg: 'bg-indigo-50/80',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    iconBg: 'bg-indigo-100 text-indigo-700',
  },
};

const STATUS_BADGES = {
  PUBLISHED: {
    label: 'Published',
    bg: 'bg-[#10B981]/10',
    text: 'text-[#10B981]',
    border: 'border-[#10B981]/20',
  },
  DRAFT: {
    label: 'Draft',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  ARCHIVED: {
    label: 'Archived',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
};

const PLATFORM_STYLES = {
  UDEMY: { label: 'Udemy', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  CSOD: { label: 'CSOD', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  UKG: { label: 'UKG', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  DOCEBO: { label: 'Docebo', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  EDX: { label: 'edX', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  COURSERA: { label: 'Coursera', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
};

export const CertificationProgramCard = ({
  program,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onSimulate,
  onPreview,
}) => {
  const tierConfig = TIER_BADGES[program.tier];
  const statusConfig = STATUS_BADGES[program.status];

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-subtle hover:shadow-light-float hover:border-[#33409E]/30 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Header Strip */}
      <div className="p-5 pb-4 border-b border-[#E2E8F0]/70 bg-gradient-to-b from-[#F8FAFC]/80 to-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="shrink-0">
              <LiveBadgeRenderer badge={program.badge} size="sm" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-[#33409E] tracking-wider uppercase">
                  {program.code}
                </span>
                <span className="text-[11px] text-[#64748B] font-mono bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                  {program.version}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className={clsx('text-[11px] font-bold px-2 py-0.5 rounded-full border', tierConfig.bg, tierConfig.text, tierConfig.border)}>
                  {tierConfig.label}
                </span>
                <span className={clsx('text-[11px] font-bold px-2 py-0.5 rounded-full border', statusConfig.bg, statusConfig.text, statusConfig.border)}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPreview(program)}
              title="Preview Credential Presentation"
              className="p-1.5 text-[#64748B] hover:text-[#33409E] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDuplicate(program)}
              title="Duplicate Program"
              className="p-1.5 text-[#64748B] hover:text-[#33409E] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
            {program.status !== 'ARCHIVED' && (
              <button
                onClick={() => onArchive(program)}
                title="Archive Program"
                className="p-1.5 text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
              >
                <Archive className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Title and Audience */}
        <div className="mt-3.5">
          <h3
            onClick={() => onView(program)}
            className="text-lg font-bold text-[#0F172A] group-hover:text-[#33409E] transition-colors cursor-pointer leading-snug"
          >
            {program.name}
          </h3>
          <p className="text-xs text-[#64748B] mt-1 line-clamp-1">
            <span className="font-semibold text-[#0F172A]">Audience:</span> {program.audience}
          </p>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 space-y-4 flex-1">
        <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
          {program.description}
        </p>

        {/* Eligibility Logic Summary */}
        <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center space-x-1">
              <Zap className="w-3 h-3 text-[#33409E]" />
              <span>Eligibility Logic</span>
            </span>
            <span className="text-[10px] font-semibold text-[#33409E] bg-[#33409E]/10 px-1.5 py-0.2 rounded border border-[#33409E]/20">
              {program.ruleGroups?.matchType || 'ALL'} Conditions
            </span>
          </div>
          <p className="text-xs text-[#0F172A] font-medium leading-normal line-clamp-2">
            "{program.eligibilitySummary}"
          </p>
        </div>

        {/* Required LMS Milestones */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center space-x-1">
              <Layers className="w-3 h-3 text-[#64748B]" />
              <span>Required Multi-LMS Milestones ({program.milestones.length})</span>
            </span>
          </div>

          <div className="space-y-1.5">
            {program.milestones.slice(0, 3).map((ms, idx) => {
              const platformStyle = PLATFORM_STYLES[ms.platform] || {
                label: ms.platform,
                bg: 'bg-slate-50',
                text: 'text-slate-700',
                border: 'border-slate-200',
              };
              return (
                <div
                  key={ms.id || idx}
                  className="bg-white border border-[#E2E8F0] rounded-lg p-2 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="text-[10px] font-bold text-[#64748B] shrink-0 font-mono">
                      #{idx + 1}
                    </span>
                    <span
                      className={clsx(
                        'text-[10px] font-extrabold px-1.5 py-0.5 rounded border uppercase shrink-0',
                        platformStyle.bg,
                        platformStyle.text,
                        platformStyle.border
                      )}
                    >
                      {platformStyle.label}
                    </span>
                    <span className="truncate text-[#0F172A] font-medium" title={ms.courseName}>
                      {ms.courseName}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center space-x-1.5">
                    {ms.minimumScore ? (
                      <span className="text-[10px] font-bold text-[#33409E] bg-[#33409E]/10 px-1.5 py-0.5 rounded">
                        ≥{ms.minimumScore}%
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">
                        PASS
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {program.milestones.length > 3 && (
              <p className="text-[11px] text-[#64748B] text-center font-medium">
                +{program.milestones.length - 3} more platform milestone(s)
              </p>
            )}
          </div>
        </div>

        {/* Skills Tag Row */}
        {program.skills && program.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {program.skills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-[#F8FAFC] text-[#64748B] px-2 py-0.5 rounded-md border border-[#E2E8F0]"
              >
                {skill}
              </span>
            ))}
            {program.skills.length > 4 && (
              <span className="text-[11px] font-semibold text-[#33409E] bg-[#33409E]/5 px-2 py-0.5 rounded-md">
                +{program.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Metrics & Actions */}
      <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3 text-xs text-[#64748B]">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-[#64748B]" />
            <span>{program.validityMonths} mo validity</span>
          </span>
          <span>•</span>
          <span className="font-semibold text-[#0F172A]">{program.issuedCount} issued</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(program)}
            className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#33409E]/30 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onSimulate(program)}
            className="px-3 py-1.5 rounded-lg bg-[#33409E] text-white text-xs font-bold hover:bg-[#2C3688] shadow-sm flex items-center space-x-1.5 transition-colors group-hover:shadow"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Simulate Eligibility</span>
          </button>
        </div>
      </div>
    </div>
  );
};
