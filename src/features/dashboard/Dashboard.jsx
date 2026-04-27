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
import { useTheme } from '../../context/ThemeContext';

const Dashboard = () => {
    const { data, isLoading, isError } = useDashboardQuery();
    const { theme } = useTheme();

    if (isLoading) {
        return (
            <div className="space-y-10 pb-10 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-[var(--surface)] rounded-xl"></div>)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-[var(--surface)] rounded-xl"></div>
                    <div className="h-96 bg-[var(--surface)] rounded-xl"></div>
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

    // Theme-aware chart colors (matching user-provided variables)
    const chartColors = {
        grid: theme === 'dark' ? '#27272a' : '#e2e8f0', // matches --border
        text: theme === 'dark' ? '#a1a1aa' : '#64748b', // matches --text-muted
        tooltipBg: theme === 'dark' ? '#111113' : '#ffffff', // matches --surface / --bg
        tooltipBorder: theme === 'dark' ? '#27272a' : '#e2e8f0', // matches --border
        tooltipText: theme === 'dark' ? '#ffffff' : '#0f172a', // matches --text
        cursor: theme === 'dark' ? '#1c1c1f' : '#f8f9fb', // matches --surface
    };

    return (
        <div className="space-y-10 pb-10">
            {/* KPI Grid — 2 rows × 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dashboardStats.map((stat) => (
                    <StatCard
                        key={stat.id}
                        label={stat.label}
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
                        <div className="w-full min-w-0 mt-4 h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={contractsChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke={chartColors.text}
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke={chartColors.text}
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: chartColors.tooltipBg,
                                            border: `1px solid ${chartColors.tooltipBorder}`,
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            color: chartColors.tooltipText
                                        }}
                                        cursor={{ fill: chartColors.cursor }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        radius={[4, 4, 0, 0]}
                                        className="fill-primary transition-all duration-300"
                                    >
                                        {contractsChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[300px] text-[var(--text-muted)]">
                            No chart data
                        </div>
                    )}
                </SectionCard>

                {/* Savings Breakdown */}
                <SectionCard title="SAVINGS BREAKDOWN">
                    <div className="space-y-6 mt-4">
                        {savingsBreakdown.length > 0 ? savingsBreakdown.map((item, index) => (
                            <div key={index} className="flex items-center justify-between group">
                                <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">
                                    {item.label}
                                </span>
                                <span className={`text-lg font-bold ${item.type === 'success' ? 'text-status-success' :
                                    item.type === 'error' ? 'text-status-error' :
                                        item.type === 'gold' ? 'text-primary' : 'text-[var(--text)]'
                                    }`}>
                                    {item.value}
                                </span>
                            </div>
                        )) : (
                            <div className="text-[var(--text-muted)]">No savings data.</div>
                        )}
                    </div>
                </SectionCard>
            </div>

            {/* Recent Activity */}
            <SectionCard title="RECENT ACTIVITY FEED">
                {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] px-4 -mx-4 rounded-lg transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${activity.status === 'success' || activity.status === 'Generated' ? 'bg-status-success' :
                                        activity.status === 'warning' || activity.status === 'Pending' ? 'bg-status-warning' : 'bg-status-error'
                                        }`} />
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--text)]">
                                            {activity.action}: <span className="text-primary">{activity.target}</span>
                                        </p>
                                        <p className="text-[11px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">
                                            {activity.type} • {activity.time}
                                        </p>
                                    </div>
                                </div>
                                <StatusBadge status={activity.status === 'success' ? 'Generated' : activity.status === 'warning' ? 'Pending' : 'Failed'} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center text-[var(--text-muted)] italic">No recent activity.</div>
                )}
            </SectionCard>
        </div>
    );
};

export default Dashboard;
