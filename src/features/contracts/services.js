import { supabase } from '../../lib/supabase/client';
import axios from 'axios';

const TRANSCRIPTION_WEBHOOK_URL = import.meta.env.VITE_TRANSCRIPTION_WEBHOOK_URL;

export async function getContractsGroupedByTranscript() {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('id, transcript_id, contract_family, audience, pinecone_score, tokens_used, cost_eur, status, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('getContractsGroupedByTranscript error:', err);
    throw new Error('Failed to fetch contracts');
  }
}

export async function getContractVersionsByTranscriptId(transcriptId) {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('id, transcript_id, drive_doc_id, drive_doc_url, contract_family, audience, pinecone_score, tokens_used, cost_eur, status, created_at, content')
      .eq('transcript_id', transcriptId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('getContractVersionsByTranscriptId error:', err);
    throw new Error('Failed to fetch contract versions');
  }
}

export async function getContractById(contractId) {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('id, transcript_id, drive_doc_id, drive_doc_url, contract_family, audience, pinecone_score, tokens_used, cost_eur, status, created_at, content')
      .eq('id', contractId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('getContractById error:', err);
    throw new Error('Failed to fetch contract details');
  }
}


export async function regenerateContract(contract) {
  if (!contract) throw new Error('Missing contract');

  try {
    // 1. Send webhook call to the transcription webhook
    const payload = {
      id: contract.id,
      transcript_id: contract.transcript_id,
      contract_family: contract.contract_family,
      audience: contract.audience,
      content: contract.content,
      action: 'regenerate'
    };

    const response = await axios.post(TRANSCRIPTION_WEBHOOK_URL, payload);
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Regeneration webhook failed with status ${response.status}`);
    }

    // 2. Update Supabase status to 'regenerating'
    const { error: updateError } = await supabase
      .from('contracts')
      .update({ status: 'regenerating' })
      .eq('id', contract.id);

    if (updateError) throw new Error(updateError.message);

    return { success: true, status: 'regenerating' };
  } catch (err) {
    console.error('regenerateContract error:', err);
    const message = err.response?.data?.message || err.message || 'Regeneration failed';
    throw new Error(message);
  }
}

export async function saveEditedContractAsNewVersion(contract, updatedContent) {
  if (!contract) throw new Error('Missing contract');

  try {
    // Create payload from original contract, replacing only content
    const newContract = {
      transcript_id: contract.transcript_id,
      drive_doc_id: contract.drive_doc_id,
      drive_doc_url: contract.drive_doc_url,
      contract_family: contract.contract_family,
      audience: contract.audience,
      pinecone_score: contract.pinecone_score,
      tokens_used: contract.tokens_used,
      cost_eur: contract.cost_eur,
      status: 'success', // New version starts as success/ready
      content: updatedContent
    };

    const { data, error } = await supabase
      .from('contracts')
      .insert(newContract)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('saveEditedContractAsNewVersion error:', err);
    throw new Error('Failed to save new contract version');
  }
}
