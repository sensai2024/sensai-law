import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContracts, approveContract, regenerateContract } from '../services/contracts.service';

export const useContracts = () => {
    return useQuery({
        queryKey: ["contracts"],
        queryFn: getContracts,
        refetchInterval: 10000
    });
};

export const useApproveContract = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveContract,
        onSuccess: () => {
            queryClient.invalidateQueries(["contracts"]);
        }
    });
};

export const useRegenerateContract = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: regenerateContract,
        onSuccess: () => {
            queryClient.invalidateQueries(["contracts"]);
        }
    });
};
