import { supabase } from '../../lib/supabase/client';

export async function getPipelineErrors() {
  try {
    const { data, error } = await supabase
      .from('pipeline_runs')
      .select('id, transcript_id, pipeline, status, error_message, attempts, duration_ms, created_at')
      .in('status', ['error', 'failed', 'retrying'])
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);
    return data || [];
  } catch (err) {
    console.error('getPipelineErrors error:', err);
    throw new Error('Failed to fetch pipeline errors');
  }
}

export async function updatePipelineRunStatus(id, newStatus) {
  try {
    const { data, error } = await supabase
      .from('pipeline_runs')
      .update({ status: newStatus })
      .eq('id', id)
      .select('id, status');

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('updatePipelineRunStatus error:', err);
    throw new Error('Failed to update pipeline run status');
  }
}
