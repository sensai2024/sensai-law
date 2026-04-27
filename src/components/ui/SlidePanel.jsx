// src/components/ui/SlidePanel.jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const SlidePanel = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  width = "max-w-2xl" 
}) => {
  // Prevent scrolling when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div 
        className={cn(
          "relative w-full bg-[var(--bg)] border-l border-[var(--border)] shadow-premium transform transition-transform duration-300 ease-out h-full flex flex-col",
          width,
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]/50">
          <h2 className="text-xl font-bold text-[var(--text)] capitalize">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[var(--surface)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--surface)]/50 flex items-center justify-end gap-3 font-semibold">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlidePanel;
