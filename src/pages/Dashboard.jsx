import React from 'react';
import KPIGrid from '../components/dashboard/KPIGrid';
import PipelineView from '../components/dashboard/PipelineView';
import AlertsPanel from '../components/dashboard/AlertsPanel';

const Dashboard = () => {
    return (
        <div className="h-full flex flex-col gap-4 md:gap-6 p-4 md:p-6 lg:p-0 overflow-y-auto lg:overflow-hidden">
            <div className="mb-2 shrink-0">
                <h1 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight">Dashboard</h1>
                <p className="text-text-secondary mt-1 text-sm md:text-base">Overview of legal production status</p>
            </div>

            <KPIGrid />

            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 flex-1 lg:overflow-hidden min-h-0">
                <div className="flex-1 flex flex-col gap-4 md:gap-6 lg:overflow-y-auto custom-scrollbar pr-0 lg:pr-2">
                    <PipelineView />

                    <div className="bg-surface rounded-xl p-6 border border-white/5 min-h-[300px] flex items-center justify-center text-text-secondary border-dashed shrink-0 hover:bg-white/[0.02] transition-colors">
                        <span>Utilization Chart Placeholder (Analytics)</span>
                    </div>
                </div>

                <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 lg:overflow-y-auto custom-scrollbar p-1">
                    <AlertsPanel />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
