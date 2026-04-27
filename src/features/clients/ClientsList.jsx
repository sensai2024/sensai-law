// src/features/clients/ClientsList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientsListQuery } from './hooks';
import SectionCard from '../../components/ui/SectionCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { Users, FileText, CheckCircle } from 'lucide-react';

export default function ClientsList() {
  const { data: clients, isLoading, isError } = useClientsListQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-[var(--surface)] rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-[var(--surface)] rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-900/20 text-red-400 rounded-xl border border-red-900/50">
        Failed to load clients. Please try again later.
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[var(--border)] rounded-xl">
        <Users className="w-12 h-12 text-[var(--text-muted)] mb-4" />
        <h3 className="text-lg font-medium text-[var(--text)]">No clients found</h3>
        <p className="text-[var(--text-muted)] mt-2">Data will appear once there are contracts or approvals for clients.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text)] tracking-tight">Clients Directory</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div 
            key={client.email} 
            className="group cursor-pointer"
            onClick={() => navigate(`/clients/${encodeURIComponent(client.email)}`)}
          >
            <SectionCard className="h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text)]">{client.name}</h3>
                  <p className="text-sm text-[var(--text-muted)] truncate max-w-[200px]" title={client.email}>{client.email}</p>
                </div>
                {/* Simplified Status logic */}
                <StatusBadge status={client.contractsCount > 0 ? 'success' : 'processing'} />
              </div>

              <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]/50">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-sm text-[var(--text-muted)]">{client.contractsCount} Contracts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-sm text-[var(--text-muted)]">{client.approvalsCount} Approvals</span>
                </div>
              </div>
            </SectionCard>
          </div>
        ))}
      </div>
    </div>
  );
}
