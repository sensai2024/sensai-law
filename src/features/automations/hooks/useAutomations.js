import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as automationService from '../services/automation.service';

/**
 * Query key factory for automations
 */
const automationKeys = {
    all: ['automations'],
    documents: () => [...automationKeys.all, 'documents'],
    document: (id) => [...automationKeys.all, 'document', id],
};

/**
 * Hook to fetch all documents from the automation queue
 * @returns {Object} Query result with data, isLoading, error, refetch
 */
export const useDocuments = () => {
    return useQuery({
        queryKey: automationKeys.documents(),
        queryFn: automationService.getDocuments,
        staleTime: 30000, // Consider data fresh for 30 seconds
        refetchOnWindowFocus: true, // Refetch when user returns to tab
    });
};

/**
 * Hook to fetch a single document by ID
 * @param {string} id - Document ID
 * @returns {Object} Query result with data, isLoading, error
 */
export const useDocument = (id) => {
    return useQuery({
        queryKey: automationKeys.document(id),
        queryFn: () => automationService.getDocumentById(id),
        enabled: !!id, // Only run query if ID is provided
        staleTime: 30000,
    });
};

/**
 * Hook to start automation for a document
 * @returns {Object} Mutation object with mutate, isPending, error
 */
export const useStartAutomation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: automationService.startAutomation,
        onMutate: async (documentId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: automationKeys.documents() });

            // Snapshot the previous value
            const previousDocuments = queryClient.getQueryData(automationKeys.documents());

            // Optimistically update to the new value
            queryClient.setQueryData(automationKeys.documents(), (old) => {
                if (!old) return old;
                return old.map(doc =>
                    doc.id === documentId
                        ? { ...doc, status: 'Processing' }
                        : doc
                );
            });

            // Return context with the snapshot
            return { previousDocuments };
        },
        onError: (err, documentId, context) => {
            // Rollback on error
            if (context?.previousDocuments) {
                queryClient.setQueryData(
                    automationKeys.documents(),
                    context.previousDocuments
                );
            }
        },
        onSuccess: (data, documentId) => {
            // Simulate completion after 2 seconds
            setTimeout(() => {
                queryClient.setQueryData(automationKeys.documents(), (old) => {
                    if (!old) return old;
                    return old.map(doc =>
                        doc.id === documentId
                            ? { ...doc, status: 'Sent to Draft' }
                            : doc
                    );
                });
            }, 2000);
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: automationKeys.documents() });
        },
    });
};
