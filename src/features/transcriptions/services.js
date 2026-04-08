import { supabase } from '../../lib/supabase/client';

export async function getTranscriptions() {
  try {
    const { data, error } = await supabase
      .from('transcripts')
      .select('id, title, client_name, client_email, meeting_date, status, retry_count, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(100);
    console.log("transcriptions", data);
    console.log("error", error);
    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('getTranscriptions error:', err);
    throw new Error('Failed to fetch transcriptions');
  }

}


