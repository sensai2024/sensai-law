export const DASHBOARD_STATS = [
  { id: 'contracts', label: 'CONTRACTS GENERATED', value: '14', trend: '↑ 3 this week', trendType: 'success' },
  { id: 'clients', label: 'CLIENTS SAVED TO CRM', value: '11', trend: '↑ 2 pending approval', trendType: 'warning' },
  { id: 'time', label: 'TIME SAVED (HRS)', value: '42', trend: 'vs manual process', trendType: 'muted' },
  { id: 'errors', label: 'PIPELINE ERRORS', value: '1', trend: 'Requires attention', trendType: 'error' },
  { id: 'cost', label: 'COST PER CONTRACT', value: '€0.18', trend: 'avg tokens × Gemini rate', trendType: 'muted' },
  { id: 'tokens', label: 'AVG TOKENS / RUN', value: '48k', trend: '↓ improving with prompt tuning', trendType: 'success' },
  { id: 'pinecone', label: 'PINECONE AVG SCORE', value: '0.86', trend: '↑ template match quality', trendType: 'success' },
  { id: 'success_rate', label: 'SUCCESS RATE', value: '93%', trend: '14 of 15 runs', trendType: 'processing' },
];

export const CONTRACTS_CHART_DATA = [
  { name: 'Mar 2', value: 1.0 },
  { name: 'Mar 15', value: 2.0 },
  { name: 'Mar 22', value: 3.0 },
  { name: 'Mar 20', value: 4.0 },
  { name: 'Apr 5', value: 3.0 },
  { name: 'Apr 7', value: 1.0 },
];

export const SAVINGS_BREAKDOWN = [
  { label: 'Manual drafting cost avoided', value: '€3,920', type: 'success' },
  { label: 'Automation run cost', value: '€2.52', type: 'error' },
  { label: 'Net saving', value: '€3,917', type: 'success' },
  { label: 'ROI multiple', value: '1,555x', type: 'gold' },
];

export const CRM_APPROVALS = [
  {
    id: 1,
    initials: 'JD',
    name: 'Jean Dupont',
    email: 'j.dupont@avocats.fr',
    company: 'Cabinet Dupont & Co',
    source: 'Website Form',
    confidence: 'High',
    tier: 'Gold',
  },
  {
    id: 2,
    initials: 'ML',
    name: 'Marie Laurent',
    email: 'm.laurent@techlaw.io',
    company: 'TechLaw solutions',
    source: 'Email Scan',
    confidence: 'Medium',
    tier: 'Silver',
  },
];

export const RECENT_ACTIVITY = [
    { id: 1, type: 'contract', action: 'Generated', target: 'MNDA - Tech Corp', time: '2 mins ago', status: 'success' },
    { id: 2, type: 'crm', action: 'Pending Approval', target: 'Jean Dupont', time: '1 hour ago', status: 'warning' },
    { id: 3, type: 'error', action: 'Failed', target: 'Lease Agreement - Unit 4', time: '3 hours ago', status: 'error' },
];

export const CONTRACTS_LIST = [
    { id: 1, name: 'MNDA - Tech Corp', type: 'Partnership', score: '0.92', date: '2024-04-07', status: 'Generated' },
    { id: 2, name: 'Service Agreement - Blue', type: 'Service', score: '0.88', date: '2024-04-06', status: 'Generated' },
    { id: 3, name: 'Employment - Sarah J.', type: 'HR', score: '0.64', date: '2024-04-05', status: 'Failed' },
];

export const CONTRACT_DISTRIBUTION = [
    { name: 'Partnership', value: 40 },
    { name: 'Service', value: 30 },
    { name: 'HR', value: 20 },
    { name: 'NDA', value: 10 },
];

export const PIPELINE_ERRORS = [
    { id: 1, pipeline: 'Contract Generation', error: 'Gemini API Timeout', severity: 'High', timestamp: '2024-04-07 14:22', status: 'Unresolved' },
    { id: 2, pipeline: 'CRM Sync', error: 'Invalid Company ID format', severity: 'Medium', timestamp: '2024-04-07 10:15', status: 'Retrying' },
];
