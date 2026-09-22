import React from 'react';
import {
  ShieldCheck,
  Award,
  GraduationCap,
  Cloud,
  Lock,
  Database,
  Cpu,
  Code2,
  Star,
  Zap,
  FileCheck,
  Crown,
  CheckCircle2,
} from 'lucide-react';
import clsx from 'clsx';

const SIZE_CONFIGS = {
  xs: { width: 24, height: 24, iconSize: 12, strokeWidth: 1.5 },
  sm: { width: 44, height: 44, iconSize: 20, strokeWidth: 2 },
  md: { width: 68, height: 68, iconSize: 30, strokeWidth: 2.5 },
  lg: { width: 128, height: 128, iconSize: 52, strokeWidth: 3 },
  xl: { width: 176, height: 176, iconSize: 72, strokeWidth: 3.5 },
};

const TIER_METALLICS = {
  FOUNDATION: {
    ringColor1: '#94A3B8',
    ringColor2: '#CBD5E1',
    glow: 'rgba(148, 163, 184, 0.25)',
    label: 'FOUNDATION',
    pillBg: 'bg-slate-100',
    pillText: 'text-slate-700',
    pillBorder: 'border-slate-300',
  },
  STANDARD: {
    ringColor1: '#33409E',
    ringColor2: '#7B8AE0',
    glow: 'rgba(51, 64, 158, 0.25)',
    label: 'STANDARD',
    pillBg: 'bg-blue-50',
    pillText: 'text-[#33409E]',
    pillBorder: 'border-[#33409E]/30',
  },
  GOLD: {
    ringColor1: '#F59E0B',
    ringColor2: '#FDE68A',
    glow: 'rgba(245, 158, 11, 0.35)',
    label: 'GOLD TIER',
    pillBg: 'bg-amber-50',
    pillText: 'text-amber-800',
    pillBorder: 'border-amber-300',
  },
  PLATINUM: {
    ringColor1: '#94A3B8',
    ringColor2: '#F8FAFC',
    glow: 'rgba(203, 213, 225, 0.4)',
    label: 'PLATINUM',
    pillBg: 'bg-indigo-50',
    pillText: 'text-indigo-800',
    pillBorder: 'border-indigo-200',
  },
};

export const EMBLEM_ICONS = {
  SHIELD_CHECK: ShieldCheck,
  AWARD: Award,
  GRADUATION_CAP: GraduationCap,
  CLOUD: Cloud,
  LOCK: Lock,
  DATABASE: Database,
  CPU: Cpu,
  CODE: Code2,
  STAR: Star,
  ZAP: Zap,
  CERTIFICATE: FileCheck,
  LEADERSHIP: Crown,
};

