import React from 'react';
import { BADGE_PRESETS } from '@/mock/badgePresets';
import {
  LiveBadgeRenderer,
  EMBLEM_ICONS,
} from '../components/LiveBadgeRenderer';
import {
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Check,
  Layers,
  Palette,
  Eye,
  Award,
  Shield,
  Circle,
  Medal,
  Bookmark,
  Star,
  CheckCircle2,
} from 'lucide-react';
import clsx from 'clsx';

const SHAPES = [
  { id: 'SHIELD', label: 'Shield', icon: Shield },
  { id: 'HEXAGON', label: 'Hexagon', icon: Layers },
  { id: 'CIRCLE', label: 'Circle', icon: Circle },
  { id: 'MEDAL', label: 'Medal', icon: Medal },
  { id: 'RIBBON', label: 'Ribbon', icon: Bookmark },
  { id: 'STAR', label: 'Star', icon: Star },
];

const TIERS = [
  { id: 'FOUNDATION', label: 'Foundation', desc: 'Neutral Satin Accent' },
  { id: 'STANDARD', label: 'Standard', desc: 'Cobalt Metallic Ring' },
  { id: 'GOLD', label: 'Gold Tier', desc: 'Polished 24K Gold Bevel' },
  { id: 'PLATINUM', label: 'Platinum', desc: 'Frosted Platinum Sheen' },
];

const EMBLEMS = [
  { id: 'SHIELD_CHECK', label: 'Security' },
  { id: 'AWARD', label: 'Award' },
  { id: 'GRADUATION_CAP', label: 'Academic' },
  { id: 'CLOUD', label: 'Cloud' },
  { id: 'LOCK', label: 'Privacy' },
  { id: 'DATABASE', label: 'Data' },
  { id: 'CPU', label: 'AI & ML' },
  { id: 'CODE', label: 'Dev' },
  { id: 'STAR', label: 'Excellence' },
  { id: 'ZAP', label: 'SRE / Ops' },
  { id: 'CERTIFICATE', label: 'Certified' },
  { id: 'LEADERSHIP', label: 'Leader' },
];

const PRIMARY_SWATCHES = [
  '#33409E', // Clario Royal Blue
  '#4F46E5', // Indigo
  '#0F766E', // Teal
  '#047857', // Emerald
  '#1E293B', // Slate
  '#6D28D9', // Violet
  '#BE123C', // Crimson
  '#D97706', // Amber
];

const SECONDARY_SWATCHES = [
  '#F59E0B', // Gold
  '#94A3B8', // Platinum Silver
  '#38BDF8', // Sky Blue
  '#34D399', // Mint Green
  '#FB7185', // Coral
  '#FDE047', // Yellow
  '#C084FC', // Purple
  '#E2E8F0', // White/Silver
];

