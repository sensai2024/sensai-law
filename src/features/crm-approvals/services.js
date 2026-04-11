import { supabase } from '../../lib/supabase/client';
import axios from 'axios';

const CRM_APPROVE_WEBHOOK_URL = import.meta.env.VITE_CRM_APPROVE_WEBHOOK_URL;

const CRM_COLUMNS = 'id, transcript_id, client_name, client_email, company_name, confidence_tier, confidence_score, extracted_data, status, reviewed_by, reviewed_at, pennylane_id, created_at';

export async function getCrmApprovalsGroupedByTranscript() {
  try {
    const { data, error } = await supabase
      .from('crm_approvals')
      .select(CRM_COLUMNS)
      .order('created_at', { ascending: false })
      .limit(300);

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('getCrmApprovalsGroupedByTranscript error:', err);
    throw new Error('Failed to fetch CRM records');
  }
}

export async function getCrmApprovalVersionsByTranscriptId(transcriptId) {
  try {
    const { data, error } = await supabase
      .from('crm_approvals')
      .select(CRM_COLUMNS)
      .eq('transcript_id', transcriptId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('getCrmApprovalVersionsByTranscriptId error:', err);
    throw new Error('Failed to fetch CRM versions');
  }
}

export async function getCrmApprovalById(id) {
  try {
    const { data, error } = await supabase
      .from('crm_approvals')
      .select(CRM_COLUMNS)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('getCrmApprovalById error:', err);
    throw new Error('Failed to fetch CRM record details');
  }
}


/**
 * Sends a CRM decision (approve or reject) via webhook.
 * The frontend does NOT update Supabase directly — n8n handles the DB update.
 *
 * @param {{ crmApproval: object, reviewerEmail: string, status: 'approved' | 'rejected' }}
 */
export async function sendCrmDecision({ crmApproval, reviewerEmail, status }) {
  if (!crmApproval) throw new Error('Missing CRM record');
  if (!status) throw new Error('Missing decision status');

  if (!CRM_APPROVE_WEBHOOK_URL) {
    throw new Error('CRM webhook URL is not configured (VITE_CRM_APPROVE_WEBHOOK_URL)');
  }

  try {
    const response = await axios.post(CRM_APPROVE_WEBHOOK_URL, {
      approval_id: crmApproval.id,
      transcript_id: crmApproval.transcript_id,
      reviewed_by: reviewerEmail || 'unknown',
      status,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Altata-Secret': 'your-secret-here',
      },
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Webhook responded with unexpected status ${response.status}`);
    }

    // n8n / webhook workflow is responsible for updating the DB status.
    return { success: true };
  } catch (err) {
    console.error('sendCrmDecision error:', err);
    throw new Error(err.message || `Failed to send CRM ${status} webhook`);
  }
}

export async function saveEditedCrmApproval(crmApproval, updatedData) {
  if (!crmApproval) throw new Error('Missing CRM record');

  try {
    // Prepare new record data - preserving history by inserting a new row
    const newRecord = {
      transcript_id: crmApproval.transcript_id,
      client_name: updatedData.client_name ?? crmApproval.client_name,
      client_email: updatedData.client_email ?? crmApproval.client_email,
      company_name: updatedData.company_name ?? crmApproval.company_name,
      extracted_data: updatedData.extracted_data ?? crmApproval.extracted_data,
      confidence_tier: crmApproval.confidence_tier,
      confidence_score: crmApproval.confidence_score,
      pennylane_id: crmApproval.pennylane_id,
      status: 'pending' // New edits revert to pending for review
    };

    const { data, error } = await supabase
      .from('crm_approvals')
      .insert(newRecord)
      .select(CRM_COLUMNS)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('saveEditedCrmApproval error:', err);
    throw new Error('Failed to save edited CRM record');
  }
}

