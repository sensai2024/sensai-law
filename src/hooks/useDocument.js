import { useQuery } from '@tanstack/react-query';
import { getDocuments } from '../services/documents.service';

export const useDocuments = () => {
    return useQuery({
        queryKey: ['Documents'],
        queryFn: getDocuments,
    });
};
