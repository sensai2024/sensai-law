import React, { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

/**
 * WebhookTester Component
 * 
 * A temporary test screen for triggering n8n webhooks.
 * This component is self-contained and uses Axios + React Query.
 */
const WebhookTester = () => {
    const [documentId, setDocumentId] = useState('');


    // Mutation for sending specific n8n webhook request
    const mutation = useMutation({
        mutationFn: async (id) => {
            const payload = { documentId: id };

            const response = await axios.get(
                '',
                payload
            );
            console.log(response);

            return response.data;
        },

        onSuccess: (data) => {
            console.log("🔥 SUCCESS DATA:", data);
        },

        onError: (error) => {
            console.log("❌ ERROR:", error.response?.data || error.message);
        }

    });



    const handleTest = () => {
        if (!documentId) return;
        mutation.mutate(documentId);
    };

    return (
        <div className="bg-surface p-8 rounded-xl border border-border shadow-2xl mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-text-primary tracking-tight">Webhook Tester</h2>
                    <p className="text-text-secondary text-sm">Temporary panel for n8n endpoint testing</p>
                </div>
                <div className="px-3 py-1 bg-primary/10 rounded-full">
                    <span className="text-primary text-xs font-semibold uppercase tracking-wider">Debug Mode</span>
                </div>
            </div>

            <div className="space-y-6">
                {/* Input Section */}
                <div className="space-y-2">
                    <label htmlFor="docId" className="block text-sm font-medium text-text-secondary">
                        Document ID
                    </label>
                    <div className="relative">
                        <input
                            id="docId"
                            type="text"
                            value={documentId}
                            onChange={(e) => setDocumentId(e.target.value)}
                            className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="e.g. DOC-123456"
                        />
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleTest}
                    disabled={mutation.isPending || !documentId}
                    className="w-full bg-primary hover:bg-primaryHover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {mutation.isPending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Testing Webhook...</span>
                        </>
                    ) : (
                        'Test Webhook'
                    )}
                </button>

                {/* Response Visualization */}
                {mutation.isSuccess && (
                    <div className="animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-status-success"></div>
                            <h3 className="text-sm font-semibold text-status-success">Success Response</h3>
                        </div>
                        <div className="relative group">
                            <pre className="bg-background p-5 rounded-lg overflow-auto text-xs font-mono text-text-secondary border border-border max-h-[300px] scrollbar-thin scrollbar-thumb-surfaceHighlight scrollbar-track-transparent">
                                {JSON.stringify(mutation.data, null, 2)}
                            </pre>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] bg-surfaceHighlight px-2 py-1 rounded text-text-muted">JSON</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Visualization */}
                {mutation.isError && (
                    <div className="animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-status-error"></div>
                            <h3 className="text-sm font-semibold text-status-error">Request Failed</h3>
                        </div>
                        <div className="bg-status-error/10 border border-status-error/20 p-4 rounded-lg">
                            <p className="text-sm text-status-error font-medium">
                                {mutation.error.response?.data?.message || mutation.error.message}
                            </p>
                            {mutation.error.response && (
                                <div className="mt-2 pt-2 border-t border-status-error/10">
                                    <span className="text-[10px] text-status-error/70 font-mono">Status: {mutation.error.response.status}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebhookTester;
