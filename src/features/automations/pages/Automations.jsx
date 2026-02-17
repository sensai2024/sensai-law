import React, { useState } from 'react';
import DocumentQueueTable from '../components/DocumentQueueTable';
import AutomationReviewPanel from '../components/AutomationReviewPanel';
import { useDocuments, useStartAutomation } from '../hooks/useAutomations';

const Automations = () => {
    const [selectedDocId, setSelectedDocId] = useState(null);

    // Fetch documents using React Query
    const { data: documents = [], isLoading, error } = useDocuments();

    // Mutation for starting automation
    const { mutate: startAutomation, isPending } = useStartAutomation();

    // Find selected document
    const selectedDoc = documents.find(d => d.id === selectedDocId);

    // Handle automation start
    const handleStartAutomation = () => {
        if (!selectedDocId) return;
        startAutomation(selectedDocId);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="h-full flex flex-col">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-text-primary">Automation Pipeline</h1>
                    <p className="text-text-secondary">Review and trigger automated contract generation</p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                        <p className="text-text-secondary">Loading documents...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="h-full flex flex-col">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-text-primary">Automation Pipeline</h1>
                    <p className="text-text-secondary">Review and trigger automated contract generation</p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-400 text-5xl mb-4">⚠️</div>
                        <p className="text-text-primary font-medium mb-2">Error loading documents</p>
                        <p className="text-text-secondary text-sm">{error.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-text-primary">Automation Pipeline</h1>
                <p className="text-text-secondary">Review and trigger automated contract generation</p>
            </div>

            <div className="flex gap-6 flex-1 overflow-hidden">
                {/* LEFT PANEL - 65% */}
                <div className="w-[65%]">
                    <DocumentQueueTable
                        documents={documents}
                        selectedDocId={selectedDocId}
                        onSelectDocument={setSelectedDocId}
                    />
                </div>

                {/* RIGHT PANEL - 35% */}
                <div className="w-[35%]">
                    <AutomationReviewPanel
                        document={selectedDoc}
                        onStartAutomation={handleStartAutomation}
                        isPending={isPending}
                    />
                </div>
            </div>
        </div>
    );
};

export default Automations;
