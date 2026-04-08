// src/features/dashboard/Dashboard.jsx
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import StatCard from '../../components/ui/StatCard';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useDashboardQuery } from './hooks';

const Dashboard = () => {
    const { data, isLoading, isError } = useDashboardQuery();

    if (isLoading) {
        return (
            <div className="space-y-10 pb-10 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-24 bg-surface-elevated rounded-xl"></div>)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-surface-elevated rounded-xl"></div>
                    <div className="h-96 bg-surface-elevated rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 bg-red-900/20 text-red-400 rounded-xl border border-red-900/50">
                Failed to load dashboard data.
            </div>
        );
    }

    if (!data) return null;

    const { dashboardStats, contractsChartData, savingsBreakdown, recentActivity } = data;

    return (
        <div className="space-y-10 pb-10">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {dashboardStats.map((stat) => (
                    <StatCard 
                        key={stat.id}
                        title={stat.label}
                        value={stat.value}
                        trend={stat.trend}
                        trendType={stat.trendType}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contracts Chart */}
                <SectionCard 
                    title="CONTRACTS GENERATED — LAST 30 DAYS" 
                    className="lg:col-span-2 min-h-[400px]"
                >
                    {contractsChartData.length > 0 ? (
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={contractsChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#71717a" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis 
                                        stroke="#71717a" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        dx={-10}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#121214', 
                                            border: '1px solid #27272a',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            color: '#f4f4f5'
                                        }}
                                        cursor={{ fill: '#1c1c1f' }}
                                    />
                                    <Bar 
                                        dataKey="value" 
                                        radius={[4, 4, 0, 0]}
                                        className="fill-primary/80 hover:fill-primary transition-all duration-300"
                                    >
                                        {contractsChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-zinc-500">
                            No chart data
                        </div>
                    )}
                </SectionCard>

                {/* Savings Breakdown */}
                <SectionCard title="SAVINGS BREAKDOWN">
                    <div className="space-y-6 mt-4">
                        {savingsBreakdown.length > 0 ? savingsBreakdown.map((item, index) => (
                            <div key={index} className="flex items-center justify-between group">
                                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                                    {item.label}
                                </span>
                                <span className={`text-lg font-bold ${
                                    item.type === 'success' ? 'text-status-success' : 
                                    item.type === 'error' ? 'text-status-error' : 
                                    item.type === 'gold' ? 'text-primary' : 'text-text-primary'
                                }`}>
                                    {item.value}
                                </span>
                            </div>
                        )) : (
                            <div className="text-zinc-500">No savings data.</div>
                        )}
                    </div>
                </SectionCard>
            </div>

            {/* Recent Activity */}
            <SectionCard title="RECENT ACTIVITY FEED">
                {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-surface-highlight/20 px-4 -mx-4 rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${
                                        activity.status === 'success' || activity.status === 'Generated' ? 'bg-status-success' :
                                        activity.status === 'warning' || activity.status === 'Pending' ? 'bg-status-warning' : 'bg-status-error'
                                    }`} />
                                    <div>
                                        <p className="text-sm font-semibold text-text-primary">
                                            {activity.action}: <span className="text-primary">{activity.target}</span>
                                        </p>
                                        <p className="text-[11px] text-text-muted mt-1 uppercase tracking-wider">
                                            {activity.type} • {activity.time}
                                        </p>
                                    </div>
                                </div>
                                <StatusBadge status={activity.status === 'success' ? 'Generated' : activity.status === 'warning' ? 'Pending' : 'Failed'} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center text-zinc-500 italic">No recent activity.</div>
                )}
            </SectionCard>
        </div>
    );
};

export default Dashboard;
