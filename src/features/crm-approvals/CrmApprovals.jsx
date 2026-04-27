// src/features/crm-approvals/CrmApprovals.jsx
import React, { useState, useEffect } from 'react';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ActionButton from '../../components/ui/ActionButton';
import StatCard from '../../components/ui/StatCard';
import SlidePanel from '../../components/ui/SlidePanel';
import {
  Mail,
  Building2,
  Check,
  XCircle,
  History,
  ChevronRight,
  Edit3,
  Save,
  CloudUpload,
  User,
  Clock
} from 'lucide-react';

import {
  useCrmApprovalsGroupedQuery,
  useCrmApprovalVersionsQuery,
  useCrmDecisionMutation,
  useSaveEditedCrmApprovalMutation
} from './hooks';


import { useAuth } from '../auth/AuthContext';
// import { format } from 'date-fns'; // Removed missing dependency

const JsonDataViewer = ({ data }) => {
  let parsed = data;
  if (typeof data === 'string') {
    try {
      parsed = JSON.parse(data);
    } catch {
      return <span className="text-text-primary whitespace-pre-wrap">{data}</span>;
    }
  }

  if (parsed === null) return <span className="text-text-muted italic">null</span>;
  if (parsed === undefined) return null;
  
  if (typeof parsed !== 'object') {
    if (typeof parsed === 'boolean') {
      return <span className={parsed ? "text-primary font-bold" : "text-text-muted"}>{parsed ? 'Yes' : 'No'}</span>;
    }
    if (typeof parsed === 'string') {
      if (parsed.startsWith('http')) {
        return <a href={parsed} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">{parsed}</a>;
      }
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed)) {
        return <a href={`mailto:${parsed}`} className="text-primary hover:underline break-all">{parsed}</a>;
      }
    }
    return <span className="text-text-primary whitespace-pre-wrap break-words">{String(parsed)}</span>;
  }

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return <span className="text-[var(--text-muted)] italic">Empty catalog</span>;
    return (
      <div className="space-y-2">
        {parsed.map((item, idx) => (
          <div key={idx} className="bg-[var(--surface)] rounded border border-[var(--border)]/20 p-3">
            <JsonDataViewer data={item} />
          </div>
        ))}
      </div>
    );
  }

  const entries = Object.entries(parsed);
  if (entries.length === 0) return <span className="text-[var(--text-muted)] italic">Empty</span>;

  return (
    <table className="w-full text-left border-collapse">
      <tbody className="divide-y divide-[var(--border)]/20">
        {entries.map(([key, value]) => (
          <tr key={key} className="hover:bg-primary/5 transition-colors group">
            <td className="py-2.5 px-3 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider w-1/3 align-top bg-[var(--surface)]/5 border-r border-[var(--border)]/20 group-hover:bg-primary/10 transition-colors">
              {key.replace(/_/g, ' ')}
            </td>
            <td className="py-2.5 px-3 text-sm font-medium text-[var(--text)] align-top break-words">
              <JsonDataViewer data={value} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const EditableJsonViewer = ({ data, onChange }) => {
  if (data === null) return <span className="text-text-muted italic text-xs">null</span>;
  if (data === undefined) return null;

  if (typeof data !== 'object') {
    if (typeof data === 'boolean') {
      return (
        <select 
          value={data ? 'true' : 'false'} 
          onChange={e => onChange(e.target.value === 'true')}
          className="bg-surface-elevated/50 border border-border/50 rounded px-2 py-1 text-xs text-primary outline-none focus:border-primary"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }
    return (
      <input 
        type={typeof data === 'number' ? 'number' : 'text'}
        value={data}
        onChange={e => onChange(typeof data === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full bg-surface border border-border/50 rounded px-2 py-1.5 text-xs text-text-primary outline-none focus:border-primary transition-colors"
      />
    );
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="bg-[var(--surface)] rounded border border-[var(--border)]/20 p-2">
            <EditableJsonViewer 
              data={item} 
              onChange={(newVal) => {
                const newData = [...data];
                newData[idx] = newVal;
                onChange(newData);
              }} 
            />
          </div>
        ))}
      </div>
    );
  }

  const entries = Object.entries(data);
  return (
    <table className="w-full text-left border-collapse bg-[var(--surface)]/50 rounded-lg overflow-hidden">
      <tbody className="divide-y divide-[var(--border)]/20">
        {entries.map(([key, value]) => (
          <tr key={key} className="group">
            <td className="py-2 px-3 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider w-1/3 align-middle bg-[var(--surface)]/5 border-r border-[var(--border)]/20">
              {key.replace(/_/g, ' ')}
            </td>
            <td className="py-1.5 px-2 align-middle">
              <EditableJsonViewer 
                data={value} 
                onChange={(newVal) => {
                  onChange({ ...data, [key]: newVal });
                }} 
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const CrmApprovals = () => {
  const [selectedTranscriptId, setSelectedTranscriptId] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [activeDecision, setActiveDecision] = useState(null); // 'approved' | 'rejected' | null
  const { user } = useAuth();


  const { data, isLoading, isError } = useCrmApprovalsGroupedQuery();
  const versionsQuery = useCrmApprovalVersionsQuery(selectedTranscriptId);

  const decisionMutation = useCrmDecisionMutation();
  const saveMutation = useSaveEditedCrmApprovalMutation();


  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    // Simplistic native version of MMM d, HH:mm
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const groupedEntries = data?.groupedEntries || [];
  const kpis = data?.kpis || [];

  // Initialize selected version when panel opens or versions change
  useEffect(() => {
    if (versionsQuery.data?.length > 0 && !selectedVersion) {
      setSelectedVersion(versionsQuery.data[0]);
    }
  }, [versionsQuery.data, selectedVersion]);

  const handleOpenThread = (transcriptId) => {
    setSelectedTranscriptId(transcriptId);
    setSelectedVersion(null);
    setIsEditMode(false);
  };

  const handleClosePanel = () => {
    setSelectedTranscriptId(null);
    setSelectedVersion(null);
    setIsEditMode(false);
  };

  const handleSelectVersion = (version) => {
    setSelectedVersion(version);
    setIsEditMode(false);
  };

  const handleStartEdit = () => {
    let parsedExtracted = selectedVersion.extracted_data;
    if (typeof parsedExtracted === 'string') {
      try { parsedExtracted = JSON.parse(parsedExtracted); } catch { /* ignore parse error */ }
    }

    setEditedData({
      client_name: selectedVersion.client_name,
      client_email: selectedVersion.client_email,
      company_name: selectedVersion.company_name,
      extracted_data: parsedExtracted
    });
    setIsEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      await saveMutation.mutateAsync({
        crmApproval: selectedVersion,
        updatedData: {
          ...editedData,
          extracted_data: editedData.extracted_data
        }
      });
      setIsEditMode(false);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDecision = async (status) => {
    // Guard: no record selected, or a decision is already in-flight
    if (!selectedVersion || decisionMutation.isPending) return;
    setActiveDecision(status);
    try {
      const reviewerEmail = user?.email || 'unknown';
      await decisionMutation.mutateAsync({
        crmApproval: selectedVersion,
        reviewerEmail,
        status,
      });
      // Close the panel — query invalidation in the hook triggers a refetch
      // so the UI reflects n8n's DB update.
      handleClosePanel();
    } catch (err) {
      console.error(`CRM ${status} failed:`, err);
    } finally {
      setActiveDecision(null);
    }
  };

  const handleApprove = (e) => { e.preventDefault(); handleDecision('approved'); };
  const handleReject = (e) => { e.preventDefault(); handleDecision('rejected'); };


  if (isLoading) {
    return (
      <div className="space-y-8 pb-10 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-[var(--surface)] rounded-xl"></div>)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-[var(--surface)] rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-900/20 text-red-400 rounded-xl border border-red-900/50">
        Failed to load CRM approvals. Please check technical logs.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <StatCard
            key={idx}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            trendType={kpi.type}
          />
        ))}
      </div>

      {/* Grouped List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-bold text-[var(--text-muted)] tracking-widest uppercase flex items-center gap-2">
            CRM APPROVAL THREADS <span className="text-xs opacity-50 font-medium">({groupedEntries.length})</span>
          </h3>
        </div>

        {groupedEntries.map((group) => (
          <div
            key={group.transcript_id}
            onClick={() => handleOpenThread(group.transcript_id)}
            className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5 shadow-premium hover:border-primary/40 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--border)]/10 flex items-center justify-center text-[var(--text-muted)] group-hover:text-primary transition-colors">
                  <User size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-[var(--text)] group-hover:text-primary transition-colors">
                    {group.latest_client_name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 size={12} className="text-[var(--text-muted)]" />
                      {group.latest_company_name}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                    <span className="text-[var(--text-muted)]">ID: {group.transcript_id.substring(0, 8)}...</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">LATEST:</span>
                    <StatusBadge status={group.latest_status} />
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-medium italic">
                    <Clock size={10} />
                    {group.latest_date ? formatDate(group.latest_date) : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-[var(--border)]">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-[var(--text)] leading-none">{group.version_count}</span>
                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">VERSIONS</span>
                  </div>
                  <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {groupedEntries.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-xl">
            <Check className="text-[var(--text-muted)] mb-2" size={32} />
            <p className="text-[var(--text-muted)] font-medium">No CRM records found.</p>
          </div>
        )}
      </div>

      {/* Version Sidebar Panel */}
      <SlidePanel
        isOpen={!!selectedTranscriptId}
        onClose={handleClosePanel}
        title="CRM Record History"
        width="max-w-4xl"
        footer={
          selectedVersion && (
            <div className="flex items-center justify-between w-full">
              <div className="text-xs text-[var(--text-muted)] italic">
                {isEditMode ? "Editing current selection..." : `Viewing version from ${selectedVersion.created_at ? formatDate(selectedVersion.created_at) : ''}`}
              </div>
              <div className="flex items-center gap-3">
                {!isEditMode ? (
                  <>
                    <ActionButton
                      type="button"
                      variant="secondary"
                      icon={Edit3}
                      onClick={handleStartEdit}
                      disabled={decisionMutation.isPending}
                    >
                      Edit Data
                    </ActionButton>
                    <ActionButton
                      type="button"
                      variant="danger"
                      icon={XCircle}
                      onClick={handleReject}
                      isLoading={activeDecision === 'rejected'}
                      disabled={decisionMutation.isPending || ['approved', 'rejected'].includes(selectedVersion.status)}
                    >
                      {selectedVersion.status === 'rejected' ? 'Rejected' : 'Reject'}
                    </ActionButton>
                    <ActionButton
                      type="button"
                      variant="primary"
                      icon={CloudUpload}
                      onClick={handleApprove}
                      isLoading={activeDecision === 'approved'}
                      disabled={decisionMutation.isPending || ['approved', 'rejected'].includes(selectedVersion.status)}
                    >
                      {selectedVersion.status === 'approved' ? 'Approved ✓' : 'Approve'}
                    </ActionButton>
                  </>
                ) : (
                  <>
                    <ActionButton
                      type="button"
                      variant="secondary"
                      onClick={() => setIsEditMode(false)}
                      disabled={saveMutation.isPending}
                    >
                      Cancel
                    </ActionButton>
                    <ActionButton
                      type="button"
                      variant="primary"
                      icon={Save}
                      onClick={handleSaveEdit}
                      isLoading={saveMutation.isPending}
                    >
                      Save as New Version
                    </ActionButton>
                  </>
                )}
              </div>
            </div>
          )
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* History Sidebar */}
          <div className="lg:col-span-4 border-r border-[var(--border)] pr-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <History size={16} className="text-primary" />
              <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Version History</h4>
            </div>

            <div className="space-y-3">
              {versionsQuery.isLoading ? (
                <div className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent" />
                  Loading history...
                </div>
              ) : (
                versionsQuery.data?.map((v, idx) => (
                  <div
                    key={v.id}
                    onClick={() => handleSelectVersion(v)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${selectedVersion?.id === v.id
                        ? 'bg-primary/5 border-primary shadow-premium'
                        : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--text-muted)]'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">
                        V{versionsQuery.data.length - idx} {idx === 0 && <span className="text-secondary ml-1.5">(LATEST)</span>}
                      </span>
                      <StatusBadge status={v.status} className="scale-75 origin-right" />
                    </div>
                    <p className="text-xs font-bold text-[var(--text)] mb-1 line-clamp-1">{v.company_name}</p>
                    <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-medium">
                      <Clock size={10} />
                      {v.created_at ? formatDate(v.created_at) : 'N/A'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Details Form / View */}
          <div className="lg:col-span-8 flex flex-col h-full bg-[var(--surface)]/20 rounded-xl p-6 border border-[var(--border)]/50">
            {selectedVersion ? (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xl">
                      {selectedVersion.initials}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text)]">{selectedVersion.client_name}</h3>
                      <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] mt-1">
                        <span className="flex items-center gap-1.5">
                          <Mail size={14} className="text-[var(--text-muted)]" />
                          {selectedVersion.client_email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[var(--text-muted)]">TIER</span>
                      <span className={`text-xs font-bold ${selectedVersion.tier === 'Gold' ? 'text-primary' : 'text-[var(--text-muted)]'}`}>
                        {selectedVersion.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Confidence</span>
                      <StatusBadge status={selectedVersion.confidence} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase">Client Name</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editedData.client_name}
                        onChange={(e) => setEditedData({ ...editedData, client_name: e.target.value })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text)] focus:border-primary outline-none transition-all"
                      />
                    ) : (
                      <p className="text-sm font-medium text-[var(--text)] py-2">{selectedVersion.client_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase">Client Email</label>
                    {isEditMode ? (
                      <input
                        type="email"
                        value={editedData.client_email}
                        onChange={(e) => setEditedData({ ...editedData, client_email: e.target.value })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text)] focus:border-primary outline-none transition-all"
                      />
                    ) : (
                      <p className="text-sm font-medium text-[var(--text)] py-2">{selectedVersion.client_email}</p>
                    )}
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase">Company Name</label>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={editedData.company_name}
                        onChange={(e) => setEditedData({ ...editedData, company_name: e.target.value })}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text)] focus:border-primary outline-none transition-all"
                      />
                    ) : (
                      <p className="text-sm font-medium text-[var(--text)] py-2 flex items-center gap-2">
                        <Building2 size={16} className="text-primary" />
                        {selectedVersion.company_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-2 mt-4 flex flex-col min-h-0">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase flex items-center justify-between">
                    Extracted Data
                  </label>
                  <div className={`flex-1 border border-[var(--border)] rounded-xl overflow-hidden flex flex-col bg-[var(--surface)]/20`}>
                    {isEditMode ? (
                      <div className="w-full h-full overflow-y-auto scrollbar-thin p-1">
                        <EditableJsonViewer 
                          data={editedData.extracted_data}
                          onChange={(newVal) => setEditedData({ ...editedData, extracted_data: newVal })}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full overflow-y-auto scrollbar-thin">
                        <JsonDataViewer data={selectedVersion.extracted_data} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] space-y-4">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--border)]/20 mb-4" />
                  <div className="h-4 w-32 bg-[var(--border)]/20 rounded mb-2" />
                  <div className="h-3 w-48 bg-[var(--border)]/10 rounded" />
                </div>
              </div>
            )}
          </div>
        </div>
      </SlidePanel>
    </div>
  );
};

export default CrmApprovals;

