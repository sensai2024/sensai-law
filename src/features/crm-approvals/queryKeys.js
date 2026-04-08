// src/features/crm-approvals/queryKeys.js
export const crmApprovalKeys = {
  all: ['crm-approvals'],
  lists: () => [...crmApprovalKeys.all, 'list'],
};
