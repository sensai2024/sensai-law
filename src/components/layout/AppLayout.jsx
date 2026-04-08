import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import ActionButton from '../ui/ActionButton';
import { RefreshCcw, Plus } from 'lucide-react';

const AppLayout = () => {
    const location = useLocation();
    
    const getPageTitle = (path) => {
        switch (path) {
            case '/': return 'Dashboard';
            case '/transcriptions': return 'Transcriptions';
            case '/crm-approval': return 'CRM Approval';
            case '/contracts': return 'Contracts';
            case '/errors': return 'Pipeline Errors';
            default: return 'Automation Hub';
        }
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Persistent Sidebar */}
            <SidebarNav />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 px-10 flex items-center justify-between border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                        {getPageTitle(location.pathname)}
                    </h2>
                    
                    <div className="flex items-center gap-3">
                        <ActionButton variant="secondary" size="md" icon={RefreshCcw}>
                            Refresh
                        </ActionButton>
                        <ActionButton variant="primary" size="md" icon={Plus}>
                            New transcript
                        </ActionButton>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-10">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
