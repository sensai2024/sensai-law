import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { useContracts } from '../../../hooks/useContracts';
import DocumentQueueTable from '../components/DocumentQueueTable';
import AutomationReviewPanel from '../components/AutomationReviewPanel';
import { useStartAutomation } from '../hooks/useAutomations';

// --- Shared Components ---
// Extracted to avoid repeating the header in every UI state (Loading/Error/Success)
const PageHeader = () => (
    <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight">Automation Pipeline</h1>
        <p className="text-text-secondary mt-1 text-sm md:text-base">Review and trigger automated contract generation</p>
    </div>
);

const LoadingState = () => (
    <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-text-secondary font-medium animate-pulse">Loading documents...</p>
        </div>
    </div>
);

const ErrorState = ({ message }) => (
    <div className="flex-1 flex items-center justify-center min-h-[300px] p-4">
        <div className="text-center bg-red-500/10 p-6 md:p-8 rounded-2xl border border-red-500/20 max-w-md w-full shadow-lg">
            <div className="text-red-400 text-4xl md:text-5xl mb-4">⚠️</div>
            <p className="text-text-primary font-semibold mb-2 text-lg">Error loading documents</p>
            <p className="text-text-secondary text-sm md:text-base break-words">{message}</p>
        </div>
    </div>
);

