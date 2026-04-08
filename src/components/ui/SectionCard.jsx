import React from 'react';
import { cn } from '../../lib/utils';

const SectionCard = ({ title, children, className, headerActions }) => {
  return (
    <div className={cn(
      'bg-surface rounded-xl border border-border shadow-premium flex flex-col',
      className
    )}>
      {(title || headerActions) && (
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          {title && (
            <h4 className="text-[11px] font-bold tracking-[0.15em] text-text-muted uppercase">
              {title}
            </h4>
          )}
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className="p-6 flex-1">
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
