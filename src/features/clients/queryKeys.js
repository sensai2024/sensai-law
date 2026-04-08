// src/features/clients/queryKeys.js
export const clientsKeys = {
  all: ['clients'],
  lists: () => [...clientsKeys.all, 'list'],
  list: (filters) => [...clientsKeys.lists(), { filters }],
  details: () => [...clientsKeys.all, 'detail'],
  detail: (email) => [...clientsKeys.details(), email],
};
