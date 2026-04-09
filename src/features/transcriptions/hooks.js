// src/features/transcriptions/hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transcriptionsKeys } from './queryKeys';
import { getTranscriptions, getTranscriptionById, approveTranscription } from './services';
import { mapTranscriptionsData } from './mappers';

export function useTranscriptionsQuery() {
  return useQuery({
    queryKey: transcriptionsKeys.lists(),
    queryFn: async () => {
      const data = await getTranscriptions();
      return mapTranscriptionsData(data);
    }
  });
}

export function useTranscriptionDetailsQuery(id) {
  return useQuery({
    queryKey: transcriptionsKeys.detail(id),
    queryFn: () => getTranscriptionById(id),
    enabled: !!id,
  });
}

export function useApproveTranscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transcription) => approveTranscription(transcription),
    onSuccess: () => {
      // Invalidate both list and specific detail to reflect status changes if any
      queryClient.invalidateQueries({ queryKey: transcriptionsKeys.all });
    },
  });
}

