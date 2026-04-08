// src/features/dashboard/services.js
import { supabase } from '../../lib/supabase/client';

export async function getDashboardData() {
  try {
    const [
      { data: contracts, error: cErr },
      { data: approvals, error: aErr },
      { data: transcripts, error: tErr },
      { data: activities, error: actErr }
    ] = await Promise.all([
      supabase.from('contracts').select('id, status, created_at, tokens_used').limit(100),
      supabase.from('crm_approvals').select('id, status').limit(100),
      supabase.from('transcripts').select('id, status, created_at').limit(100),
      supabase.from('activity_log').select('id, type, title, detail, metadata, created_at').order('created_at', { ascending: false }).limit(5)
    ]);

    if (cErr) throw new Error(cErr.message);
    if (aErr) throw new Error(aErr.message);
    if (tErr) throw new Error(tErr.message);
    if (actErr) throw new Error(actErr.message);

    return { 
      contracts: contracts || [], 
      approvals: approvals || [], 
      transcripts: transcripts || [], 
      activities: activities || [] 
    };
  } catch (error) {
    console.error('getDashboardData error:', error);
    throw new Error('Failed to fetch dashboard data. Please try again later.');
  }
}
