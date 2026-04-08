// src/features/crm-approvals/CrmApprovals.jsx
import React from 'react';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ActionButton from '../../components/ui/ActionButton';
import { Mail, Building2, ExternalLink, Check, X, Edit2 } from 'lucide-react';
import { usePendingApprovalsQuery, useUpdateApprovalMutation } from './hooks';

const CrmApprovals = () => {
    const { data: approvals, isLoading, isError } = usePendingApprovalsQuery();
    const updateMutation = useUpdateApprovalMutation();

    const handleApprove = (id) => updateMutation.mutate({ id, status: 'approved' });
    const handleReject = (id) => updateMutation.mutate({ id, status: 'rejected' });

    if (isLoading) {
        return (
            <div className="space-y-8 pb-10 animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface-elevated rounded-xl"></div>)}
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <div className="h-64 bg-surface-elevated rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 bg-red-900/20 text-red-400 rounded-xl border border-red-900/50">
                Failed to load pending approvals.
            </div>
        );
    }

    const safeApprovals = approvals || [];

    return (
        <div className="space-y-8 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Approval List */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <h3 className="text-sm font-bold text-text-muted tracking-widest uppercase">
                            PENDING APPROVALS ({safeApprovals.length})
                        </h3>
                    </div>

                    {safeApprovals.map((client) => (
                        <div key={client.id} className="bg-surface rounded-xl border border-border p-6 shadow-premium hover:border-primary/30 transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                                        {client.initials}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                                            {client.name}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-text-secondary">
                                            <div className="flex items-center gap-1.5">
                                                <Mail size={14} className="text-text-muted" />
                                                {client.email}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Building2 size={14} className="text-text-muted" />
                                                {client.company}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex flex-col items-end gap-1 mr-4">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Confidence Score</span>
                                        <StatusBadge status={client.confidence} />
                                    </div>
                                    <div className="flex flex-col items-end gap-1 mr-6">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Tier</span>
                                        <span className={`text-xs font-bold ${client.tier === 'Gold' ? 'text-primary' : 'text-text-muted'}`}>
                                            {client.tier}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <ActionButton variant="secondary" size="sm" icon={Edit2} disabled={updateMutation.isPending}>
                                            Edit
                                        </ActionButton>
                                        <ActionButton variant="danger" size="sm" icon={X} onClick={() => handleReject(client.id)} disabled={updateMutation.isPending}>
                                            Reject
                                        </ActionButton>
                                        <ActionButton variant="primary" size="sm" icon={Check} onClick={() => handleApprove(client.id)} disabled={updateMutation.isPending}>
                                            Approve
                                        </ActionButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {safeApprovals.length === 0 && (
                        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl">
                            <Check className="text-text-muted mb-2" size={32} />
                            <p className="text-text-secondary font-medium">All caught up! No pending approvals.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                    <SectionCard title="RECENTLY SAVED">
                        <div className="space-y-4 text-center text-zinc-500 py-4 text-xs italic">
                            Feature coming soon
                        </div>
                    </SectionCard>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <h5 className="text-[10px] font-bold text-primary uppercase mb-2 tracking-widest">PRO TIP</h5>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            Automation uses AI to match companies. High confidence scores (0.85) are safe to bulk approve.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrmApprovals;