export const LiveBadgeRenderer = ({
  badge,
  size = 'md',
  showVerification = false,
  showTierRibbon = false,
  className,
}) => {
  // Fallback defaults if badge is undefined
  const shape = badge?.shape || 'SHIELD';
  const tier = badge?.tier || 'GOLD';
  const emblemKey = badge?.emblem || 'SHIELD_CHECK';
  const primaryColor = badge?.primaryColor || '#33409E';
  const secondaryColor = badge?.secondaryColor || '#F59E0B';

  const sizeCfg = SIZE_CONFIGS[size];
  const tierCfg = TIER_METALLICS[tier];
  const EmblemIcon = EMBLEM_ICONS[emblemKey] || ShieldCheck;

  // Unique gradient IDs to prevent SVG gradient collisions
  const gradIdPrimary = React.useId();
  const gradIdRing = React.useId();
  const filterIdShadow = React.useId();

  // Render SVG Path depending on shape
  const renderShapePath = () => {
    switch (shape) {
      case 'SHIELD':
        return (
          <path
            d="M50 4 C76 4, 92 14, 92 34 C92 68, 64 88, 50 96 C36 88, 8 68, 8 34 C8 14, 24 4, 50 4 Z"
            fill={`url(#${gradIdPrimary})`}
            stroke={`url(#${gradIdRing})`}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        );
      case 'HEXAGON':
        return (
          <polygon
            points="50,4 92,26 92,74 50,96 8,74 8,26"
            fill={`url(#${gradIdPrimary})`}
            stroke={`url(#${gradIdRing})`}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        );
      case 'CIRCLE':
        return (
          <circle
            cx="50"
            cy="50"
            r="44"
            fill={`url(#${gradIdPrimary})`}
            stroke={`url(#${gradIdRing})`}
            strokeWidth="5"
          />
        );
      case 'MEDAL':
        return (
          <g>
            {/* Draped Ribbon Tails */}
            <polygon points="32,70 20,98 36,92 50,98 42,70" fill={secondaryColor} opacity="0.85" />
            <polygon points="68,70 80,98 64,92 50,98 58,70" fill={secondaryColor} opacity="0.85" />
            {/* Medallion Circle */}
            <circle
              cx="50"
              cy="46"
              r="40"
              fill={`url(#${gradIdPrimary})`}
              stroke={`url(#${gradIdRing})`}
              strokeWidth="5"
            />
          </g>
        );
      case 'RIBBON':
        return (
          <g>
            {/* Heraldic Ribbon Wing accents */}
            <path
              d="M10 65 L4 88 L22 80 L35 88 L30 65 Z"
              fill={secondaryColor}
              opacity="0.9"
            />
            <path
              d="M90 65 L96 88 L78 80 L65 88 L70 65 Z"
              fill={secondaryColor}
              opacity="0.9"
            />
            {/* Crest Shield */}
            <path
              d="M50 6 C74 6, 88 15, 88 35 C88 65, 62 84, 50 92 C38 84, 12 65, 12 35 C12 15, 26 6, 50 6 Z"
              fill={`url(#${gradIdPrimary})`}
              stroke={`url(#${gradIdRing})`}
              strokeWidth="5"
              strokeLinejoin="round"
            />
          </g>
        );
      case 'STAR':
        return (
          <polygon
            points="50,4 62,20 82,14 80,34 98,44 86,60 94,80 74,80 62,96 50,84 38,96 26,80 6,80 14,60 2,44 20,34 18,14 38,20"
            fill={`url(#${gradIdPrimary})`}
            stroke={`url(#${gradIdRing})`}
            strokeWidth="4"
            strokeLinejoin="round"
          />
        );
      default:
        return (
          <circle
            cx="50"
            cy="50"
            r="44"
            fill={`url(#${gradIdPrimary})`}
            stroke={`url(#${gradIdRing})`}
            strokeWidth="5"
          />
        );
    }
  };

  return (
    <div className={clsx('relative flex flex-col items-center select-none', className)}>
      {/* SVG Vector Badge Asset */}
      <div
        style={{
          width: sizeCfg.width,
          height: sizeCfg.height,
          filter: `drop-shadow(0 4px 12px ${tierCfg.glow})`,
        }}
        className="relative flex items-center justify-center transform transition-transform duration-200 hover:scale-105"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary Background Gradient */}
            <linearGradient id={gradIdPrimary} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.82" />
            </linearGradient>

            {/* Metallic Ring Bevel Gradient */}
            <linearGradient id={gradIdRing} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={tierCfg.ringColor2} />
              <stop offset="50%" stopColor={secondaryColor || tierCfg.ringColor1} />
              <stop offset="100%" stopColor={tierCfg.ringColor1} />
            </linearGradient>
          </defs>

          {/* Render Active Geometric Path */}
          {renderShapePath()}

          {/* Inner Decorative Inset Bevel Ring */}
          {shape === 'SHIELD' && (
            <path
              d="M50 12 C70 12, 82 20, 82 36 C82 62, 59 78, 50 84 C41 78, 18 62, 18 36 C18 20, 30 12, 50 12 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
          )}

          {shape === 'HEXAGON' && (
            <polygon
              points="50,12 84,30 84,70 50,88 16,70 16,30"
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
          )}

          {shape === 'CIRCLE' && (
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
          )}
        </svg>

        {/* Center Vector Emblem Icon */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none text-white drop-shadow-sm"
          style={{
            transform: shape === 'MEDAL' ? 'translateY(-4px)' : 'none',
          }}
        >
          <EmblemIcon
            size={sizeCfg.iconSize}
            className="text-white drop-shadow-md stroke-[2.2]"
          />
        </div>

        {/* Verification Checkmark Seal Overlay */}
        {showVerification && (
          <div className="absolute -top-1 -right-1 bg-[#10B981] text-white p-0.5 rounded-full ring-2 ring-white shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Optional Tier Ribbon / Badge Underneath */}
      {showTierRibbon && (
        <div className="mt-2.5 flex items-center justify-center">
          <span
            className={clsx(
              'text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border shadow-xs',
              tierCfg.pillBg,
              tierCfg.pillText,
              tierCfg.pillBorder
            )}
          >
            {tierCfg.label}
          </span>
        </div>
      )}
    </div>
  );
};
