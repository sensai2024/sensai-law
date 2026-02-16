import React from 'react';
import { MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';

const WORKFLOW_STEPS = [
    { id: 1, label: 'Data Extraction' },
    { id: 2, label: 'Customer Verification' },
    { id: 3, label: 'Planning + RAG' },
    { id: 4, label: 'Draft Generation' },
    { id: 5, label: 'QA Review' }
];

const WorkflowPreviewSteps = ({ currentStatus }) => {
    // Determine which steps are completed based on status
    const getStepState = (stepId) => {
        if (currentStatus === 'Completed' || currentStatus === 'Sent to Draft') {
            return 'completed';
        }
        if (currentStatus === 'Processing') {
            // Show first 2-3 steps as active during processing
            return stepId <= 3 ? 'completed' : 'pending';
        }
        return 'pending';
    };

    return (
        <div className="space-y-4 relative">
            {/* Vertical line */}
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-white/10" />

            {WORKFLOW_STEPS.map((step) => {
                const state = getStepState(step.id);
                const isCompleted = state === 'completed';

                return (
                    <div key={step.id} className="relative flex items-center gap-3">
                        <div className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full ${isCompleted
                                ? 'bg-primary text-white'
                                : 'bg-surfaceHighlight border-2 border-white/20'
                            }`}>
                            {isCompleted ? (
                                <MdCheckCircle className="text-sm" />
                            ) : (
                                <MdRadioButtonUnchecked className="text-sm text-text-secondary" />
                            )}
                        </div>
                        <div className={`text-sm ${isCompleted ? 'text-white font-medium' : 'text-text-secondary'
                            }`}>
                            {step.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default WorkflowPreviewSteps;
