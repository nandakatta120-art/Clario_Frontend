import React, { useEffect, useRef } from 'react';
import { AuthBrandPanel } from './AuthBrandPanel';
import { Award, ShieldCheck, Lock } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';

export const AuthLayout = ({ children }) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const isSignUp = location.pathname.includes('signup');

  // Focus management: after panel swap completes, focus the first input if user initiated via navigation
  const formContainerRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formContainerRef.current) {
        const firstInput = formContainerRef.current.querySelector('input:not([disabled])');
        if (firstInput && document.activeElement && document.activeElement.tagName === 'A') {
          firstInput.focus();
        }
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const panelTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] };

  return (
    <div className="min-h-screen w-full bg-[#EEF1FA] flex flex-col justify-between text-slate-900 relative selection:bg-[#33409E]/30 selection:text-slate-900 overflow-x-hidden">
      {/* Main Grid / Flex Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <motion.div
          layout={!prefersReducedMotion}
          transition={panelTransition}
          className="w-full max-w-6xl mx-auto rounded-[32px] overflow-hidden shadow-2xl shadow-[#33409E]/15 border border-[#33409E]/20 relative flex flex-col lg:flex-row bg-[#33409E] min-h-[640px]"
        >
          {/* Login state: Brand Panel on LEFT (order-1), Form Panel on RIGHT (order-2)
              Sign Up state: Form Panel on LEFT (order-1), Brand Panel on RIGHT (order-2) */}

          {/* Saturated Royal Cobalt Brand Showcase Panel (Desktop >= 1024px) */}
          <motion.div
            layout={!prefersReducedMotion}
            transition={panelTransition}
            className={clsx(
              "hidden lg:flex bg-[#33409E] relative z-10 overflow-hidden flex-col justify-between",
              isSignUp ? "order-2 lg:w-[58%] xl:w-[58%]" : "order-1 lg:w-[58%] xl:w-[58%]"
            )}
          >
            <AuthBrandPanel isRightSide={isSignUp} />
          </motion.div>

          {/* Solid Pure White Form Container with Organic Curved Edge */}
          <motion.div
            ref={formContainerRef}
            layout={!prefersReducedMotion}
            transition={panelTransition}
            className={clsx(
              "w-full bg-white text-slate-900 relative z-20 flex flex-col justify-center p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/50",
              isSignUp ? "order-1 lg:w-[42%] xl:w-[42%]" : "order-2 lg:w-[42%] xl:w-[42%]"
            )}
          >
            {/* Desktop Asymmetric Flowing Organic S-Curve Wave Divider SVG */}
            {/* When Login (form on right), curve sits on form's left edge (-left-[48px]) unmirrored.
                When Sign Up (form on left), curve sits on form's right edge (-right-[48px]) mirrored (scale-x-[-1]). */}
            <svg
              className={clsx(
                "hidden lg:block absolute top-0 bottom-0 h-full w-[50px] text-white fill-current pointer-events-none z-20 transition-all duration-500",
                isSignUp
                  ? "-right-[48px] scale-x-[-1] drop-shadow-[4px_0_12px_rgba(0,0,0,0.08)]"
                  : "-left-[48px] scale-x-100 drop-shadow-[-4px_0_12px_rgba(0,0,0,0.08)]"
              )}
              viewBox="0 0 100 1000"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M 100,0 C 70,80 35,200 12,360 C -4,480 22,640 58,760 C 82,850 96,940 100,1000 L 100,0 Z" />
            </svg>

            {/* Mobile / Tablet Header with Brand Badge */}
            <div className="lg:hidden flex flex-col items-center text-center mb-6">
              <Link to="/login" className="flex items-center space-x-2.5 mb-2 group">
                <div className="w-10 h-10 rounded-2xl bg-[#33409E] flex items-center justify-center shadow-md shadow-[#33409E]/25 border border-white/80 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-2xl tracking-tight text-[#33409E]">
                  Clario
                </span>
              </Link>
              <p className="text-xs text-slate-500 font-sans">
                Enterprise Credential & Certificate Infrastructure
              </p>
            </div>

            {/* Main Form Content with Smooth Crossfade Animation on Mode Toggle */}
            <div className="relative z-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={location.pathname}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {children || <Outlet />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile / Compact Trust Badges */}
            <div className="lg:hidden mt-6 flex items-center justify-center space-x-4 text-slate-500 text-xs font-sans">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#33409E]" />
                <span>W3C Compliant</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>256-bit Encrypted</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Global Minimal Light Footer */}
      <footer className="relative z-10 py-3.5 px-6 text-center text-xs text-slate-500 border-t border-[#E2E8F0] bg-[#F8FAFC]/90">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Clario Inc. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-slate-500 font-sans">
            <span className="hover:text-slate-800 transition-colors cursor-default">Enterprise Security</span>
            <span>•</span>
            <span className="hover:text-slate-800 transition-colors cursor-default">Tamper-Proof Audit</span>
            <span>•</span>
            <span className="flex items-center space-x-1.5 hover:text-slate-800 transition-colors cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

