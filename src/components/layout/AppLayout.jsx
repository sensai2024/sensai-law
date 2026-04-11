import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import SidebarNav from './SidebarNav';
import ActionButton from '../ui/ActionButton';
import { RefreshCcw, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { useLogoutMutation } from '../../features/auth/authHooks';

const AppLayout = () => {
    const location = useLocation();
    const queryClient = useQueryClient();
    const { profile } = useAuth();
    const logoutMutation = useLogoutMutation();

    // Mobile sidebar state — closed by default, always visible on desktop via CSS
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleRefresh = () => {
        queryClient.invalidateQueries();
    };

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    const getPageTitle = (path) => {
        if (path.startsWith('/clients/')) return 'Client Details';
        switch (path) {
            case '/': return 'Dashboard';
            case '/transcriptions': return 'Transcriptions';
            case '/crm-approval': return 'CRM Approval';
            case '/contracts': return 'Contracts';
            case '/clients': return 'Clients';
            case '/errors': return 'Pipeline Errors';
            case '/settings/security': return 'Security Settings';
            case '/admin/users': return 'User Management';
            default: return 'Automation Hub';
        }
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar — always rendered; mobile open state drives visibility */}
            <SidebarNav
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 px-6 lg:px-10 flex items-center justify-between border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        {/* Mobile hamburger — hidden on desktop */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-highlight transition-colors"
                            aria-label="Open navigation"
                            id="sidebar-toggle"
                        >
                            <Menu size={20} />
                        </button>

                        <h2 className="text-xl lg:text-2xl font-bold text-text-primary tracking-tight">
                            {getPageTitle(location.pathname)}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-6">
                        <div className="flex items-center gap-3 pr-4 lg:pr-6 border-r border-border">
                            <ActionButton
                                variant="secondary"
                                size="md"
                                icon={RefreshCcw}
                                onClick={handleRefresh}
                            >
                                <span className="hidden sm:inline">Refresh</span>
                            </ActionButton>
                        </div>

                        <div className="flex items-center gap-3 lg:gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-bold text-text-primary">{profile?.full_name || 'User'}</span>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{profile?.role || 'Guest'}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-primary shadow-gold-glow">
                                <User size={20} />
                            </div>
                            <button
                                onClick={handleLogout}
                                disabled={logoutMutation.isPending}
                                className="p-2 text-text-muted hover:text-status-error transition-colors"
                                title="Log out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-10">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
