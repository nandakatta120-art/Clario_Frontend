import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthInput = forwardRef(
  (
    {
      label,
      id,
      icon: Icon,
      error,
      helperText,
      rightElement,
      badge,
      className,
      disabled,
      value,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <label
            htmlFor={id}
            className={clsx(
              'block text-xs font-semibold tracking-wide transition-colors duration-150',
              error
                ? 'text-rose-600'
                : isFocused
                ? 'text-[#1E293B]'
                : 'text-slate-700'
            )}
          >
            {label}
          </label>
          {badge}
        </div>

        <div className="relative rounded-full transition-all group">
          {Icon && (
            <div
              className={clsx(
                'absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 flex items-center justify-center',
                error
                  ? 'text-rose-400'
                  : isFocused
                  ? 'text-[#33409E]'
                  : 'text-slate-400'
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            className={clsx(
              'w-full bg-slate-50/80 text-slate-900 text-sm rounded-full border py-2.5 transition-all duration-200 outline-none font-sans',
              'placeholder:text-slate-400 placeholder:text-sm',
              'disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed',
              Icon ? 'pl-11' : 'pl-4',
              rightElement ? 'pr-12' : 'pr-4',
              error
                ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 text-rose-950'
                : 'border-slate-200 hover:border-slate-300 focus:border-[#33409E] focus:ring-4 focus:ring-[#33409E]/20 focus:bg-white shadow-sm shadow-slate-100',
              className
            )}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        <AnimatePresence>
          {error ? (
            <motion.p
              id={`${id}-error`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-[11px] text-rose-600 font-medium px-2"
            >
              {error}
            </motion.p>
          ) : helperText ? (
            <p id={`${id}-helper`} className="text-[11px] text-slate-500 px-2">
              {helperText}
            </p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
