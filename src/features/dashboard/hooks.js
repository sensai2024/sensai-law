// src/features/dashboard/hooks.js
import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from './queryKeys';
import { getDashboardData } from './services';
import { mapDashboardData } from './mappers';

export function useDashboardQuery() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const data = await getDashboardData();
      return mapDashboardData(data);
    }
  });
}
