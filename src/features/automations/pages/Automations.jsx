import React, { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MdAutoGraph, MdDescription, MdPlayArrow, MdCheckCircle, MdError, MdClose } from 'react-icons/md';
import DocumentQueueTable from '../components/DocumentQueueTable';
import AutomationReviewPanel from '../components/AutomationReviewPanel';
import { useWebhookDocuments } from '../hooks/useWebhookDocuments';
import { useStartAutomation } from '../hooks/useStartAutomation';

// --- Shared Components ---
const PageHeader = () => (
    <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight">Automation Command Center</h1>
        <p className="text-text-secondary mt-1 text-sm md:text-base">Trigger new automations and monitor the processing pipeline</p>
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

// Built-in Toast Component
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50';
    const iconColor = type === 'success' ? 'text-green-400' : 'text-red-400';
    const Icon = type === 'success' ? MdCheckCircle : MdError;

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border ${bgColor} shadow-2xl animate-in slide-in-from-right duration-300 backdrop-blur-md`}>
            <Icon className={`text-xl ${iconColor}`} />
            <span className="text-text-primary text-sm font-medium">{message}</span>
            <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors ml-2">
                <MdClose />
            </button>
        </div>
    );
};

// --- Helper Functions ---
const formatDocumentContent = (content) => {
    if (!content) return "";
    return content
        .replace(/^ACCORD-CADRE DE PRESTATION DE SERVICES$/gm, '# ACCORD-CADRE DE PRESTATION DE SERVICES\n')
        .replace(/^ARTICLE\s+\d+\s+-\s+.+$/gm, match => `\n## ${match}\n`)
        .replace(/^(\d+\.\d+\.\s+.+)$/gm, match => `\n### ${match}\n`)
        .replace(/^([A-Za-zÀ-ÿ0-9\s\/'-]+)\s:\s(.+)$/gm, '- **$1** : $2')
        .replace(/\n{2,}/g, '\n\n');
};

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
    const [selectedDocId, setSelectedDocId] = useState(null);
    const [type, setType] = useState('crm'); // 'crm' or 'contract'
    const [toast, setToast] = useState(null);

    // Fetch documents
    const {
        data: contractDocuments = [],
        isLoading: isLoadingContracts,
        error: errorContracts
    } = useWebhookDocuments();

    // Start Automation Mutation
    const { mutate: triggerAutomation, isPending: isStarting } = useStartAutomation();

    const normalizedContracts = useMemo(() => {
        if (!contractDocuments) return [];
        const normalized = Array.isArray(contractDocuments) ? contractDocuments : [contractDocuments];
        console.log("[Automations] Normalized Contracts:", normalized);
        return normalized;
    }, [contractDocuments]);

    const mappedQueueDocs = useMemo(() => {
        console.log("[Automations] Current filtering type:", type);
        if (!normalizedContracts?.length) return [];

        const mapped = normalizedContracts.map(doc => ({
            id: doc.documentId,
            fileName: doc.fileName || `${doc.documentId}.md`,
            source: doc.type === 'crm' ? "CRM Flow" : (doc.type === 'contract' ? "Contract Gen" : "Incoming Webhook"),
            type: doc.type,
            detectedClient: "n8n Automation",
            contractType: doc.type === 'crm' ? "CRM Data" : (doc.type === 'contract' ? "Generated Contract" : "Incoming Document"),
            status: "Ready",
            uploadedTime: doc.receivedAt ? new Date(doc.receivedAt).toLocaleTimeString() : "Just now",
            confidence: 100,
            extractedData: {
                parties: ["Extracted from n8n"],
                keyDates: ["N/A"],
                category: doc.type === 'crm' ? "CRM Update" : (doc.type === 'contract' ? "Legal Document" : "Pending Analysis"),
                aiNotes: "Successfully received via webhook."
            },
            content: doc.content
        })).filter(doc => {
            const docType = (doc.type || '').toLowerCase(); // Empty if unassigned
            const currentFilterType = type.toLowerCase();
            
            // Show if it matches current tab or is unassigned
            const isMatch = (docType === currentFilterType || !docType);
            
            console.log(`[Automations] doc.id=${doc.id} mappedType=${docType} filterType=${currentFilterType} isMatch=${isMatch}`);
            return isMatch;
        });
        
        console.log("[Automations] Final Mapped & Filtered Docs:", mapped);
        return mapped;
    }, [normalizedContracts, type]);

    const selectedDoc = useMemo(() =>
        mappedQueueDocs.find(d => d.id === selectedDocId),
        [mappedQueueDocs, selectedDocId]
    );

    const formattedContent = useMemo(() => {
        if (!selectedDoc?.content) return "";
        return formatDocumentContent(selectedDoc.content);
    }, [selectedDoc]);

    const handleStartAutomation = (doc) => {
        if (!doc) return;

        triggerAutomation({
            documentId: doc.id,
            type: type // Trigger for the currently selected tab type
        }, {
            onSuccess: (data) => {
                setToast({ 
                    message: data.message || `Successfully started ${type.toUpperCase()} automation!`, 
                    type: 'success' 
                });
            },
            onError: (error) => {
                setToast({ 
                    message: error.message || "Failed to start automation. Please check n8n connection.", 
                    type: 'error' 
                });
            }
        });
    };

    const renderMainContent = () => {
        if (isLoadingContracts && normalizedContracts.length === 0) return <LoadingState />;
        if (errorContracts) return <ErrorState message={errorContracts.message} />;

        if (!selectedDocId) {
            return (
                <div className="flex flex-col gap-6">
                    {/* FILTER TABS SECTION */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex bg-surface-secondary border border-white/5 rounded-xl p-1 shadow-inner h-fit">
                            <button
                                onClick={() => setType('crm')}
                                className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${type === 'crm'
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                    }`}
                            >
                                <MdAutoGraph className={`text-lg transition-transform duration-300 ${type === 'crm' ? 'scale-110' : ''}`} />
                                CRM Automation
                            </button>
                            <button
                                onClick={() => setType('contract')}
                                className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${type === 'contract'
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                    }`}
                            >
                                <MdDescription className={`text-lg transition-transform duration-300 ${type === 'contract' ? 'scale-110' : ''}`} />
                                Contract Generator
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary pr-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Live Pipeline Monitoring
                        </div>
                    </div>

                    {/* PIPELINE RESULTS SECTION */}
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest">
                                {type === 'crm' ? 'CRM Flow Queue' : 'Contract Generation Queue'}
                            </h2>
                        </div>
                        <div className="flex-1 min-h-[500px] flex flex-col overflow-hidden rounded-2xl shadow-sm transition-all bg-surface-secondary border border-white/5">
                            <DocumentQueueTable
                                documents={mappedQueueDocs}
                                selectedDocId={selectedDocId}
                                onSelectDocument={setSelectedDocId}
                                onStartAutomation={handleStartAutomation}
                                currentType={type}
                                isPending={isStarting}
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 flex-1 lg:overflow-hidden lg:min-h-0">
                {/* LEFT PANEL - Document Content Preview */}
                <div className="w-full lg:w-[65%] flex flex-col bg-surface-secondary border border-border-color rounded-xl p-4 md:p-6 shadow-md transition-all duration-300 hover:shadow-lg lg:overflow-hidden group">
                    <div className="flex flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5 shrink-0">
                        <h2 className="text-xs md:text-sm font-semibold text-text-secondary uppercase tracking-wider group-hover:text-text-primary transition-colors">
                            {selectedDoc?.contractType} Preview
                        </h2>
                        <button
                            onClick={() => setSelectedDocId(null)}
                            className="flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs md:text-sm font-medium text-text-secondary hover:text-white transition-all active:scale-95"
                            aria-label="Back to Queue"
                        >
                            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Command Center
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 bg-white text-black p-4 md:p-6 lg:p-8 rounded shadow-inner font-serif text-sm md:text-base leading-relaxed">
                        {selectedDoc && (
                            <ReactMarkdown components={markdownComponents}>
                                {formattedContent}
                            </ReactMarkdown>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL - Action Panel */}
                <div className="w-full lg:w-[35%] lg:overflow-y-auto rounded-xl flex flex-col gap-4">
                    <AutomationReviewPanel
                        document={selectedDoc}
                        onStartAutomation={() => handleStartAutomation(selectedDoc)}
                        isPending={isStarting}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6 lg:p-0 overflow-y-auto lg:overflow-hidden relative">
            <PageHeader />
            {renderMainContent()}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Automations;
