import React from 'react';
import clsx from 'clsx';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthButton = ({
  children,
  loading = false,
  loadingText,
  variant = 'primary',
  icon: Icon,
  showArrow = true,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative w-full h-11 px-6 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-[#33409E]/25 cursor-pointer select-none active:scale-[0.98] disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden';

  const variants = {
    primary:
      'bg-[#33409E] hover:bg-[#2C3688] text-white shadow-lg shadow-[#33409E]/20 hover:shadow-[#33409E]/30 border border-[#33409E]/40',
    secondary:
      'bg-[#EEF1FA] hover:bg-[#E2E7F6] text-[#33409E] border border-[#7B8AE0]/40 focus:ring-[#33409E]/30 shadow-sm',
    outline:
      'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-[#33409E] focus:ring-[#33409E]/30 shadow-sm',
    ghost:
      'bg-transparent hover:bg-[#EEF1FA] text-[#33409E] hover:text-[#2C3688] border-none focus:ring-[#33409E]/30',
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center space-x-2"
          >
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>{loadingText || children}</span>
          </motion.div>
        ) : (
          <motion.div
            key="normal"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center space-x-2"
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{children}</span>
            {showArrow && (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
