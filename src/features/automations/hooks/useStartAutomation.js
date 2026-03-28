import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startAutomation } from "../../../services/automation.service";

/**
 * Mutation hook to trigger an n8n automation flow
 * @returns {Object} Mutation object
 */
export const useStartAutomation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: startAutomation,
        onSuccess: (data) => {
            console.log("Automation triggered successfully:", data);
            // Invalidate the webhook documents query to see potential new results soon
            queryClient.invalidateQueries({ queryKey: ["webhook-documents"] });
        },
        onError: (error) => {
            console.error("Mutation error [Automation]:", error);
        }
    });
};
