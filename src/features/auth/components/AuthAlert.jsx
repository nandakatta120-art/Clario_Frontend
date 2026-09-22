import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthAlert = ({
  title,
  message,
  variant = 'error',
  onClose,
  className,
}) => {
  const variantStyles = {
    error: {
      container: 'bg-rose-50/90 border-rose-200 text-rose-900 shadow-sm shadow-rose-100',
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
      titleColor: 'text-rose-900',
      textColor: 'text-rose-700',
    },
    warning: {
      container: 'bg-amber-50/90 border-amber-200 text-amber-900 shadow-sm shadow-amber-100',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
      titleColor: 'text-amber-900',
      textColor: 'text-amber-700',
    },
    success: {
      container: 'bg-emerald-50/90 border-emerald-200 text-emerald-900 shadow-sm shadow-emerald-100',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
      titleColor: 'text-emerald-900',
      textColor: 'text-emerald-700',
    },
    info: {
      container: 'bg-[#EEF1FA] border-[#7B8AE0]/40 text-[#33409E] shadow-sm shadow-[#EEF1FA]',
      icon: <Info className="w-4 h-4 text-[#33409E] shrink-0 mt-0.5" />,
      titleColor: 'text-[#33409E]',
      textColor: 'text-slate-700',
    },
  };

  const current = variantStyles[variant];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        role="alert"
        className={clsx(
          'w-full p-3.5 rounded-xl border flex items-start space-x-3 text-xs animate-shake',
          current.container,
          className
        )}
      >
        {current.icon}
        <div className="flex-1 space-y-0.5">
          {title && <p className={clsx('font-semibold tracking-wide', current.titleColor)}>{title}</p>}
          <p className={clsx('leading-relaxed', current.textColor)}>{message}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors -mr-1 -mt-1 cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
