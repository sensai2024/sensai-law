import { supabase } from '../../lib/supabase/client';

export async function getContracts() {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('id, transcript_id, contract_family, audience, pinecone_score, tokens_used, cost_eur, drive_doc_url, status, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('getContracts error:', err);
    throw new Error('Failed to fetch contracts');
  }
}

export async function updateContractStatus(id, newStatus) {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .update({ status: newStatus })
      .eq('id', id)
      .select('id, status');

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('updateContractStatus error:', err);
    throw new Error('Failed to update contract status');
  }
}
