import React from 'react';
import clsx from 'clsx';
export const KPICard = ({ title, value, icon: Icon, trend, className }) => {
  return (
    <div className={clsx("bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-subtle flex flex-col", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">{title}</p>
          <h3 className="font-display text-2xl font-bold text-[#0F172A] tracking-tight">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#33409E]">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center space-x-1.5 text-xs font-medium">
          <span className={trend.isPositive ? "text-[#10B981]" : "text-[#EF4444]"}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
          <span className="text-[#64748B]">vs last month</span>
        </div>
      )}
    </div>
  );
};
