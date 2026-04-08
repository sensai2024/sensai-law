import { supabase } from '../../lib/supabase/client';

export async function getPendingCrmApprovals() {
  try {
    const { data, error } = await supabase
      .from('crm_approvals')
      .select('id, transcript_id, client_name, client_email, company_name, confidence_tier, confidence_score, extracted_data, status, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('getPendingCrmApprovals error:', err);
    throw new Error('Failed to fetch pending CRM approvals');
  }
}

export async function updateCrmApprovalStatus(id, newStatus) {
  try {
    const { data, error } = await supabase
      .from('crm_approvals')
      .update({ 
        status: newStatus, 
        reviewed_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select('id, status');

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('updateCrmApprovalStatus error:', err);
    throw new Error('Failed to update CRM approval status');
  }
}
