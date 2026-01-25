import React from 'react';
import { MdTrendingUp, MdAccessTime, MdPeopleOutline, MdEuroSymbol } from 'react-icons/md';

const KPICard = ({ title, value, label, icon: Icon, trend }) => {
    return (
        <div className="bg-surface p-5 rounded-lg border border-white/5 flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start">
                <span className="text-text-secondary text-sm font-medium">{title}</span>
                <div className="p-1.5 rounded bg-white/5 text-text-muted">
                    <Icon className="text-lg" />
                </div>
            </div>
            <div>
                <div className="text-2xl font-semibold text-text-primary mb-1">{value}</div>
                {label && <div className="text-xs text-text-secondary">{label}</div>}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi, index) => (
                <KPICard key={index} {...kpi} />
            ))}
        </div>
    );
};

export default KPIGrid;
