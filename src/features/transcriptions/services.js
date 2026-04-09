import { supabase } from '../../lib/supabase/client';
import axios from 'axios';

const WEBHOOK_URL = import.meta.env.VITE_TRANSCRIPTION_WEBHOOK_URL;

export async function getTranscriptions() {
  try {
    const { data, error } = await supabase
      .from('transcripts')
      .select(
        'id, drive_file_id, title, content, client_name, client_email, meeting_date, status, retry_count, created_at'
      )
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);
    return data ?? [];
  } catch (err) {
    console.error('getTranscriptions error:', err);
    throw new Error('Failed to fetch transcriptions');
  }
}

export async function getTranscriptionById(id) {
  try {
    const { data, error } = await supabase
      .from('transcripts')
      .select(
        'id, drive_file_id, title, content, client_name, client_email, meeting_date, status, retry_count, created_at'
      )
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (err) {
    console.error('getTranscriptionById error:', err);
    throw new Error('Failed to fetch transcription details');
  }
}

export async function approveTranscription(transcription) {
  try {
    const payload = {
      transcript_id: transcription.id,
      drive_file_id: transcription.drive_file_id,
      title: transcription.title,
      content: transcription.content,
    };

    console.log('WEBHOOK PAYLOAD:', payload);

    const response = await axios.post(WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('WEBHOOK RESPONSE:', response.data);

    return response.data;
  } catch (err) {
    console.error('approveTranscription error:', err);
    const message =
      err.response?.data?.message ||
      err.message ||
      'Failed to approve transcription';
    throw new Error(message);
  }
}