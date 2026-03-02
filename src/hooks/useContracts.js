import { useQuery } from '@tanstack/react-query';
import { getContracts } from '../services/contracts.service';

export const useContracts = () => {
    return useQuery({
        queryKey: ['contracts'],
        queryFn: getContracts,
    });
};
