// src/features/dashboard/mappers.js

export function mapDashboardData(data) {
  const { contracts, approvals, transcripts, activities } = data;

  const totalContracts = contracts.length;
  const crmTokens = contracts.reduce((sum, t) => sum + (t.tokens_used || 0), 0);
  const pendingApprovals = approvals.filter(a => a.status === 'pending').length;
  const totalTranscriptions = transcripts.length;

  const dashboardStats = [
    { id: 1, label: 'TOTAL CONTRACTS', value: totalContracts.toString(), trend: 'Updated Just Now', trendType: 'success' },
    { id: 2, label: 'TOTAL TOKENS', value: crmTokens.toLocaleString(), trend: 'Normal limit', trendType: 'neutral' },
    { id: 3, label: 'PENDING APPROVALS', value: pendingApprovals.toString(), trend: 'Requires Attention', trendType: pendingApprovals > 0 ? 'warning' : 'success' },
    { id: 4, label: 'TRANSCRIPTIONS', value: totalTranscriptions.toString(), trend: 'Active', trendType: 'neutral' }
  ];

  // Group contracts by creation date roughly
  const contractsChartMap = {};
  contracts.forEach(c => {
    const d = c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Unknown';
    contractsChartMap[d] = (contractsChartMap[d] || 0) + 1;
  });

  const contractsChartData = Object.entries(contractsChartMap)
    .slice(-7) // last 7 points
    .map(([name, value]) => ({ name, value }));

  const savingsBreakdown = [
    { label: 'Time Saved (Estimated)', value: totalContracts * 2 + ' hours', type: 'gold' },
    { label: 'Errors Prevented', value: (totalContracts * 0.1).toFixed(0), type: 'success' },
  ];

  const recentActivity = activities.map(act => ({
    id: act.id,
    action: act.title || 'System Notification',
    target: act.detail || '',
    type: act.type || 'Log',
    time: act.created_at ? new Date(act.created_at).toLocaleTimeString() : 'Just now',
    status: act.type === 'error' || act.type === 'failure' ? 'Failed' : 'success'
  }));

  return {
    dashboardStats,
    contractsChartData,
    savingsBreakdown,
    recentActivity
  };
}
