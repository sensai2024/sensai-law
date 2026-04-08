import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';
import StatCard from '../../components/ui/StatCard';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ActionButton from '../../components/ui/ActionButton';
import { FileText, Download, RotateCcw, Eye } from 'lucide-react';
import { CONTRACTS_LIST, CONTRACT_DISTRIBUTION } from '../../mock/data';

const COLORS = ['#cfb53b', '#3b82f6', '#10b981', '#f59e0b'];

const Contracts = () => {
    const kpis = [
        { label: 'TOTAL CONTRACTS', value: '48', trend: '↑ 12% this month', type: 'success' },
        { label: 'COMPLETION RATE', value: '98.2%', trend: 'Target: 95%', type: 'processing' },
        { label: 'AVG DRAFT TIME', value: '1.2s', trend: 'vs 4h manual', type: 'gold' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {kpis.map((kpi, i) => (
                    <StatCard 
                        key={i}
                        label={kpi.label}
                        value={kpi.value}
                        trend={kpi.trend}
                        trendType={kpi.type}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contracts List */}
                <SectionCard 
                    title="GENERATED CONTRACTS" 
                    className="lg:col-span-2"
                    headerActions={
                        <ActionButton variant="ghost" size="sm">View all history</ActionButton>
                    }
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                    <th className="pb-4 pt-2 font-bold px-2">Contract Name</th>
                                    <th className="pb-4 pt-2 font-bold px-2">Type</th>
                                    <th className="pb-4 pt-2 font-bold px-2 text-center">AI Score</th>
                                    <th className="pb-4 pt-2 font-bold px-2">Date</th>
                                    <th className="pb-4 pt-2 font-bold px-2">Status</th>
                                    <th className="pb-4 pt-2 font-bold px-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {CONTRACTS_LIST.map((contract) => (
                                    <tr key={contract.id} className="group hover:bg-surface-highlight/10 transition-colors">
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-surface-accent rounded-lg text-text-muted group-hover:text-primary transition-colors">
                                                    <FileText size={16} />
                                                </div>
                                                <span className="text-sm font-semibold text-text-primary underline decoration-border underline-offset-4 group-hover:decoration-primary/50 cursor-pointer transition-all">
                                                    {contract.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-xs text-text-secondary">{contract.type}</td>
                                        <td className="py-4 px-2 text-center">
                                            <span className={`text-xs font-mono font-bold ${parseFloat(contract.score) > 0.8 ? 'text-status-success' : 'text-status-warning'}`}>
                                                {contract.score}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-xs text-text-muted">{contract.date}</td>
                                        <td className="py-4 px-2">
                                            <StatusBadge status={contract.status} />
                                        </td>
                                        <td className="py-4 px-2 text-right">
                                            <div className="flex items-center justify-end gap-2 outline-none">
                                                {contract.status === 'Failed' ? (
                                                    <ActionButton variant="secondary" size="sm" icon={RotateCcw} className="h-8 w-8 !p-0" />
                                                ) : (
                                                    <>
                                                        <ActionButton variant="ghost" size="sm" icon={Eye} className="h-8 w-8 !p-0" />
                                                        <ActionButton variant="secondary" size="sm" icon={Download} className="h-8 w-8 !p-0" />
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SectionCard>

                {/* Distribution Chart */}
                <SectionCard title="CONTRACT TYPE DISTRIBUTION">
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={CONTRACT_DISTRIBUTION}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {CONTRACT_DISTRIBUTION.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#121214', 
                                        border: '1px solid #27272a',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        color: '#f4f4f5'
                                    }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    formatter={(value) => <span className="text-[10px] text-text-secondary uppercase font-bold">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 p-4 border border-border bg-surface-highlight/20 rounded-lg">
                        <p className="text-[11px] text-text-muted leading-relaxed">
                            <span className="font-bold text-text-secondary mr-1">ANALYSIS:</span>
                            Partnership agreements remain the most frequent type this quarter, representing 40% of total volume.
                        </p>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
};

export default Contracts;
