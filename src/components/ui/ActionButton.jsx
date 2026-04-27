import React from 'react';
import { cn } from '../../lib/utils';

const ActionButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  icon: Icon,
  isLoading,
  disabled,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-[#0f172a] dark:text-[var(--bg)] hover:bg-primary-hover shadow-gold-glow font-semibold',
    secondary: 'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface)]/80 border border-[var(--border)]',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]',
    danger: 'bg-status-error text-white hover:bg-status-error/90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : 18} />
      )}
      {children}
    </button>
  );
};


export default ActionButton;
