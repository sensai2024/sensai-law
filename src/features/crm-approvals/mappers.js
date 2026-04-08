// src/features/crm-approvals/mappers.js
export function mapCrmApprovals(data) {
  if (!data) return [];
  
  return data.map(item => ({
    id: item.id,
    name: item.client_name || 'Unknown',
    initials: (item.client_name || 'U').substring(0, 2).toUpperCase(),
    email: item.client_email || 'No email',
    company: item.company_name || 'Unknown',
    confidence: item.confidence_score !== undefined && item.confidence_score !== null ? (item.confidence_score > 0.85 ? 'high' : 'medium') : 'processing',
    tier: item.confidence_tier || 'Standard',
  }));
}
