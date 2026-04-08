// src/features/errors/mappers.js

export function mapErrorsData(data) {
  if (!data) return [];

  return data.map(item => ({
    id: item.id,
    pipeline: item.pipeline || 'Pipeline',
    severity: item.status === 'retrying' ? 'Medium' : 'High',
    error: item.error_message || 'Execution failed during processing',
    timestamp: item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A',
    status: item.status || 'unresolved'
  }));
}
