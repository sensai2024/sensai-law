import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "../../../services/webhook.service";

/**
 * Hook to fetch documents received via webhook with real-time polling
 * @returns {Object} Query result object
 */
export const useWebhookDocuments = () => {
    return useQuery({
        queryKey: ["webhook-documents"],
        queryFn: getDocuments,
        refetchInterval: 5000, // Poll every 5 seconds for "real-time" updates
        refetchOnWindowFocus: true,
        staleTime: 2000,
    });
};
