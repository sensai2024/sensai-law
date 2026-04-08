// src/features/contracts/queryKeys.js
export const contractsKeys = {
  all: ['contracts'],
  lists: () => [...contractsKeys.all, 'list'],
};
