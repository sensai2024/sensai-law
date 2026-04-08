// src/features/dashboard/queryKeys.js
export const dashboardKeys = {
  all: ['dashboard'],
  stats: () => [...dashboardKeys.all, 'stats'],
};
