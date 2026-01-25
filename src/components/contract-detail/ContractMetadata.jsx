import React from 'react';
import StatusPill from '../common/StatusPill';

const ContractMetadata = () => {
    return (
        <div className="bg-surface p-5 rounded-lg border border-white/5 mb-6">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-text-primary">Overview</h2>
                <StatusPill status="Review" />
            </div>

            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Client</span>
                    <span className="text-sm font-medium text-text-primary">TechFlow Inc.</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Contract Type</span>
                    <span className="text-sm font-medium text-text-primary">MSA (Master Services Agreement)</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Source</span>
                    <span className="text-sm font-medium text-text-primary">HubSpot CRM Deal #1029</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Template</span>
                    <span className="text-sm font-medium text-text-primary">Standard MSA v4.2</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Created</span>
                    <span className="text-sm font-medium text-text-primary">Jan 25, 2026</span>
                </div>
            </div>
        </div>
    );
};

export default ContractMetadata;