export const BadgeDesignStep = ({
  badge,
  programName,
  programCode,
  onChange,
  onReset,
}) => {
  const handleApplyPreset = (preset) => {
    onChange({
      shape: preset.shape,
      tier: preset.tier,
      emblem: preset.emblem,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      presetId: preset.id,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div>
        <h3 className="text-base font-bold text-[#0F172A] flex items-center space-x-2 font-display">
          <Sparkles className="w-5 h-5 text-[#33409E]" />
          <span>Badge Visual Design & Tier Branding</span>
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          Configure the visual badge identity and metallic tier treatment for this certification.
        </p>
      </div>

      {/* Preset Gallery Carousel */}
      <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            Quick Start Presets
          </span>
          <span className="text-[10px] text-[#64748B]">Click any preset to load its style</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {BADGE_PRESETS.map((preset) => {
            const isSelected = badge.presetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={clsx(
                  'p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between group',
                  isSelected
                    ? 'bg-white border-[#33409E] shadow-sm ring-1 ring-[#33409E]'
                    : 'bg-white/80 border-[#E2E8F0] hover:bg-white hover:border-[#33409E]/30'
                )}
              >
                <div className="my-1">
                  <LiveBadgeRenderer badge={preset} size="xs" />
                </div>
                <p className="text-[11px] font-bold text-[#0F172A] truncate w-full mt-1">
                  {preset.name}
                </p>
                <span className="text-[9px] font-semibold text-[#64748B] uppercase">
                  {preset.tier}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Responsive Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Design Controls (5 / 12) */}
        <div className="lg:col-span-6 space-y-5 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-subtle">
          {/* 1. Badge Shape Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              1. Badge Shape
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SHAPES.map((shapeItem) => {
                const isSelected = badge.shape === shapeItem.id;
                const Icon = shapeItem.icon;
                return (
                  <button
                    key={shapeItem.id}
                    type="button"
                    onClick={() => onChange({ shape: shapeItem.id, presetId: undefined })}
                    className={clsx(
                      'p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all',
                      isSelected
                        ? 'bg-[#33409E] text-white border-[#33409E] shadow-sm'
                        : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white hover:text-[#0F172A]'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-bold">{shapeItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Badge Tier Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              2. Badge Tier & Metallic Treatment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIERS.map((tierItem) => {
                const isSelected = badge.tier === tierItem.id;
                return (
                  <button
                    key={tierItem.id}
                    type="button"
                    onClick={() => onChange({ tier: tierItem.id, presetId: undefined })}
                    className={clsx(
                      'p-2.5 rounded-xl border text-left transition-all',
                      isSelected
                        ? 'bg-[#33409E]/5 border-[#33409E] ring-1 ring-[#33409E]'
                        : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                    )}
                  >
                    <p className="text-xs font-bold text-[#0F172A]">{tierItem.label}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5 truncate">{tierItem.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Emblem Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              3. Center Emblem / Insignia
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {EMBLEMS.map((emblemItem) => {
                const isSelected = badge.emblem === emblemItem.id;
                const Icon = EMBLEM_ICONS[emblemItem.id] || ShieldCheck;
                return (
                  <button
                    key={emblemItem.id}
                    type="button"
                    onClick={() => onChange({ emblem: emblemItem.id, presetId: undefined })}
                    title={emblemItem.label}
                    className={clsx(
                      'p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all',
                      isSelected
                        ? 'bg-[#33409E] text-white border-[#33409E] shadow-sm'
                        : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-white hover:text-[#0F172A]'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] font-semibold truncate w-full text-center">
                      {emblemItem.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Color Controls */}
          <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center space-x-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#33409E]" />
                  <span>Primary Brand Color</span>
                </label>
                <span className="font-mono text-xs text-[#64748B]">{badge.primaryColor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={badge.primaryColor}
                  onChange={(e) =>
                    onChange({ primaryColor: e.target.value, presetId: undefined })
                  }
                  className="w-8 h-8 rounded-lg border border-[#E2E8F0] cursor-pointer bg-transparent p-0"
                />
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {PRIMARY_SWATCHES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => onChange({ primaryColor: color, presetId: undefined })}
                      style={{ backgroundColor: color }}
                      className={clsx(
                        'w-6 h-6 rounded-md border transition-transform',
                        badge.primaryColor.toUpperCase() === color.toUpperCase()
                          ? 'ring-2 ring-[#33409E] scale-110'
                          : 'border-black/10 hover:scale-105'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Secondary Metallic / Accent</span>
                </label>
                <span className="font-mono text-xs text-[#64748B]">{badge.secondaryColor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={badge.secondaryColor}
                  onChange={(e) =>
                    onChange({ secondaryColor: e.target.value, presetId: undefined })
                  }
                  className="w-8 h-8 rounded-lg border border-[#E2E8F0] cursor-pointer bg-transparent p-0"
                />
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {SECONDARY_SWATCHES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => onChange({ secondaryColor: color, presetId: undefined })}
                      style={{ backgroundColor: color }}
                      className={clsx(
                        'w-6 h-6 rounded-md border transition-transform',
                        badge.secondaryColor.toUpperCase() === color.toUpperCase()
                          ? 'ring-2 ring-amber-500 scale-110'
                          : 'border-black/10 hover:scale-105'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-[#64748B] hover:text-[#EF4444] flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Style</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Badge Preview Canvas (6 / 12) */}
        <div className="lg:col-span-6 bg-gradient-to-b from-[#F8FAFC] to-white rounded-2xl border border-[#E2E8F0] p-6 shadow-subtle flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[440px]">
          {/* Subtle Guilloche / Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#33409E_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] pointer-events-none" />

          {/* Top Preview Eyebrow */}
          <div className="mb-6 flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#33409E] bg-[#33409E]/10 px-2.5 py-0.5 rounded-full border border-[#33409E]/20">
              Live Badge Preview
            </span>
          </div>

          {/* Centered Large Vector Badge Renderer */}
          <div className="my-2">
            <LiveBadgeRenderer
              badge={badge}
              size="xl"
              showVerification={true}
              showTierRibbon={false}
            />
          </div>

          {/* Verification Seal Tag */}
          <div className="mt-4 flex items-center space-x-1.5 text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full border border-[#10B981]/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>✓ Verified Digital Credential</span>
          </div>

          {/* Program Title Association */}
          <div className="mt-4 max-w-sm">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {badge.tier} TIER
            </span>
            <h4 className="text-base font-bold text-[#0F172A] mt-1.5 leading-snug line-clamp-2">
              {programName || 'Untitled Certification Program'}
            </h4>
            <p className="text-xs font-mono text-[#64748B] mt-0.5">
              {programCode || 'CLR-PROG-2026'}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="mt-6 pt-4 border-t border-[#E2E8F0] w-full flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Dynamic SVG Vector Asset</span>
            <span>W3C Open Badges 3.0 Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