// --- Helper Functions ---
// Moved outside the component to prevent recreation on every render.
const formatDocumentContent = (content) => {
    if (!content) return "";
    return content
        // العنوان الرئيسي → H1
        .replace(/^ACCORD-CADRE DE PRESTATION DE SERVICES$/gm, '# ACCORD-CADRE DE PRESTATION DE SERVICES\n')
        // ARTICLE X → H2
        .replace(/^ARTICLE\s+\d+\s+-\s+.+$/gm, match => `\n## ${match}\n`)
        // 5.1 / 6.2 / 12.1 → H3
        .replace(/^(\d+\.\d+\.\s+.+)$/gm, match => `\n### ${match}\n`)
        // التعريفات (Word : description) → bullet list
        .replace(/^([A-Za-zÀ-ÿ0-9\s\/'-]+)\s:\s(.+)$/gm, '- **$1** : $2')
        // تثبيت الفواصل
        .replace(/\n{2,}/g, '\n\n');
};

// Extracted static components object for ReactMarkdown
// Anti-pattern fix: passing inline objects to components={} prop triggers heavy re-renders
const markdownComponents = {
    h1: ({ node, ...props }) => <h1 className="text-2xl md:text-3xl font-bold my-4 text-black" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-xl md:text-2xl font-semibold my-3 text-gray-800" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-lg md:text-xl font-medium my-2 text-gray-700" {...props} />,
    p: ({ node, ...props }) => <p className="mb-3 text-gray-700 leading-relaxed" {...props} />,
    li: ({ node, ...props }) => <li className="ml-5 list-disc mb-1 text-gray-700" {...props} />,
    ul: ({ node, ...props }) => <ul className="mb-3" {...props} />,
    table: ({ node, ...props }) => <div className="overflow-x-auto mb-4"><table className="w-full border-collapse border border-gray-300 text-sm" {...props} /></div>,
    th: ({ node, ...props }) => <th className="border border-gray-300 px-3 py-2 bg-gray-100 font-semibold text-left text-black" {...props} />,
    td: ({ node, ...props }) => <td className="border border-gray-300 px-3 py-2 text-gray-800" {...props} />,
};

const Automations = () => {
    const [documentStatuses, setDocumentStatuses] = useState({});

    const [selectedDocId, setSelectedDocId] = useState(null);

    // Fetch documents using React Query from the webhook
    const { data: contractDocuments = [], isLoading: isLoadingContracts, error: errorContracts } = useContracts();

    // Ensure contracts are always an array
    const normalizedContracts = useMemo(() => {
        if (!contractDocuments) return [];
        return Array.isArray(contractDocuments) ? contractDocuments : [contractDocuments];
    }, [contractDocuments]);

    // Map the API contract documents into the format expected by DocumentQueueTable
    const mappedQueueDocs = useMemo(() => {
        if (!normalizedContracts.length) return [];

        return normalizedContracts.flatMap(doc => {
            const splitDocs = doc.content
                .split(/\n{2,}(?=ACCORD-CADRE DE PRESTATION DE SERVICES)/g)
                .filter(Boolean);

            return splitDocs.map((content, index) => {
                const docId = `${doc.documentId}-${index}`;
                return {
                    id: docId,
                    fileName: `${doc.documentId}-${index}.md`,
                    detectedClient: 'Unknown Content',
                    contractType: 'Document',
                    status: documentStatuses[docId] || 'Pending',
                    uploadedTime: 'Just now',
                    confidence: 95,
                    extractedData: {
                        parties: ['System', 'Client'],
                        keyDates: ['N/A'],
                        category: 'General',
                        aiNotes: 'Webhook Data Sync Successful.'
                    },
                    content
                };
            });
        });
    }, [normalizedContracts, documentStatuses]);

    // Mutation for starting automation
    const { mutate: startAutomation, isPending } = useStartAutomation();

    // Find selected document using useMemo to avoid searching loop on every render
    const selectedDoc = useMemo(() =>
        mappedQueueDocs.find(d => d.id === selectedDocId),
        [mappedQueueDocs, selectedDocId]
    );

    // Format content only when selected document changes
    const formattedContent = useMemo(() =>
        formatDocumentContent(selectedDoc?.content),
        [selectedDoc?.content]
    );

    const handleStartAutomation = () => {
        if (!selectedDocId) return;

        // Optimistically set status to 'Processing'
        setDocumentStatuses(prev => ({ ...prev, [selectedDocId]: 'Processing' }));

        startAutomation(selectedDocId, {
            onSuccess: () => {
                // Simulate backend work completion after 2.5 seconds
                setTimeout(() => {
                    setDocumentStatuses(prev => ({ ...prev, [selectedDocId]: 'Sent to Draft' }));
                }, 2500);
            },
            onError: () => {
                // Revert status on failure
                setDocumentStatuses(prev => ({ ...prev, [selectedDocId]: 'Pending' }));
            }
        });
    };

    const renderMainContent = () => {
        if (isLoadingContracts) return <LoadingState />;
        if (errorContracts) return <ErrorState message={errorContracts.message} />;

        if (!selectedDocId) {
            return (
                <div className="flex-1 min-h-[500px] flex flex-col overflow-hidden rounded-xl shadow-sm transition-all bg-surface-secondary">
                    <DocumentQueueTable
                        documents={mappedQueueDocs}
                        selectedDocId={selectedDocId}
                        onSelectDocument={setSelectedDocId}
                    />
                </div>
            );
        }

        return (
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 flex-1 lg:overflow-hidden lg:min-h-0">
                {/* LEFT PANEL - Document Content Preview */}
                <div className="w-full lg:w-[65%] flex flex-col bg-surface-secondary border border-border-color rounded-xl p-4 md:p-6 shadow-md transition-all duration-300 hover:shadow-lg lg:overflow-hidden group">
                    <div className="flex flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5 shrink-0">
                        <h2 className="text-xs md:text-sm font-semibold text-text-secondary uppercase tracking-wider group-hover:text-text-primary transition-colors">
                            Document Content Preview
                        </h2>
                        <button
                            onClick={() => setSelectedDocId(null)}
                            className="flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs md:text-sm font-medium text-text-secondary hover:text-white transition-all active:scale-95"
                            aria-label="Back to Queue"
                        >
                            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Queue
                        </button>
                    </div>

                    {/* Markdown Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 bg-white text-black p-4 md:p-6 lg:p-8 rounded shadow-inner font-serif text-sm md:text-base leading-relaxed">
                        <ReactMarkdown components={markdownComponents}>
                            {formattedContent || "No content available."}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* RIGHT PANEL - Action Panel */}
                <div className="w-full lg:w-[35%] lg:overflow-y-auto rounded-xl flex flex-col gap-4">
                    <AutomationReviewPanel
                        document={selectedDoc}
                        onStartAutomation={handleStartAutomation}
                        isPending={isPending}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6 lg:p-0 overflow-y-auto lg:overflow-hidden">
            <PageHeader />
            {renderMainContent()}
        </div>
    );
};

export default Automations;
