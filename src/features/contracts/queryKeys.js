// src/features/contracts/queryKeys.js
export const contractsKeys = {
  all: ['contracts'],
  lists: () => [...contractsKeys.all, 'list'],
  details: () => [...contractsKeys.all, 'detail'],
  detail: (id) => [...contractsKeys.details(), id],
};
