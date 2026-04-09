// src/features/transcriptions/queryKeys.js
export const transcriptionsKeys = {
  all: ['transcriptions'],
  lists: () => [...transcriptionsKeys.all, 'list'],
  details: () => [...transcriptionsKeys.all, 'detail'],
  detail: (id) => [...transcriptionsKeys.details(), id],
};

