import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { useContracts } from '../../../hooks/useContracts';
import DocumentQueueTable from '../components/DocumentQueueTable';
import AutomationReviewPanel from '../components/AutomationReviewPanel';
import { useStartAutomation } from '../hooks/useAutomations';

const Automations = () => {
    const [selectedDocId, setSelectedDocId] = useState(null);

    // Fetch documents using React Query from the webhook
    const { data: contractDocuments = [], isLoading: isLoadingContracts, error: errorContracts } = useContracts();

    const normalizedContracts = useMemo(() => {
        if (!contractDocuments) return [];

        return Array.isArray(contractDocuments)
            ? contractDocuments
            : [contractDocuments];
    }, [contractDocuments]);

    // Map the API contract documents into the format expected by DocumentQueueTable
    const mappedQueueDocs = useMemo(() => {
        if (!normalizedContracts.length) return [];

        return normalizedContracts.flatMap(doc => {
            const splitDocs = doc.content
                .split(/\n{2,}(?=ACCORD-CADRE DE PRESTATION DE SERVICES)/g)
                .filter(Boolean);

            return splitDocs.map((content, index) => ({
                id: `${doc.documentId}-${index}`,
                fileName: `${doc.documentId}-${index}.md`,
                detectedClient: 'Unknown Content',
                contractType: 'Document',
                status: 'Pending',
                uploadedTime: 'Just now',
                confidence: 95,
                extractedData: {
                    parties: ['System', 'Client'],
                    keyDates: ['N/A'],
                    category: 'General',
                    aiNotes: 'Webhook Data Sync Successful.'
                },
                content
            }));
        });
    }, [normalizedContracts]);




    // Mutation for starting automation
    const { mutate: startAutomation, isPending } = useStartAutomation();

    // Find selected document in mapped queue documents so it has all necessary data
    const selectedDoc = mappedQueueDocs.find(d => d.id === selectedDocId);

    const formattedContent = selectedDoc?.content ? selectedDoc.content
        // إضافة فاصلة قبل العنوان الرئيسي
        .replace(/^(ACCORD-CADRE DE PRESTATION DE SERVICES.*)$/gm, '\n\n$1\n\n')
        // فصل أي سطرين أو أكثر لفواصل بين الفقرات
        .replace(/\n{2,}/g, '\n\n')
        // كل سطر جديد في paragraph → line break
        .replace(/([^\n])\n([^\n])/g, '$1  \n$2') : "";
    // Handle automation start
    const handleStartAutomation = () => {
        if (!selectedDocId) return;
        startAutomation(selectedDocId);
    };

    if (isLoadingContracts) {
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

    if (errorContracts) {
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
                        <p className="text-text-secondary text-sm">{errorContracts.message}</p>
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

            {!selectedDocId ? (
                <div className="flex-1 min-h-[500px] overflow-hidden">
                    <DocumentQueueTable
                        documents={mappedQueueDocs}
                        selectedDocId={selectedDocId}
                        onSelectDocument={setSelectedDocId}
                    />
                </div>
            ) : (
                <div className="flex gap-6 flex-1 overflow-hidden">
                    {/* LEFT PANEL - 65% (Document Content Preview) */}
                    <div className="w-[65%] flex flex-col bg-surface-secondary border border-border-color rounded-xl p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5 shrink-0">
                            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                                Document Content Preview
                            </h2>
                            <button
                                onClick={() => setSelectedDocId(null)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-text-secondary hover:text-white transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Queue
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 markdown-preview bg-white text-black p-6 rounded shadow font-serif text-base leading-relaxed">
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-4" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-xl font-semibold my-3" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                                    li: ({ node, ...props }) => <li className="ml-5 list-disc" {...props} />,
                                    table: ({ node, ...props }) => <table className="border-collapse border border-gray-300 mb-4" {...props} />,
                                    th: ({ node, ...props }) => <th className="border border-gray-300 px-2 py-1 bg-gray-100" {...props} />,
                                    td: ({ node, ...props }) => <td className="border border-gray-300 px-2 py-1" {...props} />,
                                }}
                            >
                                {formattedContent}
                            </ReactMarkdown>
                        </div>

                    </div>

                    {/* RIGHT PANEL - 35% */}
                    <div className="w-[35%] overflow-y-auto">
                        <AutomationReviewPanel
                            document={selectedDoc}
                            onStartAutomation={handleStartAutomation}
                            isPending={isPending}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Automations;
