// src/features/transcriptions/queryKeys.js
export const transcriptionsKeys = {
  all: ['transcriptions'],
  lists: () => [...transcriptionsKeys.all, 'list'],
};
