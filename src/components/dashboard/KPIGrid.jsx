import React from 'react';
import { MdTrendingUp, MdAccessTime, MdPeopleOutline, MdEuroSymbol } from 'react-icons/md';

const KPICard = ({ title, value, label, icon: Icon, trend }) => {
    return (
        <div className="bg-surface p-4 md:p-5 rounded-xl border border-white/5 flex flex-col justify-between h-[120px] hover:bg-white/5 transition-colors group shadow-sm hover:shadow-md cursor-default">
            <div className="flex justify-between items-start">
                <span className="text-text-secondary text-sm font-medium group-hover:text-text-primary transition-colors">{title}</span>
                <div className="p-1.5 rounded-lg bg-white/5 text-text-muted group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <Icon className="text-lg" />
                </div>
            </div>
            <div>
                <div className="text-2xl md:text-3xl font-bold text-text-primary mb-1 tracking-tight">{value}</div>
                {label && <div className="text-xs text-text-secondary font-medium">{label}</div>}
            </div>
        </div>
    );
};

const KPIGrid = () => {
    const kpis = [
        { title: 'Draft Readiness', value: '94%', label: '+2% this week', icon: MdTrendingUp },
        { title: 'Review Time', value: '12m', label: '-5m vs last month', icon: MdAccessTime },
        { title: 'Client Iterations', value: '1.2', label: 'Avg per contract', icon: MdPeopleOutline },
        { title: 'Unit Cost', value: '€45', label: 'Per contract drafted', icon: MdEuroSymbol },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-2 md:mb-6 shrink-0">
            {kpis.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
            ))}
        </div>
    );
};

export default KPIGrid;
