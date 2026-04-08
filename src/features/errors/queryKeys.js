// src/features/errors/queryKeys.js
export const errorsKeys = {
  all: ['errors'],
  lists: () => [...errorsKeys.all, 'list'],
};
