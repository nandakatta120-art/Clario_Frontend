import React from 'react';
import clsx from 'clsx';

export const EmptyState = ({ icon: Icon, title, description, action, className }) => {
  return (
    <div className={clsx("flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-dashed border-[#E2E8F0]", className)}>
      <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#64748B]" />
      </div>
      <h3 className="text-lg font-bold text-[#0F172A] mb-2">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
