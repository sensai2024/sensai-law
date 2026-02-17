import React from 'react';
import { MdInsertDriveFile, MdPlayArrow } from 'react-icons/md';
import WorkflowPreviewSteps from './WorkflowPreviewSteps';

const AutomationReviewPanel = ({ document, onStartAutomation, isPending = false }) => {
    if (!document) {
        return (
            <div className="bg-surface rounded-lg border border-white/5 h-full flex flex-col items-center justify-center text-text-secondary">
                <MdInsertDriveFile className="text-6xl mb-4 opacity-50" />
                <p>Select a document to review</p>
            </div>
        );
    }

    const isProcessing = document.status === 'Processing';
    const isCompleted = document.status === 'Sent to Draft' || document.status === 'Completed';

    return (
        <div className="bg-surface rounded-lg border border-white/5 h-full flex flex-col">
            {/* Document Overview */}
            <div className="p-5 border-b border-white/5">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                    Document Overview
                </h2>

                <div className="space-y-3">
                    <div>
                        <div className="text-xs text-text-secondary mb-1">File Name</div>
                        <div className="text-sm text-white font-medium">{document.fileName}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-xs text-text-secondary mb-1">Client</div>
                            <div className="text-sm text-white font-medium">{document.detectedClient}</div>
                        </div>
                        <div>
                            <div className="text-xs text-text-secondary mb-1">Type</div>
                            <div className="text-sm text-white font-medium">{document.contractType}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-xs text-text-secondary mb-1">Confidence</div>
                            <div className={`text-sm font-bold ${document.confidence > 90 ? 'text-green-400' : 'text-yellow-400'
                                }`}>
                                {document.confidence}%
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-text-secondary mb-1">Source</div>
                            <div className="text-sm text-white font-medium">{document.source}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Extracted Data Preview */}
            <div className="p-5 border-b border-white/5">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                    Extracted Data Preview
                </h2>

                <div className="space-y-3 text-sm">
                    <div>
                        <div className="text-xs text-text-secondary mb-1">Parties</div>
                        <div className="text-white">
                            {document.extractedData.parties.join(', ')}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-text-secondary mb-1">Key Dates</div>
                        <div className="text-white">
                            {document.extractedData.keyDates.join(', ')}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-text-secondary mb-1">Category</div>
                        <div className="text-white">{document.extractedData.category}</div>
                    </div>

                    {document.extractedData.aiNotes && (
                        <div>
                            <div className="text-xs text-text-secondary mb-1">AI Notes</div>
                            <div className="text-white bg-surfaceHighlight p-2 rounded text-xs">
                                {document.extractedData.aiNotes}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Workflow Preview */}
            <div className="p-5 flex-1 overflow-y-auto">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                    Workflow Preview
                </h2>
                <WorkflowPreviewSteps currentStatus={document.status} />
            </div>

            {/* Action Area */}
            <div className="p-5 border-t border-white/5 bg-surfaceHighlight">
                <button
                    onClick={onStartAutomation}
                    disabled={isPending || isProcessing || isCompleted}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all ${isPending || isProcessing
                        ? 'bg-surfaceHighlight text-text-secondary cursor-not-allowed border border-white/5'
                        : isCompleted
                            ? 'bg-green-900/30 text-green-400 border border-green-900/50 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary/90 text-white shadow-lg'
                        }`}
                >
                    {isPending || isProcessing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                            {isPending ? 'Starting...' : 'Processing...'}
                        </>
                    ) : isCompleted ? (
                        <>
                            Sent to Draft
                        </>
                    ) : (
                        <>
                            <MdPlayArrow className="text-xl" />
                            Start Automation
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AutomationReviewPanel;
