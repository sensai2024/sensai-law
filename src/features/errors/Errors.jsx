// src/features/errors/Errors.jsx
import React from 'react';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ActionButton from '../../components/ui/ActionButton';
import { AlertTriangle, RotateCw, Terminal, History, ChevronRight } from 'lucide-react';
import { useErrorsQuery, useRetryErrorMutation } from './hooks';

const Errors = () => {
    const { data: errorsList, isLoading, isError } = useErrorsQuery();
    const retryMutation = useRetryErrorMutation();

    if (isLoading) {
        return (
            <div className="space-y-8 pb-10 animate-pulse">
                <div className="h-32 bg-surface-elevated rounded-xl"></div>
                <div className="h-96 bg-surface-elevated rounded-xl"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 bg-red-900/20 text-red-400 rounded-xl border border-red-900/50">
                Failed to load pipeline error logs.
            </div>
        );
    }

    const safeErrors = errorsList || [];

    return (
        <div className="space-y-8 pb-10">
            {/* Summary Banner */}
            <div className="bg-status-error/10 border border-status-error/20 rounded-xl p-6 flex items-start gap-4">
                <div className="p-3 bg-status-error/20 rounded-lg text-status-error">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-status-error">Pipeline Interruptions Detected</h3>
                    <p className="text-sm text-text-secondary mt-1 max-w-2xl">
                        One or more automation pipelines have encountered critical errors that require manual inspection. 
                        Review the logs below to retry or adjust the pipeline configuration.
                    </p>
                </div>
            </div>

            {/* Error List */}
            <SectionCard title="PIPELINE ERROR LOGS">
                {safeErrors.length > 0 ? (
                    <div className="space-y-2 mt-4">
                        {safeErrors.map((error) => (
                            <div key={error.id} className="group bg-background/50 border border-border rounded-xl p-5 hover:border-status-error/30 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 p-2 rounded-lg ${
                                            error.severity === 'High' ? 'bg-status-error/10 text-status-error' : 'bg-status-warning/10 text-status-warning'
                                        }`}>
                                            <AlertTriangle size={18} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-base font-bold text-text-primary">{error.pipeline}</h4>
                                                <StatusBadge status={error.severity} />
                                            </div>
                                            <p className="text-sm font-mono text-status-error/90 bg-status-error/5 px-2 py-1 rounded inline-block">
                                                {error.error}
                                            </p>
                                            <div className="flex items-center gap-3 text-[11px] text-text-muted mt-2 uppercase tracking-wider font-medium">
                                                <div className="flex items-center gap-1">
                                                    <History size={12} />
                                                    {error.timestamp}
                                                </div>
                                                <span className="w-1 h-1 rounded-full bg-border" />
                                                <div className="flex items-center gap-1">
                                                    <Terminal size={12} />
                                                    Log ID: ERR-{error.id.substring(0, 5).toUpperCase()}XF
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={error.status} />
                                        <div className="h-8 w-[1px] bg-border mx-2 hidden md:block" />
                                        <div className="flex items-center gap-2">
                                            <ActionButton variant="secondary" size="sm" icon={Terminal}>
                                                Inspect
                                            </ActionButton>
                                            <ActionButton 
                                                variant="primary" 
                                                size="sm" 
                                                icon={RotateCw} 
                                                onClick={() => retryMutation.mutate(error.id)}
                                                disabled={retryMutation.isPending}
                                            >
                                                Retry
                                            </ActionButton>
                                            <ActionButton variant="ghost" size="sm" icon={ChevronRight} className="h-9 w-9 !p-0" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border mt-4 rounded-xl">
                        <AlertTriangle className="text-text-muted mb-2 w-12 h-12 opacity-50" />
                        <p className="text-text-secondary font-medium">No errors detected. Systems are green.</p>
                    </div>
                )}
            </SectionCard>

            {/* Support Box */}
            <div className="p-6 bg-surface border border-border rounded-xl">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h5 className="font-bold text-text-primary">Need technical assistance?</h5>
                        <p className="text-sm text-text-secondary">Our DevOps team is available for pipeline debugging and LLM fine-tuning.</p>
                    </div>
                    <ActionButton variant="outline" size="md">Contact Support</ActionButton>
                </div>
            </div>
        </div>
    );
};

export default Errors;
