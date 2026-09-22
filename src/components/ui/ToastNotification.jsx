import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    (title, options) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = {
        id,
        title,
        type: options?.type || 'success',
        message: options?.message,
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, options?.duration || 4000);
    },
    []
  );

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Portal / Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-md w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              'pointer-events-auto bg-white rounded-xl shadow-light-float border p-4 flex items-start space-x-3 transform transition-all duration-300 ease-out animate-slide-up',
              toast.type === 'success' && 'border-[#10B981]/30 bg-white',
              toast.type === 'error' && 'border-[#EF4444]/30 bg-white',
              toast.type === 'info' && 'border-[#33409E]/30 bg-white'
            )}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#EF4444]" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#33409E]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0F172A]">{toast.title}</p>
              {toast.message && <p className="text-xs text-[#64748B] mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (title) => console.log('Toast:', title),
    };
  }
  return context;
};
