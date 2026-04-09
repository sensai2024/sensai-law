// src/components/layout/hooks.js
import { useQuery } from '@tanstack/react-query';
import { getSidebarCounts } from './services';

export function useSidebarCountsQuery() {
  return useQuery({
    queryKey: ['sidebarCounts'],
    queryFn: getSidebarCounts,
    refetchInterval: 30000 // refetch every 30s as a fallback, also will be invalidated via mutations
  });
}
