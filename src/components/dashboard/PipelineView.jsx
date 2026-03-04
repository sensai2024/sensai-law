import React from 'react';

const StageCard = ({ label, count, color }) => {
    return (
        <div className="bg-surface border border-white/5 p-4 rounded-xl flex-1 min-w-[140px] md:min-w-[160px] flex flex-col items-center justify-center gap-2 relative overflow-hidden group hover:border-white/10 hover:bg-white/[0.02] transition-all cursor-default shadow-sm hover:shadow-md">
            <div className={`absolute top-0 left-0 w-full h-1 md:h-1.5 opacity-80 group-hover:opacity-100 transition-opacity ${color}`}></div>
            <span className="text-3xl md:text-4xl font-bold text-text-primary group-hover:scale-110 transition-transform duration-300">{count}</span>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider group-hover:text-text-primary transition-colors">{label}</span>
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
        <div className="mb-2 shrink-0">
            <h2 className="text-base md:text-lg font-semibold text-text-primary mb-3 md:mb-4">Active Pipeline</h2>
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
                {stages.map((stage, index) => (
                    <div key={index} className="snap-start shrink-0 flex-1 min-w-0">
                        <StageCard {...stage} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PipelineView;
