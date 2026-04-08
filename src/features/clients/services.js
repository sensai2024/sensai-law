import { supabase } from '../../lib/supabase/client';

export async function getClientsData() {
  try {
    const [
      { data: approvals, error: approvalsErr },
      { data: contracts, error: contractsErr },
      { data: transcripts, error: transcriptsErr }
    ] = await Promise.all([
      supabase.from('crm_approvals').select('id, client_name, client_email, status, created_at, reviewed_at'),
      // contracts don't have client_email natively in the new schema, we must join transcript.
      supabase.from('contracts').select('id, status, transcript_id, transcripts (client_email)'),
      supabase.from('transcripts').select('id, client_email, status, created_at')
    ]);

    if (approvalsErr) throw new Error(approvalsErr.message);
    if (contractsErr) throw new Error(contractsErr.message);
    if (transcriptsErr) throw new Error(transcriptsErr.message);

    return { approvals, contracts, transcripts };
  } catch (error) {
    console.error('getClientsData error:', error);
    throw new Error('Failed to fetch clients data');
  }
}

export async function getClientDetails(email) {
  try {
    const [
      { data: approvals, error: approvalsErr },
      { data: contracts, error: contractsErr },
      { data: transcripts, error: transcriptsErr },
      { data: activities, error: activitiesErr }
    ] = await Promise.all([
      supabase.from('crm_approvals').select('id, client_name, client_email, status, created_at, reviewed_at').eq('client_email', email),
      supabase.from('contracts').select('id, status, created_at, transcript_id, contract_family, transcripts!inner(client_email)').eq('transcripts.client_email', email),
      supabase.from('transcripts').select('id, status, client_name, client_email, created_at').eq('client_email', email),
      supabase.from('activity_log').select('id, type, title, detail, created_at, transcripts!inner(client_email)').eq('transcripts.client_email', email).order('created_at', { ascending: false }).limit(10)
    ]);

    if (approvalsErr) throw new Error(approvalsErr.message);
    if (contractsErr) throw new Error(contractsErr.message);
    if (transcriptsErr) throw new Error(transcriptsErr.message);
    
    if (activitiesErr && activitiesErr.code !== '42P01') { 
      console.warn("Activity fetch error:", activitiesErr.message);
    }

    return { approvals, contracts, transcripts, activities: activities || [] };
  } catch (error) {
    console.error('getClientDetails error:', error);
    throw new Error('Failed to fetch client details');
  }
}
