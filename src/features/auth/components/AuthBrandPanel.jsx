import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Award, ShieldCheck, CheckCircle2, Lock, Sparkles, QrCode } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Count-up helper component for stats
const CountUpStat = ({
  target,
  suffix = '',
  prefix = '',
  decimals = 0,
}) => {
  const [count, setCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = start + (target - start) * easeProgress;
      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [target, prefersReducedMotion]);

  return (
    <span>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

// Credential card schemas for rotating carousel
const CREDENTIAL_ITEMS = [
  {
    id: 'executive',
    type: 'Executive Credential',
    issuer: 'Clario Verified Issuer PKI',
    status: 'VERIFIED VALID',
    awardedLabel: 'Awarded To',
    recipientName: 'Dr. Elena Rostova',
    certificationTitle: 'Executive Certification in AI Governance & Data Ethics',
    uuid: 'CP-8924-E71A-2026',
    algorithm: 'SHA-256 / Ed25519',
    IconComponent: ShieldCheck,
  },
  {
    id: 'security',
    type: 'Security Compliance',
    issuer: 'Clario Trust Network PKI',
    status: 'VERIFIED VALID',
    awardedLabel: 'Certified Specialist',
    recipientName: 'Marcus Vance, CISO',
    certificationTitle: 'ISO 27001 Security Compliance & Threat Defense',
    uuid: 'CP-4109-S92B-2026',
    algorithm: 'ECDSA / secp256k1',
    IconComponent: Lock,
  },
  {
    id: 'technical',
    type: 'Technical Credential',
    issuer: 'Clario Protocol Node PKI',
    status: 'VERIFIED VALID',
    awardedLabel: 'Accredited Engineer',
    recipientName: 'Aisha Patel, Senior Architect',
    certificationTitle: 'Verified Blockchain & Cryptographic Protocol Developer',
    uuid: 'CP-6731-T48C-2026',
    algorithm: 'BLS12-381 / ZK-SNARK',
    IconComponent: Award,
  },
];

// Live activity feed signals
const ACTIVITY_SIGNALS = [
  'Credential verified 2s ago',
  'New credential issued 8s ago',
  'Signature validated 3s ago',
  'Tamper check passed 1s ago',
];

export const AuthBrandPanel = ({ isRightSide: propIsRightSide }) => {
  const location = useLocation();
  const isRightSide = propIsRightSide ?? location.pathname.includes('signup');
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef(null);

  // Carousel state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Activity signal state
  const [activityIndex, setActivityIndex] = useState(0);

  // Mouse Parallax tilt state (capped at max ~5deg)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsPaused(false);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  // Auto-advancing card carousel timer
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    const timer = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % CREDENTIAL_ITEMS.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [prefersReducedMotion, isPaused]);

  // Auto-advancing live activity indicator timer
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % ACTIVITY_SIGNALS.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  // Stagger animation container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const currentCredential = CREDENTIAL_ITEMS[currentCardIndex];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={clsx(
        "relative w-full h-full flex flex-col justify-between py-6 lg:py-7 xl:py-8 text-white select-none transition-all duration-500",
        isRightSide
          ? "pl-16 lg:pl-20 xl:pl-24 pr-6 lg:pr-7 xl:pr-8"
          : "pr-16 lg:pr-20 xl:pr-24 pl-6 lg:pl-7 xl:pl-8"
      )}
    >
      {/* STEP 7: Ambient Verification-Network Texture (Drifting Faint Graph) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.svg
          className="w-full h-full opacity-10"
          viewBox="0 0 600 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [-6, 6, -6],
                  x: [-3, 3, -3],
                }
          }
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <path
            d="M 60,100 L 220,160 L 380,80 L 520,220 M 220,160 L 160,340 L 340,400 L 520,220 M 160,340 L 70,520 L 250,600 L 340,400 M 250,600 L 450,560 L 530,680 M 340,400 L 450,560"
            stroke="#7B8AE0"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <circle cx="60" cy="100" r="3" fill="#7B8AE0" />
          <circle cx="220" cy="160" r="4" fill="#C3CBEF" />
          <circle cx="380" cy="80" r="3" fill="#7B8AE0" />
          <circle cx="520" cy="220" r="4" fill="#C3CBEF" />
          <circle cx="160" cy="340" r="3" fill="#7B8AE0" />
          <circle cx="340" cy="400" r="4" fill="#C3CBEF" />
          <circle cx="70" cy="520" r="3" fill="#7B8AE0" />
          <circle cx="250" cy="600" r="4" fill="#C3CBEF" />
          <circle cx="450" cy="560" r="3" fill="#7B8AE0" />
          <circle cx="530" cy="680" r="4" fill="#C3CBEF" />
        </motion.svg>
      </div>

      {/* Top Brand Logo & Header */}
      <div className="relative z-10 space-y-3">
        {/* Brand Logo & Pill */}
        <motion.div variants={itemVariants} className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shadow-md">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-xl tracking-tight text-[#F8FAFC]">
                Clario
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-[#F8FAFC] border border-white/25 shadow-sm">
                Enterprise
              </span>
            </div>
            <p className="text-[11px] text-[#C3CBEF] font-sans">Digital Credentials & Verification Platform</p>
          </div>
        </motion.div>

        {/* STEP 2: Eyebrow Label & Headline */}
        <motion.div variants={itemVariants} className="space-y-1.5 max-w-md">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[#C3CBEF] text-[10px] font-bold uppercase tracking-widest shadow-sm">
            <ShieldCheck className="w-3 h-3 text-[#7B8AE0]" />
            <span>Enterprise-Grade Verification</span>
          </div>

          <h1 className="font-display text-2xl lg:text-[26px] font-bold tracking-tight text-[#F8FAFC] leading-snug">
            Trusted digital credentials for modern organizations.
          </h1>
          <p className="text-xs sm:text-[13px] text-[#C3CBEF] leading-relaxed font-sans">
            Create, issue, and cryptographically verify tamper-proof certificates and badges at enterprise scale.
          </p>
        </motion.div>
      </div>

      {/* Middle: STEP 4 Credential Card Carousel Showcase */}
      <motion.div
        variants={itemVariants}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="relative z-10 my-2"
        style={{ perspective: 1000 }}
      >
        <motion.div
          style={{
            rotateX: prefersReducedMotion ? 0 : rotateX,
            rotateY: prefersReducedMotion ? 0 : rotateY,
          }}
          animate={prefersReducedMotion ? {} : { y: [0, -4, 0] }}
          transition={
            prefersReducedMotion
              ? {}
              : {
                  repeat: Infinity,
                  duration: 6,
                  ease: 'easeInOut',
                }
          }
          className="relative max-w-md mx-auto"
        >
          {/* Solid Opaque Light Credential Card Container */}
          <div className="relative bg-white rounded-2xl border border-white/30 p-4 sm:p-5 shadow-2xl shadow-black/20 space-y-3 text-slate-900">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentCredential.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-3"
              >
                {/* Header of Credential */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#EEF1FA] border border-[#7B8AE0]/30 flex items-center justify-center shadow-sm">
                      <currentCredential.IconComponent className="w-4 h-4 text-[#33409E]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#1E293B] font-sans">
                        {currentCredential.type}
                      </p>
                      <p className="text-[10px] text-[#64748B] font-sans">
                        {currentCredential.issuer}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
                    <span>{currentCredential.status}</span>
                  </div>
                </div>

                {/* Credential Content */}
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#33409E] font-sans">
                    {currentCredential.awardedLabel}
                  </p>
                  <h3 className="font-display text-base font-bold text-[#1E293B] tracking-tight">
                    {currentCredential.recipientName}
                  </h3>
                  <p className="text-xs text-[#64748B] font-medium font-sans">
                    {currentCredential.certificationTitle}
                  </p>
                </div>

                {/* Meta & Cryptographic Fingerprint */}
                <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80 flex items-center justify-between text-[11px]">
                  <div className="space-y-0.5">
                    <p className="text-[#64748B] text-[10px] font-sans">Credential UUID</p>
                    <p className="font-mono text-[#1E293B] font-bold text-[11px]">{currentCredential.uuid}</p>
                  </div>
                  <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
                    <QrCode className="w-5 h-5 text-slate-400" />
                    <div className="text-right">
                      <p className="text-[9px] text-[#64748B] font-sans">Algorithm</p>
                      <p className="font-mono text-[10px] text-[#33409E] font-semibold">{currentCredential.algorithm}</p>
                    </div>
                  </div>
                </div>

                {/* STEP 5: Extended Compliance Badges Grid (6 Total Trust Seals) */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] text-[#64748B] font-sans border-t border-slate-100">
                  <span className="flex items-center space-x-1" title="W3C Verifiable Credentials">
                    <CheckCircle2 className="w-3 h-3 text-[#33409E] shrink-0" />
                    <span className="font-medium text-slate-700 truncate">W3C Standard</span>
                  </span>
                  <span className="flex items-center space-x-1" title="Cryptographically Tamper-Proof">
                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700 truncate">Tamper-Proof</span>
                  </span>
                  <span className="flex items-center space-x-1" title="Instant Revocation Registry">
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="font-medium text-slate-700 truncate">Instant Revoke</span>
                  </span>
                  <span className="flex items-center space-x-1" title="SOC 2 Type II Certified">
                    <ShieldCheck className="w-3 h-3 text-[#33409E] shrink-0" />
                    <span className="font-medium text-slate-700 truncate">SOC 2 Type II</span>
                  </span>
                  <span className="flex items-center space-x-1" title="GDPR & Privacy Compliant">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-700 truncate">GDPR Ready</span>
                  </span>
                  <span className="flex items-center space-x-1" title="ISO 27001 InfoSec Compliant">
                    <Award className="w-3 h-3 text-[#33409E] shrink-0" />
                    <span className="font-medium text-slate-700 truncate">ISO 27001</span>
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Navigation Dots & STEP 3: Live Activity Signal */}
          <div className="flex items-center justify-between mt-2.5 px-2">
            {/* Carousel Dot Indicators */}
            <div className="flex items-center space-x-1.5" role="tablist" aria-label="Credential variants">
              {CREDENTIAL_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentCardIndex(idx)}
                  className={clsx(
                    'h-1.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50',
                    idx === currentCardIndex ? 'w-5 bg-white shadow-sm' : 'w-1.5 bg-white/30 hover:bg-white/60'
                  )}
                  aria-label={`View ${item.type}`}
                  aria-selected={idx === currentCardIndex}
                  role="tab"
                />
              ))}
            </div>

            {/* STEP 3: Live Activity Signal */}
            <div className="flex items-center space-x-1.5 text-[11px] text-[#C3CBEF] font-sans">
              <span className="relative flex h-2 w-2 shrink-0">
                {!prefersReducedMotion && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>

              <AnimatePresence mode="wait">
                <motion.span
                  key={activityIndex}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-[10px] sm:text-[11px] tracking-wide"
                >
                  {ACTIVITY_SIGNALS[activityIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Area: Metrics & STEP 6: Trusted-By Logo Strip */}
      <div className="relative z-10 space-y-3 pt-2">
        {/* Count-Up Platform Metrics */}
        <motion.div variants={itemVariants} className="pt-2 border-t border-white/15">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="font-display text-lg lg:text-xl font-bold text-[#F8FAFC] tracking-tight">
                <CountUpStat target={500} suffix="K+" />
              </p>
              <p className="text-[10px] text-[#C3CBEF] mt-0.5 font-sans">Credentials Issued</p>
            </div>
            <div className="border-x border-white/15">
              <p className="font-display text-lg lg:text-xl font-bold text-emerald-400 tracking-tight">
                <CountUpStat target={99.99} suffix="%" decimals={2} />
              </p>
              <p className="text-[10px] text-[#C3CBEF] mt-0.5 font-sans">Verification Uptime</p>
            </div>
            <div>
              <p className="font-display text-lg lg:text-xl font-bold text-[#F8FAFC] tracking-tight">
                &lt; <CountUpStat target={50} suffix="ms" />
              </p>
              <p className="text-[10px] text-[#C3CBEF] mt-0.5 font-sans">Query Latency</p>
            </div>
          </div>
        </motion.div>

        {/* STEP 6: Compact Trusted-By Logo Strip */}
        <motion.div variants={itemVariants} className="pt-2 border-t border-white/10">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#C3CBEF]/60 text-center mb-1.5 font-sans">
            Trusted by verification leaders at
          </p>
          <div className="flex flex-wrap items-center justify-between gap-1.5 px-2 text-white/50 text-[10px] font-mono font-bold tracking-wider">
            <span className="hover:text-white/80 transition-colors">AETHER LABS</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-white/80 transition-colors">NOVAPATH</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-white/80 transition-colors">QUANTUM PKI</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-white/80 transition-colors">VERTEX AI</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-white/80 transition-colors">SYNERGY</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
