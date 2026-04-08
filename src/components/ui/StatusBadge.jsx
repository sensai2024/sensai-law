import React from 'react';
import { cn } from '../../lib/utils';

const StatusBadge = ({ status, className }) => {
  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (['generated', 'success', 'approved', 'high'].includes(s)) {
      return 'bg-status-success/10 text-status-success border-status-success/20';
    }
    if (['failed', 'error', 'unresolved', 'low'].includes(s)) {
      return 'bg-status-error/10 text-status-error border-status-error/20';
    }
    if (['pending', 'warning', 'retrying', 'medium'].includes(s)) {
      return 'bg-status-warning/10 text-status-warning border-status-warning/20';
    }
    if (['processing', 'info'].includes(s)) {
      return 'bg-status-processing/10 text-status-processing border-status-processing/20';
    }
    return 'bg-surface-accent text-text-secondary border-border';
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border transition-colors',
      getStatusStyles(status),
      className
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;
