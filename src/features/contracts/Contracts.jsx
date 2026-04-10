// src/features/contracts/Contracts.jsx
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  RotateCcw, 
  Eye, 
  FileSignature, 
  Check, 
  X, 
  Save, 
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ActionButton from '../../components/ui/ActionButton';
import StatCard from '../../components/ui/StatCard';
import { 
  useContractsQuery, 
  useContractDetailsQuery, 
  useRegenerateContractMutation, 
  useSaveEditedContractMutation 
} from './hooks';

const Contracts = () => {
  const [selectedContractId, setSelectedContractId] = useState(null);
  const { data: listData, isLoading: isListLoading, isError: isListError } = useContractsQuery();

  if (selectedContractId) {
    return (
      <ContractDetails 
        contractId={selectedContractId} 
        onBack={() => setSelectedContractId(null)} 
      />
    );
  }

  if (isListLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-surface-elevated rounded-xl"></div>)}
        </div>
        <div className="h-96 bg-surface-elevated rounded-xl"></div>
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

  const { contracts, kpis } = listData || { contracts: [], kpis: [] };

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

      <SectionCard title={`CONTRACTS FOR REVIEW (${contracts.length})`}>
        {contracts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  <th className="pb-4 pt-2 font-bold px-2">Contract Family</th>
                  <th className="pb-4 pt-2 font-bold px-2">Audience</th>
                  <th className="pb-4 pt-2 font-bold px-2">Score</th>
                  <th className="pb-4 pt-2 font-bold px-2">Tokens</th>
                  <th className="pb-4 pt-2 font-bold px-2">Cost</th>
                  <th className="pb-4 pt-2 font-bold px-2">Created At</th>
                  <th className="pb-4 pt-2 font-bold px-2">Status</th>
                  <th className="pb-4 pt-2 font-bold px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="group hover:bg-surface-highlight/5 transition-colors">
                    <td className="py-4 px-2">
                       <span className="text-sm font-semibold text-text-primary">
                        {contract.type}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-xs text-text-secondary">{contract.audience || 'N/A'}</td>
                    <td className="py-4 px-2 text-xs font-mono font-bold text-text-primary">
                      {contract.score ? `${(contract.score * 100).toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="py-4 px-2 text-xs text-text-muted">{contract.tokens?.toLocaleString() || '0'}</td>
                    <td className="py-4 px-2 text-xs text-text-muted">€{contract.cost?.toFixed(4) || '0.0000'}</td>
                    <td className="py-4 px-2 text-xs text-text-muted">{contract.date}</td>
                    <td className="py-4 px-2">
                      <StatusBadge status={contract.status} />
                    </td>
                    <td className="py-4 px-2 text-right">
                      <ActionButton 
                        variant="secondary" 
                        size="sm" 
                        icon={Eye} 
                        onClick={() => setSelectedContractId(contract.id)}
                      >
                        View
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border mt-4 rounded-xl">
            <FileSignature className="text-text-muted mb-2 w-12 h-12" />
            <p className="text-text-secondary font-medium">No contracts pending review.</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

const ContractDetails = ({ contractId, onBack }) => {
  const { data: contract, isLoading, isError } = useContractDetailsQuery(contractId);
  const regenerateMutation = useRegenerateContractMutation();
  const saveMutation = useSaveEditedContractMutation();

  const [editableContent, setEditableContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (contract?.content) {
      setEditableContent(contract.content);
    }
  }, [contract]);

  const handleContentChange = (e) => {
    setEditableContent(e.target.value);
    setHasChanges(e.target.value !== contract?.content);
  };

  const handleSave = () => {
    saveMutation.mutate({ contract, content: editableContent }, {
      onSuccess: () => {
        setHasChanges(false);
        onBack(); // Go back to list to see the new version
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
        <p className="text-text-secondary">Loading contract details...</p>
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <div className="p-6 bg-red-900/20 text-red-400 rounded-xl border border-red-900/50 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} />
          <span>Failed to load contract details.</span>
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
            className="p-2 hover:bg-surface-elevated rounded-full transition-colors text-text-muted hover:text-text-primary"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">
              {contract.contract_family || 'Standard Contract'}
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Ref: {contract.id.substring(0, 8)} • Audience: {contract.audience || 'General'}
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
        {/* Content Editor */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard 
            title="CONTRACT CONTENT" 
            headerActions={
              <span className="text-[10px] text-text-muted font-mono">
                {contract.tokens_used || 0} tokens used
              </span>
            }
          >
            <textarea
              className="w-full h-[600px] bg-surface-accent/30 border border-border rounded-lg p-6 text-sm text-text-secondary leading-relaxed focus:outline-none focus:border-primary/50 transition-colors resize-none font-sans"
              value={editableContent}
              onChange={handleContentChange}
              disabled={isProcessing}
              placeholder="Contract content will appear here..."
            />
          </SectionCard>
        </div>

        {/* Sidebar: Metadata & Actions */}
        <div className="space-y-6">
          <SectionCard title="METADATA & SCORES">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Internal IDs</span>
                <div className="text-right">
                  <p className="text-[10px] text-text-muted font-mono">T: {contract.transcript_id}</p>
                  <p className="text-[10px] text-text-muted font-mono">D: {contract.drive_doc_id}</p>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-text-muted uppercase font-bold tracking-wider">AI Quality Score</span>
                <span className={`text-sm font-mono font-bold ${contract.pinecone_score > 0.85 ? 'text-status-success' : 'text-status-warning'}`}>
                  {(contract.pinecone_score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Estimated Cost</span>
                <span className="text-sm font-mono text-text-primary">
                  €{contract.cost_eur?.toFixed(4) || '0.0000'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Created At</span>
                <span className="text-[11px] text-text-secondary">
                  {new Date(contract.created_at).toLocaleString()}
                </span>
              </div>
              <div className="py-2">
                 <span className="text-xs text-text-muted uppercase font-bold tracking-wider block mb-2">Drive Document</span>
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
                   <span className="text-[11px] text-text-muted italic">No document link generated</span>
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
                  <p className="text-[10px] text-text-muted">A new version is being generated by AI.</p>
                </div>
              )}

              {isProcessing && (
                <div className="text-center py-2">
                  <p className="text-[10px] text-text-muted animate-pulse">Processing request...</p>
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
