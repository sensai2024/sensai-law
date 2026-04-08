// src/features/transcriptions/Transcriptions.jsx
import React from 'react';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ActionButton from '../../components/ui/ActionButton';
import { FileText, Play, MoreVertical, Search, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranscriptionsQuery } from './hooks';

const Transcriptions = () => {
    const { data: transcriptions, isLoading, isError } = useTranscriptionsQuery();

    if (isLoading) {
        return (
            <div className="space-y-8 pb-10 animate-pulse">
                <div className="h-16 bg-surface p-4 rounded-xl"></div>
                <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-surface-elevated rounded-xl"></div>)}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 bg-red-900/20 text-red-400 rounded-xl border border-red-900/50">
                Failed to load transcriptions.
            </div>
        );
    }

    const safeTranscriptions = transcriptions || [];

    return (
        <div className="space-y-8 pb-10">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search transcriptions..." 
                        className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <ActionButton variant="secondary" size="md" icon={Filter}>Filters</ActionButton>

                </div>
            </div>

            {/* Transcription Cards */}
            <div className="grid grid-cols-1 gap-4">
                {safeTranscriptions.map((t) => (
                    <div key={t.id} className="bg-surface rounded-xl border border-border p-5 hover:border-primary/20 transition-all group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-soft",
                                    t.status === 'Processing' || t.status === 'working' ? 'bg-status-processing/10 text-status-processing animate-pulse' : 
                                    t.status === 'Failed' || t.status === 'failed' ? 'bg-status-error/10 text-status-error' : 'bg-primary/10 text-primary'
                                )}>
                                    <FileText size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors cursor-pointer">
                                        {t.name}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-text-muted">
                                        <span>{t.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        <span>{t.duration}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden md:block">
                                   <StatusBadge status={t.status} />
                                </div>
                                <div className="flex items-center gap-2">
                                    {(t.status === 'Generated' || t.status === 'success') && (
                                        <ActionButton variant="ghost" size="sm" className="hidden sm:flex">View Transcript</ActionButton>
                                    )}
                                    <ActionButton variant="ghost" size="sm" icon={Play} className="h-9 w-9 !p-0" />
                                    <ActionButton variant="ghost" size="sm" icon={MoreVertical} className="h-9 w-9 !p-0" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State Mockup */}
            {safeTranscriptions.length === 0 && (
                <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-border rounded-2xl">
                    <div className="p-6 bg-surface-accent rounded-full text-text-muted">
                        <FileText size={48} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">No transcript records found</h3>
                        <p className="text-sm text-text-secondary max-w-sm mx-auto mt-2">
                            When new legal meeting data is added to Supabase, it will appear here automatically. 
                            Double check your applied filters or system permissions if you expect to see running pipelines.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transcriptions;
