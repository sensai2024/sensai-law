// src/features/transcriptions/hooks.js
import { useQuery } from '@tanstack/react-query';
import { transcriptionsKeys } from './queryKeys';
import { getTranscriptions } from './services';
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
