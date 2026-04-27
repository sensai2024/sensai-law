import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

const ThemeToggle = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
        'text-text-secondary hover:bg-surface-highlight hover:text-text-primary',
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative flex items-center justify-center w-5 h-5 overflow-hidden">
        <Sun
          size={18}
          className={cn(
            'absolute transition-all duration-500 transform',
            theme === 'dark' ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-10 opacity-0 rotate-90'
          )}
        />
        <Moon
          size={18}
          className={cn(
            'absolute transition-all duration-500 transform text-primary',
            theme === 'light' ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-10 opacity-0 -rotate-90'
          )}
        />
      </div>
      <span className="flex-1 text-left transition-colors duration-300">
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </span>
      
      {/* Visual indicator / switch-like feel */}
      <div className="w-8 h-4 rounded-full bg-surface-accent relative transition-colors duration-300 overflow-hidden">
        <div 
          className={cn(
            "absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-all duration-300 shadow-sm",
            theme === 'dark' 
              ? "translate-x-0 bg-text-muted" 
              : "translate-x-4 bg-primary"
          )} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
