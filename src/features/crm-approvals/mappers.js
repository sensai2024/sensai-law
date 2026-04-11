// src/features/crm-approvals/mappers.js

export function mapCrmToGroupedEntries(data) {
  if (!data || !Array.isArray(data)) return { groupedEntries: [], kpis: [] };

  const groups = {};
  data.forEach(item => {
    const tid = item.transcript_id || 'unknown';
    if (!groups[tid]) {
      groups[tid] = [];
    }
    groups[tid].push(item);
  });

  const groupedEntries = Object.keys(groups).map(tid => {
    const versions = groups[tid].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const latest = versions[0];

    return {
      transcript_id: tid,
      latest_client_name: latest.client_name || 'Unknown Client',
      latest_company_name: latest.company_name || 'Unknown Company',
      latest_status: latest.status,
      latest_date: latest.created_at,
      version_count: versions.length,
      id: latest.id // Reference for the latest single item
    };
  });

  // Sort groups by latest date
  groupedEntries.sort((a, b) => new Date(b.latest_date) - new Date(a.latest_date));

  const kpis = [
    { label: 'ACTIVE THREADS', value: groupedEntries.length.toString(), trend: 'Unique Transcripts', type: 'approved' },
    { label: 'TOTAL VERSIONS', value: data.length.toString(), trend: 'History items', type: 'processing' },
    { label: 'AVG VERSIONS', value: groupedEntries.length > 0 ? (data.length / groupedEntries.length).toFixed(1) : '0', trend: 'per Transcript', type: 'gold' },
  ];

  return { groupedEntries, kpis };
}

export function mapCrmRowToVersionItem(item) {
  if (!item) return null;
  return {
    ...item,
    initials: (item.client_name || 'U').substring(0, 2).toUpperCase(),
    confidence: item.confidence_score !== undefined && item.confidence_score !== null 
      ? (item.confidence_score > 0.85 ? 'high' : 'medium') 
      : 'processing',
    tier: item.confidence_tier || 'Standard',
  };
}

