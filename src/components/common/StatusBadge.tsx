import React from 'react';
import { DrainageCondition, ComplaintSeverity, ComplaintStatus, JobStatus, PaymentStatus, WorkerAvailability, VerificationStatus } from '../../types';

interface StatusBadgeProps {
  status: DrainageCondition | ComplaintSeverity | ComplaintStatus | JobStatus | PaymentStatus | WorkerAvailability | VerificationStatus | string;
  type?: 'condition' | 'severity' | 'status' | 'job' | 'payment' | 'availability' | 'verification';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5'
  }[size];

  // Map status to clean municipal styling colors
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  // Condition colors
  if (status === 'Good' || status === 'Clean' || status === 'Resolved' || status === 'Verified' || status === 'Paid' || status === 'Available') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (status === 'Moderate' || status === 'Dirty' || status === 'Medium' || status === 'Pending' || status === 'Travelling') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (status === 'Blocked' || status === 'Critical' || status === 'High' || status === 'Rejected' || status === 'ERROR') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (status === 'Working' || status === 'In Progress' || status === 'RUNNING' || status === 'Approved' || status === 'Accepted' || status === 'Busy') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (status === 'Completed' || status === 'Assigned') {
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  } else if (status === 'Off-duty' || status === 'IDLE' || status === 'STOPPED') {
    colorClasses = 'bg-slate-100 text-slate-600 border-slate-300';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${colorClasses} tracking-tight whitespace-nowrap`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          colorClasses.includes('emerald')
            ? 'bg-emerald-500'
            : colorClasses.includes('rose')
            ? 'bg-rose-500'
            : colorClasses.includes('amber')
            ? 'bg-amber-500'
            : colorClasses.includes('blue')
            ? 'bg-blue-500'
            : colorClasses.includes('indigo')
            ? 'bg-indigo-500'
            : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  );
};
