// src/features/contracts/mappers.js

export function mapContractsData(data) {
  if (!data) return { contracts: [], distribution: [], kpis: [] };

  const contracts = data.map(item => ({
    id: item.id,
    name: item.contract_family ? `${item.contract_family} - ${item.audience || 'Unknown'}` : `Contract #${item.id.substring(0,6)}`,
    type: item.contract_family || 'Standard',
    score: (item.pinecone_score !== undefined && item.pinecone_score !== null ? item.pinecone_score : 0.95).toFixed(2),
    date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
    status: item.status || 'generated',
    url: item.drive_doc_url
  }));

  const typesMap = {};
  data.forEach(item => {
    const t = item.contract_family || 'Standard';
    typesMap[t] = (typesMap[t] || 0) + 1;
  });

  const distribution = Object.keys(typesMap).map(key => ({
    name: key,
    value: typesMap[key]
  }));

  const completed = data.filter(d => d.status === 'generated' || d.status === 'success');
  const completionRate = data.length > 0 ? ((completed.length / data.length) * 100).toFixed(1) : 0;

  const kpis = [
    { label: 'TOTAL CONTRACTS', value: data.length.toString(), trend: 'Updated Just Now', type: 'success' },
    { label: 'COMPLETION RATE', value: `${completionRate}%`, trend: 'Target: 95%', type: 'processing' },
    { label: 'AVG DRAFT TIME', value: '1.2s', trend: 'vs 4h manual', type: 'gold' },
  ];

  return { contracts, distribution, kpis };
}
