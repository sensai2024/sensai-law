// src/features/transcriptions/mappers.js

export function mapTranscriptionsData(data) {
  if (!data) return [];

  return data.map(item => ({
    id: item.id,
    name: item.title || `Unknown Recording #${item.id.substring(0,4)}`,
    date: item.meeting_date ? new Date(item.meeting_date).toLocaleString() : (item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'),
    duration: 'N/A', // Duration is not defined in the new schema, placeholder
    status: item.status || 'processing',
    clientName: item.client_name,
    clientEmail: item.client_email,
  }));
}
