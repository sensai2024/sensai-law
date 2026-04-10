// src/features/contracts/hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsKeys } from './queryKeys';
import { 
  getContracts, 
  getContractById, 
  regenerateContract, 
  saveEditedContractAsNewVersion 
} from './services';
import { mapContractsData } from './mappers';

/**
 * Hook to fetch the list of contracts and associated KPIs
 */
export function useContractsQuery() {
  return useQuery({
    queryKey: contractsKeys.lists(),
    queryFn: async () => {
      const data = await getContracts();
      return mapContractsData(data);
    }
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
    onSuccess: () => {
      // Invalidate list so the new version appears
      queryClient.invalidateQueries({ queryKey: contractsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['sidebarCounts'] });
    }
  });
}
