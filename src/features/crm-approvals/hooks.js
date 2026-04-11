// src/features/crm-approvals/hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApprovalKeys } from './queryKeys';
import { 
  getCrmApprovalsGroupedByTranscript, 
  getCrmApprovalVersionsByTranscriptId,
  getCrmApprovalById,
  sendCrmDecision,
  saveEditedCrmApproval
} from './services';

import { 
  mapCrmToGroupedEntries,
  mapCrmRowToVersionItem 
} from './mappers';

/**
 * Hook to fetch the grouped list of CRM records and Associated KPIs
 */
export function useCrmApprovalsGroupedQuery() {
  return useQuery({
    queryKey: crmApprovalKeys.lists(),
    queryFn: async () => {
      const data = await getCrmApprovalsGroupedByTranscript();
      return mapCrmToGroupedEntries(data);
    }
  });
}

/**
 * Hook to fetch all versions for a specific transcript
 */
export function useCrmApprovalVersionsQuery(transcriptId) {
  return useQuery({
    queryKey: crmApprovalKeys.versions(transcriptId),
    queryFn: async () => {
      const data = await getCrmApprovalVersionsByTranscriptId(transcriptId);
      return data.map(mapCrmRowToVersionItem);
    },
    enabled: !!transcriptId,
  });
}

/**
 * Hook to fetch a single CRM record by its ID
 */
export function useCrmApprovalDetailsQuery(id) {
  return useQuery({
    queryKey: crmApprovalKeys.detail(id),
    queryFn: () => getCrmApprovalById(id),
    enabled: !!id,
  });
}

/**
 * Hook to handle a CRM decision (approve OR reject) via the webhook.
 * n8n is responsible for updating the DB after the webhook is received.
 *
 * Usage:
 *   const decisionMutation = useCrmDecisionMutation();
 *   decisionMutation.mutate({ crmApproval, reviewerEmail, status: 'approved' });
 *   decisionMutation.mutate({ crmApproval, reviewerEmail, status: 'rejected' });
 */
export function useCrmDecisionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ crmApproval, reviewerEmail, status }) =>
      sendCrmDecision({ crmApproval, reviewerEmail, status }),
    onSuccess: (_, { crmApproval }) => {
      queryClient.invalidateQueries({ queryKey: crmApprovalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: crmApprovalKeys.versions(crmApproval.transcript_id) });
      queryClient.invalidateQueries({ queryKey: crmApprovalKeys.detail(crmApproval.id) });
      queryClient.invalidateQueries({ queryKey: ['sidebarCounts'] });
    },
  });
}


/**
 * Hook to save an edited CRM record as a new version
 */
export function useSaveEditedCrmApprovalMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ crmApproval, updatedData }) => saveEditedCrmApproval(crmApproval, updatedData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: crmApprovalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: crmApprovalKeys.versions(data.transcript_id) });
      queryClient.invalidateQueries({ queryKey: ['sidebarCounts'] });
    }
  });
}

