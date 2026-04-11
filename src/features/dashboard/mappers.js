// src/features/dashboard/mappers.js

// Cost per token (Gemini Flash ~$0.075 / 1M input tokens)
const GEMINI_RATE_PER_TOKEN = 0.075 / 1_000_000;

export function mapDashboardData(data) {
  const { contracts, approvals, transcripts, activities, pipelineRuns } = data;

  // ── Row 1 ────────────────────────────────────────────────────────────────

  // 1. Contracts Generated
  const totalContracts = contracts.length;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const contractsThisWeek = contracts.filter(
    c => c.created_at && new Date(c.created_at) >= oneWeekAgo
  ).length;

  // 2. Clients Saved to CRM
  const totalCrm = approvals.length;
  const pendingCrm = approvals.filter(a => a.status === 'pending').length;

  // 3. Time Saved (hrs) — estimate 3 hrs saved per contract vs manual process
  const timeSaved = totalContracts * 3;

  // 4. Pipeline Errors
  const pipelineErrors = pipelineRuns.filter(
    r => r.status === 'error' || r.status === 'failed'
  ).length;

  // ── Row 2 ────────────────────────────────────────────────────────────────

  // 5. Cost Per Contract (avg tokens_used * Gemini rate per contract)
  const contractsWithTokens = contracts.filter(c => c.tokens_used > 0);
  const avgTokensPerContract = contractsWithTokens.length
    ? contractsWithTokens.reduce((s, c) => s + c.tokens_used, 0) / contractsWithTokens.length
    : 0;
  const costPerContract = avgTokensPerContract * GEMINI_RATE_PER_TOKEN;

  // 6. Avg Tokens / Run (from pipeline_runs)
  const runsWithTokens = pipelineRuns.filter(r => r.tokens_used > 0);
  const avgTokensPerRun = runsWithTokens.length
    ? runsWithTokens.reduce((s, r) => s + r.tokens_used, 0) / runsWithTokens.length
    : avgTokensPerContract; // fall back to contract average
  const avgTokensDisplay = avgTokensPerRun >= 1000
    ? `${Math.round(avgTokensPerRun / 1000)}k`
    : Math.round(avgTokensPerRun).toString();

  // 7. Pinecone Avg Score
  const runsWithScore = pipelineRuns.filter(r => r.pinecone_score != null);
  const avgPineconeScore = runsWithScore.length
    ? runsWithScore.reduce((s, r) => s + r.pinecone_score, 0) / runsWithScore.length
    : null;

  // 8. Success Rate
  const totalRuns = pipelineRuns.length;
  const successfulRuns = pipelineRuns.filter(
    r => r.status === 'success' || r.status === 'completed'
  ).length;
  const successRate = totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : null;

  // ── Stat cards ────────────────────────────────────────────────────────────

  const dashboardStats = [
    {
      id: 1,
      label: 'CONTRACTS GENERATED',
      value: totalContracts.toString(),
      trend: `↑ ${contractsThisWeek} this week`,
      trendType: 'success',
    },
    {
      id: 2,
      label: 'CLIENTS SAVED TO CRM',
      value: totalCrm.toString(),
      trend: pendingCrm > 0 ? `↑ ${pendingCrm} pending approval` : 'All approved',
      trendType: pendingCrm > 0 ? 'success' : 'neutral',
    },
    {
      id: 3,
      label: 'TIME SAVED (HRS)',
      value: timeSaved.toString(),
      trend: 'vs manual process',
      trendType: 'neutral',
    },
    {
      id: 4,
      label: 'PIPELINE ERRORS',
      value: pipelineErrors.toString(),
      trend: pipelineErrors > 0 ? 'Requires attention' : 'All clear',
      trendType: pipelineErrors > 0 ? 'error' : 'success',
    },
    {
      id: 5,
      label: 'COST PER CONTRACT',
      value: costPerContract > 0 ? `€${costPerContract.toFixed(2)}` : '—',
      trend: 'avg tokens × Gemini rate',
      trendType: 'neutral',
    },
    {
      id: 6,
      label: 'AVG TOKENS / RUN',
      value: avgTokensPerRun > 0 ? avgTokensDisplay : '—',
      trend: '↓ improving with prompt tuning',
      trendType: 'neutral',
    },
    {
      id: 7,
      label: 'PINECONE AVG SCORE',
      value: avgPineconeScore != null ? avgPineconeScore.toFixed(2) : '—',
      trend: '↑ template match quality',
      trendType: 'gold',
    },
    {
      id: 8,
      label: 'SUCCESS RATE',
      value: successRate != null ? `${successRate}%` : '—',
      trend: totalRuns > 0 ? `${successfulRuns} of ${totalRuns} runs` : 'No runs yet',
      trendType: successRate != null && successRate >= 80 ? 'success' : 'warning',
    },
  ];

  // ── Charts & activity (unchanged) ─────────────────────────────────────────

  const contractsChartMap = {};
  contracts.forEach(c => {
    const d = c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Unknown';
    contractsChartMap[d] = (contractsChartMap[d] || 0) + 1;
  });

  const contractsChartData = Object.entries(contractsChartMap)
    .slice(-7)
    .map(([name, value]) => ({ name, value }));

  const savingsBreakdown = [
    { label: 'Time Saved (Estimated)', value: `${timeSaved} hours`, type: 'gold' },
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
