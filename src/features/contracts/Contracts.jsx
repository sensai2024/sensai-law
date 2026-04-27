// src/features/contracts/Contracts.jsx
import React, { useState } from 'react';
import {
  FileText,
  RotateCcw,
  Eye,
  FileSignature,
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  History,
  Layers,
  Code
} from 'lucide-react';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ActionButton from '../../components/ui/ActionButton';
import StatCard from '../../components/ui/StatCard';
import {
  useContractsGroupedQuery,
  useContractVersionsQuery,
  useContractDetailsQuery,
  useRegenerateContractMutation,
  useSaveEditedContractMutation
} from './hooks';
import { cleanContractHtml } from './utils';

const Contracts = () => {
  const [selectedTranscriptId, setSelectedTranscriptId] = useState(null);
  const [selectedVersionId, setSelectedVersionId] = useState(null);

  const { data: listData, isLoading: isListLoading, isError: isListError } = useContractsGroupedQuery();

  if (selectedVersionId) {
    return (
      <ContractDetails
        contractId={selectedVersionId}
        onBack={() => setSelectedVersionId(null)}
      />
    );
  }

  if (selectedTranscriptId) {
    return (
      <TranscriptVersionsView
        transcriptId={selectedTranscriptId}
        onBack={() => setSelectedTranscriptId(null)}
        onSelectVersion={(vid) => setSelectedVersionId(vid)}
      />
    );
  }

  if (isListLoading) {
    return (
      <div className="space-y-8 pb-10 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-[var(--surface)] rounded-xl"></div>)}
        </div>
        <div className="h-96 bg-[var(--surface)] rounded-xl"></div>
      </div>
    );
  }

  if (isListError) {
    return (
      <div className="p-6 bg-red-900/20 text-red-400 rounded-xl border border-red-900/50 flex items-center gap-3">
        <AlertCircle size={20} />
        <span>Failed to load contracts data.</span>
      </div>
    );
  }

  const { groupedEntries, kpis } = listData || { groupedEntries: [], kpis: [] };

  return (
    <div className="space-y-8 pb-10">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <StatCard
            key={i}
            title={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            trendType={kpi.type}
          />
        ))}
      </div>

      <SectionCard title={`GROUPED CONTRACT THREADS (${groupedEntries.length})`}>
        {groupedEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                  <th className="pb-4 pt-2 font-bold px-2">Transcript ID</th>
                  <th className="pb-4 pt-2 font-bold px-2">Family (Latest)</th>
                  <th className="pb-4 pt-2 font-bold px-2">Audience</th>
                  <th className="pb-4 pt-2 font-bold px-2 text-center">Versions</th>
                  <th className="pb-4 pt-2 font-bold px-2">Latest Update</th>
                  <th className="pb-4 pt-2 font-bold px-2">Status</th>
                  <th className="pb-4 pt-2 font-bold px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {groupedEntries.map((entry) => (
                  <tr key={entry.transcript_id} className="group hover:bg-[var(--surface)]/5 transition-colors">
                    <td className="py-4 px-2">
                      <span className="text-sm font-mono text-[var(--text-muted)]">
                        {entry.transcript_id.substring(0, 8)}...
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-sm font-semibold text-[var(--text)]">
                        {entry.latest_family}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-xs text-[var(--text-muted)]">{entry.latest_audience}</td>
                    <td className="py-4 px-2 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--surface)] text-[10px] font-bold text-primary border border-primary/20">
                        <Layers size={10} />
                        {entry.version_count}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-xs text-[var(--text-muted)]">
                      {new Date(entry.latest_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-2">
                      <StatusBadge status={entry.latest_status} />
                    </td>
                    <td className="py-4 px-2 text-right">
                      <ActionButton
                        variant="secondary"
                        size="sm"
                        icon={History}
                        onClick={() => setSelectedTranscriptId(entry.transcript_id)}
                      >
                        View History
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] mt-4 rounded-xl">
            <FileSignature className="text-[var(--text-muted)] mb-2 w-12 h-12" />
            <p className="text-[var(--text-muted)] font-medium">No contracts found.</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

const TranscriptVersionsView = ({ transcriptId, onBack, onSelectVersion }) => {
  const { data: versions, isLoading, isError } = useContractVersionsQuery(transcriptId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-[var(--text-muted)]">Loading version history...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-900/20 text-red-400 rounded-xl border border-red-900/50 flex flex-col items-center gap-4">
        <AlertCircle size={20} />
        <span>Failed to load versions.</span>
        <ActionButton variant="secondary" onClick={onBack} icon={ArrowLeft}>Go Back</ActionButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-[var(--surface)] rounded-full transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[var(--text)] uppercase tracking-tight">VERSION HISTORY</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Transcript: {transcriptId}</p>
        </div>
      </div>

      <SectionCard title={`${versions.length} VERSIONS FOUND`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                <th className="pb-4 pt-2 font-bold px-2">Version Date</th>
                <th className="pb-4 pt-2 font-bold px-2">Family</th>
                <th className="pb-4 pt-2 font-bold px-2">Score</th>
                <th className="pb-4 pt-2 font-bold px-2">Tokens</th>
                <th className="pb-4 pt-2 font-bold px-2">Cost</th>
                <th className="pb-4 pt-2 font-bold px-2">Status</th>
                <th className="pb-4 pt-2 font-bold px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {versions.map((v) => (
                <tr key={v.id} className="group hover:bg-[var(--surface)]/5 transition-colors">
                  <td className="py-4 px-2 text-xs text-[var(--text)] font-medium">
                    {new Date(v.created_at).toLocaleString()}
                  </td>
                  <td className="py-4 px-2 text-xs text-[var(--text-muted)]">{v.contract_family}</td>
                  <td className="py-4 px-2">
                    <span className={`text-xs font-mono font-bold ${v.pinecone_score > 0.85 ? 'text-status-success' : 'text-status-warning'}`}>
                      {(v.pinecone_score * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-2 text-xs text-[var(--text-muted)]">{v.tokens_used?.toLocaleString() || 0}</td>
                  <td className="py-4 px-2 text-xs text-[var(--text-muted)]">€{v.cost_eur?.toFixed(4) || '0.0000'}</td>
                  <td className="py-4 px-2">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="py-4 px-2 text-right">
                    <ActionButton
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      onClick={() => onSelectVersion(v.id)}
                    >
                      View & Edit
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

const ContractDetails = ({ contractId, onBack }) => {
  const { data: contract, isLoading, isError } = useContractDetailsQuery(contractId);
  const regenerateMutation = useRegenerateContractMutation();
  const saveMutation = useSaveEditedContractMutation();

  const [localContent, setLocalContent] = useState(undefined);


  const currentContent = localContent ?? contract?.content ?? '';
  const hasChanges = localContent !== undefined && localContent !== contract?.content;



  const handleSave = () => {
    saveMutation.mutate({ contract, content: currentContent }, {
      onSuccess: () => {
        setLocalContent(undefined);
        onBack(); // Go back to versions list
      }
    });
  };

  const handleRegenerate = () => {
    regenerateMutation.mutate(contract);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-[var(--text-muted)]">Loading version details...</p>
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <div className="p-6 bg-red-900/20 text-red-400 rounded-xl border border-red-900/50 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} />
          <span>Failed to load details.</span>
        </div>
        <ActionButton variant="secondary" onClick={onBack} icon={ArrowLeft}>Go Back</ActionButton>
      </div>
    );
  }

  const currentStatus = (contract.status || 'pending').toLowerCase();
  const isRegenerating = currentStatus === 'regenerating';
  const isProcessing = regenerateMutation.isPending || saveMutation.isPending;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[var(--surface)] rounded-full transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[var(--text)] uppercase tracking-tight">
              {contract.contract_family || 'Standard Contract'}
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Ref ID: {contract.id} • Audience: {contract.audience || 'General'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={contract.status} />
          {hasChanges && (
            <ActionButton
              variant="primary"
              size="sm"
              icon={Save}
              onClick={handleSave}
              disabled={isProcessing}
            >
              Save as New Version
            </ActionButton>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Editor / Preview */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard
            title="CONTRACT CONTENT"
            headerActions={
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  {contract.tokens_used || 0} tokens used
                </span>

              </div>
            }
          >
            <div
              className="w-full h-[600px] overflow-y-auto bg-[var(--surface)]/50 border border-[var(--border)] rounded-lg p-6 text-sm text-[var(--text)] leading-relaxed custom-scrollbar prose prose-sm dark:prose-invert max-w-none focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => setLocalContent(e.target.innerHTML)}
              dangerouslySetInnerHTML={{ __html: cleanContractHtml(currentContent) }}
            />
          </SectionCard>
        </div>

        {/* Sidebar: Metadata & Actions */}
        <div className="space-y-6">
          <SectionCard title="METADATA & SCORES">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]/50">
                <span className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider">Internal IDs</span>
                <div className="text-right">
                  <p className="text-[10px] text-[var(--text)] font-mono">T: {contract.transcript_id}</p>
                  <p className="text-[10px] text-[var(--text)] font-mono">D: {contract.drive_doc_id}</p>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]/50">
                <span className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider">AI Quality Score</span>
                <span className={`text-sm font-mono font-bold ${contract.pinecone_score > 0.85 ? 'text-status-success' : 'text-status-warning'}`}>
                  {(contract.pinecone_score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]/50">
                <span className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider">Estimated Cost</span>
                <span className="text-sm font-mono text-[var(--text)]">
                  €{contract.cost_eur?.toFixed(4) || '0.0000'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[var(--border)]/50">
                <span className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider">Created At</span>
                <span className="text-[11px] text-[var(--text)]">
                  {new Date(contract.created_at).toLocaleString()}
                </span>
              </div>
              <div className="py-2">
                <span className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider block mb-2">Drive Document</span>
                {contract.drive_doc_url ? (
                  <a
                    href={contract.drive_doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[11px] text-primary hover:underline group"
                  >
                    <FileText size={14} />
                    View in Google Drive
                  </a>
                ) : (
                  <span className="text-[11px] text-[var(--text-muted)] italic">No document link generated</span>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="WORKFLOW ACTIONS">
            <div className="space-y-3">
              <ActionButton
                variant="primary"
                className="w-full justify-center py-3"
                icon={RotateCcw}
                onClick={handleRegenerate}
                disabled={isProcessing}
              >
                Regenerate Pipeline
              </ActionButton>

              {isRegenerating && (
                <div className="p-4 bg-status-processing/10 border border-status-processing/20 rounded-lg flex flex-col items-center text-center space-y-2">
                  <Loader2 className="animate-spin text-status-processing" size={20} />
                  <p className="text-xs font-bold text-status-processing uppercase tracking-wider">Regenerating...</p>
                  <p className="text-[10px] text-[var(--text-muted)]">A new version is being generated by AI.</p>
                </div>
              )}

              {isProcessing && (
                <div className="text-center py-2">
                  <p className="text-[10px] text-[var(--text-muted)] animate-pulse">Processing request...</p>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default Contracts;
