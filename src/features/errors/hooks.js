// src/features/errors/hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { errorsKeys } from './queryKeys';
import { getPipelineErrors, updatePipelineRunStatus } from './services';
import { mapErrorsData } from './mappers';

export function useErrorsQuery() {
  return useQuery({
    queryKey: errorsKeys.lists(),
    queryFn: async () => {
      const data = await getPipelineErrors();
      return mapErrorsData(data);
    }
  });
}

export function useRetryErrorMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => updatePipelineRunStatus(id, 'retrying'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: errorsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['sidebarCounts'] });
    }
  });
}
