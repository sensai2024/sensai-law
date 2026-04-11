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


  const formatDate = (dateString, pattern = 'MMM d, HH:mm') => {
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
    setEditedData({
      client_name: selectedVersion.client_name,
      client_email: selectedVersion.client_email,
      company_name: selectedVersion.company_name,
      extracted_data: JSON.stringify(selectedVersion.extracted_data, null, 2)
    });
    setIsEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      let parsedJson = selectedVersion.extracted_data;
      try {
        parsedJson = JSON.parse(editedData.extracted_data);
      } catch (e) {
        console.error("JSON parse error", e);
        // Fallback or alert user
      }

      await saveMutation.mutateAsync({
        crmApproval: selectedVersion,
        updatedData: {
          ...editedData,
          extracted_data: parsedJson
        }
      });
      setIsEditMode(false);
      // The mutation onSuccess will invalidate queries, 
      // but we might want to select the new version.
      // For now, let it refresh.
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
  const handleReject  = (e) => { e.preventDefault(); handleDecision('rejected'); };


  if (isLoading) {
    return (
      <div className="space-y-8 pb-10 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface-elevated rounded-xl"></div>)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-surface-elevated rounded-xl"></div>)}
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
          <h3 className="text-sm font-bold text-text-muted tracking-widest uppercase flex items-center gap-2">
            CRM APPROVAL THREADS <span className="text-xs opacity-50 font-medium">({groupedEntries.length})</span>
          </h3>
        </div>

        {groupedEntries.map((group) => (
          <div 
            key={group.transcript_id} 
            onClick={() => handleOpenThread(group.transcript_id)}
            className="bg-surface rounded-xl border border-border p-5 shadow-premium hover:border-primary/40 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-accent flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                  <User size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-text-primary group-hover:text-primary transition-colors">
                    {group.latest_client_name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-text-secondary font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 size={12} className="text-text-muted" />
                      {group.latest_company_name}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-text-muted">ID: {group.transcript_id.substring(0, 8)}...</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">LATEST:</span>
                    <StatusBadge status={group.latest_status} />
                  </div>
                  <span className="text-[10px] text-text-muted flex items-center gap-1 font-medium italic">
                    <Clock size={10} />
                    {group.latest_date ? formatDate(group.latest_date) : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-border">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-text-primary leading-none">{group.version_count}</span>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">VERSIONS</span>
                  </div>
                  <ChevronRight size={20} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {groupedEntries.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl">
            <Check className="text-text-muted mb-2" size={32} />
            <p className="text-text-secondary font-medium">No CRM records found.</p>
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
              <div className="text-xs text-text-muted italic">
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
          <div className="lg:col-span-4 border-r border-border pr-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <History size={16} className="text-primary" />
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">Version History</h4>
            </div>
            
            <div className="space-y-3">
              {versionsQuery.isLoading ? (
                <div className="text-xs text-text-muted flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent" />
                  Loading history...
                </div>
              ) : (
                versionsQuery.data?.map((v, idx) => (
                  <div 
                    key={v.id}
                    onClick={() => handleSelectVersion(v)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedVersion?.id === v.id 
                        ? 'bg-primary/5 border-primary shadow-premium' 
                        : 'bg-surface-elevated/30 border-border hover:border-text-muted'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">
                        V{versionsQuery.data.length - idx} {idx === 0 && <span className="text-secondary ml-1.5">(LATEST)</span>}
                      </span>
                      <StatusBadge status={v.status} className="scale-75 origin-right" />
                    </div>
                    <p className="text-xs font-bold text-text-primary mb-1 line-clamp-1">{v.company_name}</p>
                    <span className="text-[10px] text-text-muted flex items-center gap-1 font-medium">
                      <Clock size={10} />
                      {v.created_at ? formatDate(v.created_at) : 'N/A'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Details Form / View */}
          <div className="lg:col-span-8 flex flex-col h-full bg-surface-elevated/20 rounded-xl p-6 border border-border/50">
            {selectedVersion ? (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xl">
                      {selectedVersion.initials}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">{selectedVersion.client_name}</h3>
                      <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                         <span className="flex items-center gap-1.5">
                           <Mail size={14} className="text-text-muted" />
                           {selectedVersion.client_email}
                         </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-text-muted">TIER</span>
                      <span className={`text-xs font-bold ${selectedVersion.tier === 'Gold' ? 'text-primary' : 'text-text-muted'}`}>
                        {selectedVersion.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Confidence</span>
                      <StatusBadge status={selectedVersion.confidence} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase">Client Name</label>
                     {isEditMode ? (
                       <input 
                         type="text" 
                         value={editedData.client_name}
                         onChange={(e) => setEditedData({...editedData, client_name: e.target.value})}
                         className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:border-primary outline-none transition-all"
                       />
                     ) : (
                       <p className="text-sm font-medium text-text-primary py-2">{selectedVersion.client_name}</p>
                     )}
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase">Client Email</label>
                     {isEditMode ? (
                       <input 
                         type="email" 
                         value={editedData.client_email}
                         onChange={(e) => setEditedData({...editedData, client_email: e.target.value})}
                         className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:border-primary outline-none transition-all"
                       />
                     ) : (
                       <p className="text-sm font-medium text-text-primary py-2">{selectedVersion.client_email}</p>
                     )}
                   </div>
                   <div className="space-y-2 col-span-2">
                     <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase">Company Name</label>
                     {isEditMode ? (
                       <input 
                         type="text" 
                         value={editedData.company_name}
                         onChange={(e) => setEditedData({...editedData, company_name: e.target.value})}
                         className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:border-primary outline-none transition-all"
                       />
                     ) : (
                       <p className="text-sm font-medium text-text-primary py-2 flex items-center gap-2">
                         <Building2 size={16} className="text-primary" />
                         {selectedVersion.company_name}
                       </p>
                     )}
                   </div>
                </div>

                <div className="flex-1 space-y-2 mt-4 flex flex-col min-h-0">
                  <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase flex items-center justify-between">
                    Extracted JSON Data
                    {isEditMode && <span className="lowercase text-[9px] font-medium opacity-70">(Valid JSON required)</span>}
                  </label>
                  <div className="flex-1 bg-surface-dark/50 border border-border rounded-xl p-4 overflow-hidden flex flex-col font-mono text-xs">
                    {isEditMode ? (
                      <textarea
                        value={editedData.extracted_data}
                        onChange={(e) => setEditedData({...editedData, extracted_data: e.target.value})}
                        className="w-full h-full bg-transparent outline-none resize-none text-primary scrollbar-thin"
                      />
                    ) : (
                      <div className="w-full h-full overflow-y-auto pr-2 scrollbar-thin text-text-secondary whitespace-pre opacity-80">
                        {JSON.stringify(selectedVersion.extracted_data, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-text-muted space-y-4">
                 <div className="animate-pulse flex flex-col items-center">
                   <div className="w-16 h-16 rounded-full bg-border/20 mb-4" />
                   <div className="h-4 w-32 bg-border/20 rounded mb-2" />
                   <div className="h-3 w-48 bg-border/10 rounded" />
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

