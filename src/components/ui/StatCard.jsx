import React from 'react';
import { cn } from '../../lib/utils';

const StatCard = ({ label, value, trend, trendType, className }) => {
  const getTrendColor = (type) => {
    switch (type) {
      case 'success': return 'text-status-success';
      case 'error': return 'text-status-error';
      case 'warning': return 'text-status-warning';
      case 'processing': return 'text-status-processing';
      case 'gold': return 'text-primary';
      default: return 'text-text-muted';
    }
  };

  return (
    <div className={cn(
      'p-6 bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-premium hover:border-primary transition-all duration-300 group',
      className
    )}>
      <p className="text-[10px] font-bold tracking-[0.1em] text-[var(--text-muted)] mb-3 group-hover:text-[var(--text)] transition-colors uppercase">
        {label}
      </p>
      <div className="flex flex-col gap-1">
        <h3 className="text-3xl font-bold text-[var(--text)] tracking-tight">
          {value}
        </h3>
        <p className={cn(
          'text-xs font-medium',
          getTrendColor(trendType)
        )}>
          {trend}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
