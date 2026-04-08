// src/features/clients/hooks.js
import { useQuery } from '@tanstack/react-query';
import { clientsKeys } from './queryKeys';
import { getClientsData, getClientDetails } from './services';
import { mapClientsList, mapClientDetails } from './mappers';

export function useClientsListQuery() {
  return useQuery({
    queryKey: clientsKeys.lists(),
    queryFn: async () => {
      const data = await getClientsData();
      return mapClientsList(data);
    },
  });
}

export function useClientDetailsQuery(email) {
  return useQuery({
    queryKey: clientsKeys.detail(email),
    queryFn: async () => {
      const data = await getClientDetails(email);
      return mapClientDetails(data, email);
    },
    enabled: !!email,
  });
}
