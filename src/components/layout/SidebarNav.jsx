import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  FileSignature,
  AlertCircle,
  History,
  Users,
  ShieldCheck,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSidebarCountsQuery } from './hooks';
import { useAuth } from '../../features/auth/AuthContext';

const SidebarNav = ({ isOpen, onClose }) => {
  const { data: counts, isLoading } = useSidebarCountsQuery();
  const { isAdmin } = useAuth();

  const navItems = [
    { label: 'OVERVIEW', type: 'category' },
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Transcriptions', path: '/transcriptions', icon: FileText, counter: counts?.transcriptions ?? 0, showBadge: true },
    { label: 'PIPELINES', type: 'category' },
    { label: 'CRM Approval', path: '/crm-approval', icon: UserCheck, counter: counts?.crmApprovals ?? 0, showBadge: true },
    { label: 'Contracts', path: '/contracts', icon: FileSignature, counter: counts?.contracts ?? 0, showBadge: true },
    { label: 'Clients', path: '/clients', icon: Users, counter: counts?.clients ?? 0, showBadge: true },
    { label: 'Errors', path: '/errors', icon: AlertCircle, counter: counts?.errors ?? 0, showBadge: true },
  ];

  if (isAdmin) {
    navItems.push(
      { label: 'ADMINISTRATION', type: 'category' },
      { label: 'Users Management', path: '/admin/users', icon: ShieldCheck }
    );
  }

  navItems.push(
    { label: 'SETTINGS', type: 'category' },
    { label: 'Security', path: '/settings/security', icon: Settings }
  );

  // Close sidebar on nav click (mobile only — desktop ignores onClose no-op)
  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          // Base layout
          'fixed inset-y-0 left-0 z-40 flex flex-col',
          'w-64 bg-surface border-r border-border',
          // Mobile: slide in/out
          'transition-transform duration-300 ease-in-out',
          'lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Branding row with optional mobile close button */}
        <div className="px-6 py-10 flex items-start justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-primary tracking-tight">Altata Légal</h1>
            <p className="text-[10px] font-bold tracking-[0.2em] text-text-muted mt-1 uppercase">
              Automation Hub
            </p>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-highlight transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable navigation area */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-4">
          {navItems.map((item, index) => {
            if (item.type === 'category') {
              return (
                <p
                  key={index}
                  className="px-2 pt-6 pb-2 text-[10px] font-bold tracking-widest text-text-muted uppercase"
                >
                  {item.label}
                </p>
              );
            }

            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) => cn(
                  'group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-gold-glow'
                    : 'text-text-secondary hover:bg-surface-highlight hover:text-text-primary'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="transition-colors group-hover:text-primary" />
                  {item.label}
                </div>
                {item.showBadge && (
                  <span className={cn(
                    'flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full text-[10px] font-bold',
                    isLoading ? 'bg-surface-elevated animate-pulse text-transparent' :
                    item.label === 'Errors' && item.counter > 0 ? 'bg-status-error text-white' :
                    'bg-primary/20 text-primary'
                  )}>
                    {isLoading ? '0' : item.counter}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer — always pinned at bottom */}
        <div className="p-6 border-t border-border flex-shrink-0 bg-surface-highlight/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <span className="text-[10px] font-bold text-text-secondary uppercase">n8n connected</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <History size={12} />
            <span className="text-[9px] font-medium">Last sync: 2 mins ago</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarNav;
