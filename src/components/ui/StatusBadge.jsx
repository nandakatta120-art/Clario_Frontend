import React from 'react';
import clsx from 'clsx';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

const statusConfig = {
  VERIFIED: { colorClass: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20', icon: CheckCircle2, label: 'Verified' },
  APPROVED: { colorClass: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20', icon: CheckCircle2, label: 'Approved' },
  PENDING: { colorClass: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20', icon: Clock, label: 'Pending' },
  IN_REVIEW: { colorClass: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20', icon: Clock, label: 'In Review' },
  REJECTED: { colorClass: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', icon: XCircle, label: 'Rejected' },
  REVOKED: { colorClass: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', icon: XCircle, label: 'Revoked' },
  ERROR: { colorClass: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', icon: AlertCircle, label: 'Error' },
};

export const StatusBadge = ({ status, className }) => {
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <span className={clsx('inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm', config.colorClass, className)}>
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};
