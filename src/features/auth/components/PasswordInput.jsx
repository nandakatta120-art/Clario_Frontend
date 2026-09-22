import React, { useState, forwardRef } from 'react';
import { Lock, Eye, EyeOff, Check } from 'lucide-react';
import { AuthInput } from './AuthInput';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const PasswordInput = forwardRef(
  ({ showCriteria = false, criteria = [], ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const toggleButton = (
      <button
        type="button"
        onClick={toggleVisibility}
        className="text-slate-400 hover:text-[#33409E] focus:outline-none focus:text-[#33409E] transition-colors p-1 rounded-full cursor-pointer relative w-6 h-6 flex items-center justify-center"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        title={showPassword ? 'Hide password' : 'Show password'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {showPassword ? (
            <motion.div
              key="eyeOff"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <EyeOff className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="eye"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <Eye className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );

    return (
      <div className="w-full space-y-2">
        <AuthInput
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          rightElement={toggleButton}
          {...props}
        />

        <AnimatePresence>
          {showCriteria && criteria.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5 overflow-hidden"
            >
              <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                Password Requirements
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                {criteria.map((item, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'flex items-center space-x-1.5 text-xs transition-colors duration-150',
                      item.met ? 'text-emerald-700 font-semibold' : 'text-slate-500'
                    )}
                  >
                    {item.met ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                        <div className="w-1 h-1 rounded-full bg-slate-400" />
                      </div>
                    )}
                    <span className="text-[11px]">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
