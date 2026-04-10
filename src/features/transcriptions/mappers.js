// src/features/transcriptions/mappers.js

export function mapTranscriptionsData(data) {
  if (!data) return [];

  return data.map(item => ({
    id: item.id,
    driveFileId: item.drive_file_id,
    name: item.title || `Unknown Recording #${item.id.substring(0, 4)}`,
    title: item.title,
    date: item.meeting_date ? new Date(item.meeting_date).toLocaleString() : (item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'),
    meetingDate: item.meeting_date,
    duration: 'N/A',
    status: item.status || 'processing',
    clientName: item.client_name,
    clientEmail: item.client_email,
    content: item.content,
    retryCount: item.retry_count || 0,
    createdAt: item.created_at,
  }));
}

