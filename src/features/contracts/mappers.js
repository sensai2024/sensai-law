// src/features/contracts/mappers.js

export function mapContractsToGroupedEntries(data) {
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
      latest_family: latest.contract_family || 'Standard',
      latest_audience: latest.audience || 'General',
      latest_status: latest.status,
      latest_date: latest.created_at,
      version_count: versions.length,
      // We don't embed full versions here to keep the list light, 
      // but we return the latest metadata
      id: latest.id // Reference for the latest single item
    };
  });

  // Sort groups by latest date
  groupedEntries.sort((a, b) => new Date(b.latest_date) - new Date(a.latest_date));

  const kpis = [
    { label: 'ACTIVE THREADS', value: groupedEntries.length.toString(), trend: 'Unique Transcripts', type: 'Edit success' },
    { label: 'TOTAL VERSIONS', value: data.length.toString(), trend: 'Regenerations & Edits', type: 'processing' },
    { label: 'AVG VERSIONS', value: groupedEntries.length > 0 ? (data.length / groupedEntries.length).toFixed(1) : '0', trend: 'per Transcript', type: 'gold' },
  ];

  return { groupedEntries, kpis };
}

export function mapContractRowToVersionItem(item) {
  if (!item) return null;
  return {
    id: item.id,
    transcript_id: item.transcript_id,
    drive_doc_id: item.drive_doc_id,
    drive_doc_url: item.drive_doc_url,
    contract_family: item.contract_family,
    audience: item.audience,
    pinecone_score: item.pinecone_score,
    tokens_used: item.tokens_used,
    cost_eur: item.cost_eur,
    status: item.status,
    created_at: item.created_at,
    content: item.content
  };
}
