import React from 'react';

const StageCard = ({ label, count, color }) => {
    return (
        <div className="bg-surface border border-white/5 p-4 rounded-lg flex-1 min-w-[140px] flex flex-col items-center justify-center gap-2 relative overflow-hidden group hover:border-white/10 transition-colors cursor-default">
            <div className={`absolute top-0 left-0 w-full h-1 ${color}`}></div>
            <span className="text-3xl font-bold text-text-primary group-hover:scale-110 transition-transform">{count}</span>
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</span>
        </div>
    );
};

const PipelineView = () => {
    const stages = [
        { label: 'Intake', count: 4, color: 'bg-blue-500' },
        { label: 'Drafting (AI)', count: 12, color: 'bg-indigo-500' },
        { label: 'QA Review', count: 3, color: 'bg-purple-500' },
        { label: 'Client Review', count: 8, color: 'bg-amber-500' },
        { label: 'Finalised', count: 145, color: 'bg-emerald-500' },
    ];

    return (
        <div className="mb-8">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Active Pipeline</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {stages.map((stage, index) => (
                    <StageCard key={index} {...stage} />
                ))}
            </div>
        </div>
    );
};

export default PipelineView;
