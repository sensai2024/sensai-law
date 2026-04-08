// src/features/contracts/hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsKeys } from './queryKeys';
import { getContracts, updateContractStatus } from './services';
import { mapContractsData } from './mappers';

export function useContractsQuery() {
  return useQuery({
    queryKey: contractsKeys.lists(),
    queryFn: async () => {
      const data = await getContracts();
      return mapContractsData(data);
    }
  });
}

export function useRetryContractMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => updateContractStatus(id, 'generated'), // Fake retry by updating to generated 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractsKeys.lists() });
    }
  });
}
