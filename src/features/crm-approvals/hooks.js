// src/features/crm-approvals/hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApprovalKeys } from './queryKeys';
import { getPendingCrmApprovals, updateCrmApprovalStatus } from './services';
import { mapCrmApprovals } from './mappers';

export function usePendingApprovalsQuery() {
  return useQuery({
    queryKey: crmApprovalKeys.lists(),
    queryFn: async () => {
      const data = await getPendingCrmApprovals();
      return mapCrmApprovals(data);
    }
  });
}

export function useUpdateApprovalMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => updateCrmApprovalStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: crmApprovalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['sidebarCounts'] });
    }
  });
}
