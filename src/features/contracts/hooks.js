// src/features/contracts/hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsKeys } from './queryKeys';
import { 
  getContractsGroupedByTranscript, 
  getContractVersionsByTranscriptId,
  getContractById, 
  regenerateContract, 
  saveEditedContractAsNewVersion 
} from './services';
import { 
  mapContractsToGroupedEntries,
  mapContractRowToVersionItem 
} from './mappers';

/**
 * Hook to fetch the grouped list of contracts and associated KPIs
 */
export function useContractsGroupedQuery() {
  return useQuery({
    queryKey: contractsKeys.lists(),
    queryFn: async () => {
      const data = await getContractsGroupedByTranscript();
      return mapContractsToGroupedEntries(data);
    }
  });
}

/**
 * Hook to fetch all versions for a specific transcript
 */
export function useContractVersionsQuery(transcriptId) {
  return useQuery({
    queryKey: ['contracts', 'versions', transcriptId],
    queryFn: async () => {
      const data = await getContractVersionsByTranscriptId(transcriptId);
      return data.map(mapContractRowToVersionItem);
    },
    enabled: !!transcriptId,
  });
}

/**
 * Hook to fetch a single contract by its ID
 */
export function useContractDetailsQuery(contractId) {
  return useQuery({
    queryKey: contractsKeys.detail(contractId),
    queryFn: () => getContractById(contractId),
    enabled: !!contractId,
  });
}


/**
 * Hook to handle contract regeneration
 */
export function useRegenerateContractMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (contract) => regenerateContract(contract),
    onSuccess: (data, contract) => {
      queryClient.invalidateQueries({ queryKey: contractsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['contracts', 'versions', contract.transcript_id] });
      queryClient.invalidateQueries({ queryKey: contractsKeys.detail(contract.id) });
      queryClient.invalidateQueries({ queryKey: ['sidebarCounts'] });
    }
  });
}

/**
 * Hook to save an edited contract as a new version
 */
export function useSaveEditedContractMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contract, content }) => saveEditedContractAsNewVersion(contract, content),
    onSuccess: (data) => {
      // Invalidate list and the specific transcript thread
      queryClient.invalidateQueries({ queryKey: contractsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['contracts', 'versions', data.transcript_id] });
      queryClient.invalidateQueries({ queryKey: ['sidebarCounts'] });
    }
  });
}
