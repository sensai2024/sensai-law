// src/features/crm-approvals/queryKeys.js
export const crmApprovalKeys = {
  all: ['crm-approvals'],
  lists: () => [...crmApprovalKeys.all, 'list'],
  versions: (transcriptId) => [...crmApprovalKeys.all, 'versions', transcriptId],
  detail: (id) => [...crmApprovalKeys.all, 'detail', id],
};

