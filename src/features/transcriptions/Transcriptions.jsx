// src/features/transcriptions/Transcriptions.jsx
import React, { useState } from 'react';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ActionButton from '../../components/ui/ActionButton';
import SlidePanel from '../../components/ui/SlidePanel';
import {
    FileText,
    Play,
    MoreVertical,
    Search,
    Filter,
    Calendar,
    User,
    Mail,
    RefreshCcw,
    CheckCircle2,
    AlertCircle,
    Loader2,
    MessageSquare,
    ListTodo,
    StickyNote,
    Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranscriptionsQuery, useApproveTranscriptionMutation } from './hooks';
import ReactMarkdown from 'react-markdown';
import { cleanTranscriptContent, formatTranscriptBlocks } from './utils';

const Transcriptions = () => {
    const [selectedTranscription, setSelectedTranscription] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: transcriptions, isLoading, isError, refetch } = useTranscriptionsQuery();
    const approveMutation = useApproveTranscriptionMutation();

    const handleOpenDetails = (transcription) => {
        setSelectedTranscription(transcription);
    };

    const handleCloseDetails = () => {
        setSelectedTranscription(null);
    };

    const handleApprove = async () => {
        if (!selectedTranscription) return;

        try {
            await approveMutation.mutateAsync(selectedTranscription);
            // Optional: Show success toast here if a toast system exists
            handleCloseDetails();
        } catch (error) {
            console.error('Approval failed:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-8 pb-10 animate-pulse">
                <div className="h-16 bg-surface p-4 rounded-xl border border-border"></div>
                <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-surface rounded-xl border border-border"></div>)}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 bg-status-error/10 text-status-error rounded-2xl border border-status-error/20 flex flex-col items-center gap-4">
                <AlertCircle size={48} />
                <div className="text-center">
                    <h3 className="text-lg font-bold">Failed to load transcriptions</h3>
                    <p className="opacity-80">There was an error connecting to Supabase. please try again.</p>
                </div>
                <ActionButton onClick={() => refetch()} variant="secondary" size="md">Retry Connection</ActionButton>
            </div>
        );
    }

    const filteredTranscriptions = (transcriptions || []).filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.clientName && t.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.clientEmail && t.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const needsApproval = (status) => {
        const s = status?.toLowerCase();
        return s === 'generated' || s === 'pending' || s === 'working' || s === 'processing' || s === 'processed' || s === 'ready';
    };


    return (
        <div className="space-y-8 pb-10">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border shadow-soft">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={16} />
                    <input
                        type="text"
                        placeholder="Search by title, client or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <ActionButton variant="secondary" size="md" icon={Filter}>Filters</ActionButton>
                    <div className="h-8 w-[1px] bg-border mx-1 hidden md:block" />
                    <p className="text-xs text-text-muted font-bold uppercase tracking-wider px-2">
                        {filteredTranscriptions.length} Records
                    </p>
                </div>
            </div>

            {/* Transcription List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredTranscriptions.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => handleOpenDetails(t)}
                        className="bg-surface rounded-xl border border-border p-5 hover:border-primary/40 hover:shadow-premium transition-all group cursor-pointer relative overflow-hidden"
                    >
                        {/* Status bar left decoration */}
                        <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1",
                            t.status?.toLowerCase() === 'approved' ? 'bg-status-success' :
                                needsApproval(t.status) ? 'bg-primary' : 'bg-status-error'
                        )} />

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-start gap-5">
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-soft shrink-0",
                                    needsApproval(t.status) ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' :
                                        t.status?.toLowerCase() === 'failed' ? 'bg-status-error/10 text-status-error' : 'bg-status-success/10 text-status-success'
                                )}>
                                    <FileText size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                                        {t.name}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-text-muted font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-text-muted/60" />
                                            {t.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} className="text-text-muted/60" />
                                            {t.clientName || 'No Client'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Mail size={14} className="text-text-muted/60" />
                                            {t.clientEmail || 'No Email'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between lg:justify-end gap-8 border-t lg:border-t-0 pt-4 lg:pt-0 border-border/50">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Retries</span>
                                        <span className="text-xs font-bold font-mono bg-surface-accent px-2 py-0.5 rounded-md border border-border">
                                            {t.retryCount}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Status</span>
                                        <StatusBadge status={t.status} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <ActionButton
                                        variant="ghost"
                                        size="sm"
                                        icon={Play}
                                        className="h-10 w-10 !p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                                    />
                                    <ActionButton
                                        variant="ghost"
                                        size="sm"
                                        icon={MoreVertical}
                                        className="h-10 w-10 !p-0 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transcription Details Panel */}
            <SlidePanel
                isOpen={!!selectedTranscription}
                onClose={handleCloseDetails}
                title="Transcription Review"
                footer={
                    <>
                        <ActionButton
                            variant="secondary"
                            size="md"
                            onClick={handleCloseDetails}
                            disabled={approveMutation.isPending}
                        >
                            Cancel
                        </ActionButton>
                        {needsApproval(selectedTranscription?.status) && (
                            <ActionButton
                                variant="primary"
                                size="md"
                                icon={approveMutation.isPending ? Loader2 : CheckCircle2}
                                onClick={handleApprove}
                                disabled={approveMutation.isPending}
                                className={cn(approveMutation.isPending && "animate-pulse")}
                            >
                                {approveMutation.isPending ? 'Sending Approval...' : 'Start Automation'}
                            </ActionButton>
                        )}
                        {selectedTranscription?.status?.toLowerCase() === 'approved' && (
                            <div className="flex items-center gap-2 text-status-success text-sm font-bold bg-status-success/10 px-4 py-2 rounded-lg border border-status-success/20">
                                <CheckCircle2 size={18} />
                                Already Approved
                            </div>
                        )}
                    </>
                }
            >
                {selectedTranscription && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Metadata Header */}
                        <div className="bg-surface-elevated rounded-2xl p-6 border border-border shadow-soft space-y-4">
                            <div className="flex items-start justify-between">
                                <h3 className="text-xl font-black text-text-primary leading-tight">
                                    {selectedTranscription.title}
                                </h3>
                                <StatusBadge status={selectedTranscription.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-2">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Client Name</span>
                                    <p className="text-sm font-bold text-text-secondary flex items-center gap-2">
                                        <User size={14} className="text-primary" />
                                        {selectedTranscription.clientName || 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Client Email</span>
                                    <p className="text-sm font-bold text-text-secondary flex items-center gap-2">
                                        <Mail size={14} className="text-primary" />
                                        {selectedTranscription.clientEmail || 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Meeting Date</span>
                                    <p className="text-sm font-bold text-text-secondary flex items-center gap-2">
                                        <Calendar size={14} className="text-primary" />
                                        {selectedTranscription.date}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Retries</span>
                                    <p className="text-sm font-bold text-text-secondary flex items-center gap-2">
                                        <RefreshCcw size={14} className="text-primary" />
                                        {selectedTranscription.retryCount} attempts
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Single Unified Content Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-text-muted uppercase tracking-widest">Transcription Script</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-medium px-2 py-0.5 bg-surface-accent rounded border border-border text-text-muted">
                                        Auto-Formatted
                                    </span>
                                </div>
                            </div>

                            <div className="prose prose-invert prose-zinc max-w-none bg-background rounded-2xl p-6 md:p-8 border border-border shadow-inner min-h-[600px]">
                                {(() => {
                                    const cleanedContent = cleanTranscriptContent(selectedTranscription.content);
                                    const blocks = formatTranscriptBlocks(cleanedContent);

                                    return (
                                        <div className="space-y-8 not-prose">
                                            {blocks.map((block, idx) => {
                                                // Handle sections that were previously in tabs as separators if they appear as blocks
                                                const isHeader = block.text.match(/^===.*===$/) || block.text.match(/^(Résumé|Détails|Étapes suivantes suggérées|Notes|Transcription)$/i);

                                                if (isHeader) {
                                                    return (
                                                        <div key={idx} className="pt-4 pb-2 border-b border-border/50">
                                                            <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-3">
                                                                <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/0 to-primary/50" />
                                                                {block.text.replace(/=/g, '').trim()}
                                                                <div className="h-[1px] flex-1 bg-gradient-to-l from-primary/0 to-primary/50" />
                                                            </h3>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div key={idx} className="group relative">
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        {block.speaker && (
                                                                            <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">
                                                                                {block.speaker}
                                                                            </span>
                                                                        )}
                                                                        {block.timestamp && (
                                                                            <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted bg-surface-accent px-1.5 py-0.5 rounded border border-border">
                                                                                <Clock size={10} />
                                                                                {block.timestamp}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="text-sm text-text-secondary leading-relaxed font-medium whitespace-pre-wrap">
                                                                    <ReactMarkdown>{block.text}</ReactMarkdown>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {idx < blocks.length - 1 && !isHeader && (
                                                            <div className="absolute -bottom-4 left-0 right-0 h-[1px] bg-border opacity-30" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {blocks.length === 0 && (
                                                <div className="flex flex-col items-center justify-center py-20 text-text-muted opacity-50 space-y-4">
                                                    <FileText size={48} />
                                                    <p className="font-medium italic">No content available.</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </SlidePanel>

            {/* Empty State */}
            {filteredTranscriptions.length === 0 && (
                <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-border rounded-2xl bg-surface/50">
                    <div className="p-6 bg-surface-accent rounded-full text-text-muted shadow-soft">
                        <FileText size={48} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">No transcript records found</h3>
                        <p className="text-sm text-text-secondary max-w-sm mx-auto mt-2">
                            {searchQuery ? "Try adjusting your search terms to find what you're looking for." : "When new meeting data is added to Supabase, it will appear here automatically."}
                        </p>
                    </div>
                    {searchQuery && (
                        <ActionButton onClick={() => setSearchQuery('')} variant="secondary" size="md">Clear Search</ActionButton>
                    )}
                </div>
            )}
        </div>
    );
};

export default Transcriptions;

