import React from 'react';
import KPIGrid from '../components/dashboard/KPIGrid';
import PipelineView from '../components/dashboard/PipelineView';
import AlertsPanel from '../components/dashboard/AlertsPanel';

const Dashboard = () => {
    return (
        <div className="h-full flex flex-col gap-6">
            <div className="mb-2">
                <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
                <p className="text-text-secondary">Overview of legal production status</p>
            </div>

            <KPIGrid />

            <div className="flex flex-col lg:flex-row gap-6 flex-1">
                <div className="flex-1">
                    <PipelineView />

                    <div className="bg-surface rounded-lg p-6 border border-white/5 min-h-[300px] flex items-center justify-center text-text-secondary border-dashed">
                        <span>Utilization Chart Placeholder (Analytics)</span>
                    </div>
                </div>

                <div className="w-full lg:w-[320px]">
                    <AlertsPanel />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
