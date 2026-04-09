// src/components/layout/services.js
import { supabase } from '../../lib/supabase/client';

export async function getSidebarCounts() {
  try {
    const [
      { count: totalTranscripts },
      { count: totalContracts },
      { count: totalApprovals },
      { count: pendingApprovals },
      { count: dashboardErrors },
      { count: totalErrors },
      { data: transcriptsClients },
      { data: approvalsClients }
    ] = await Promise.all([
      supabase.from('transcripts').select('*', { count: 'exact', head: true }),
      supabase.from('contracts').select('*', { count: 'exact', head: true }),
      supabase.from('crm_approvals').select('*', { count: 'exact', head: true }),
      supabase.from('crm_approvals').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('pipeline_runs').select('*', { count: 'exact', head: true }).eq('status', 'error'),
      supabase.from('pipeline_runs').select('*', { count: 'exact', head: true }).in('status', ['error', 'retrying']),
      supabase.from('transcripts').select('client_email').not('client_email', 'is', null),
      supabase.from('crm_approvals').select('client_email').not('client_email', 'is', null)
    ]);

    const clientSet = new Set();
    if (transcriptsClients) {
      transcriptsClients.forEach(t => t.client_email && clientSet.add(t.client_email));
    }
    if (approvalsClients) {
      approvalsClients.forEach(a => a.client_email && clientSet.add(a.client_email));
    }

    return {
      dashboard: {
        transcripts: totalTranscripts || 0,
        contracts: totalContracts || 0,
        approvals: totalApprovals || 0,
        errors: dashboardErrors || 0
      },
      transcriptions: totalTranscripts || 0,
      crmApprovals: pendingApprovals || 0,
      contracts: totalContracts || 0,
      errors: totalErrors || 0,
      clients: clientSet.size
    };
  } catch (error) {
    console.error('getSidebarCounts fetch error:', error);
    return {
      dashboard: { transcripts: 0, contracts: 0, approvals: 0, errors: 0 },
      transcriptions: 0,
      crmApprovals: 0,
      contracts: 0,
      errors: 0,
      clients: 0
    };
  }
}
