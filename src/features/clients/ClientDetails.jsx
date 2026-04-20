// src/features/clients/ClientDetails.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientDetailsQuery } from './hooks';
import StatCard from '../../components/ui/StatCard';
import SectionCard from '../../components/ui/SectionCard';
import ActionButton from '../../components/ui/ActionButton';
import { ArrowLeft, FileText, CheckSquare, Activity } from 'lucide-react';

export default function ClientDetails() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const email = decodeURIComponent(clientId);

  const { data: client, isLoading, isError } = useClientDetailsQuery(email);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-24 bg-surface-elevated rounded mb-6"></div>
        <div className="h-10 w-64 bg-surface-elevated rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-surface-elevated rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-900/20 text-red-400 rounded-xl border border-red-900/50">
        Failed to load client details. Please try again later.
      </div>
    );
  }

  if (!client) {
    return <div className="text-zinc-400">Client not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center text-sm text-zinc-400 hover:text-zinc-100 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">{client.name}</h1>
            <p className="text-zinc-400 mt-1">{client.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Contracts" value={client.metrics.contracts} icon={FileText} trendType="neutral" />
        <StatCard label="CRM Approvals" value={client.metrics.approvals} icon={CheckSquare} trendType="success" />
        <StatCard label="Transcripts" value={client.metrics.transcripts} icon={Activity} trendType="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Recent Contracts">
          {client.contracts.length > 0 ? (
            <ul className="space-y-3">
              {client.contracts.map(c => (
                <li key={c.id} className="p-3 bg-zinc-900/50 rounded flex justify-between">
                  <span className="text-zinc-300 truncate mr-2">{c.title || `Contract #${c.id.substring(0, 6)}`}</span>
                  <span className="text-xs text-zinc-500 uppercase">{c.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic py-4">No contracts associated.</p>
          )}
        </SectionCard>

        <SectionCard title="Recent Approvals">
          {client.approvals.length > 0 ? (
            <ul className="space-y-3">
              {client.approvals.map(a => (
                <li key={a.id} className="p-3 bg-zinc-900/50 rounded flex justify-between">
                  <span className="text-zinc-300">Approval #{a.id.substring(0, 8)}</span>
                  <span className="text-xs text-brand-primary">{a.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic py-4">No approvals found.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
