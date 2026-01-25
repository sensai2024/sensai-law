import React from 'react';
import { MdSend, MdRefresh, MdAssignmentInd, MdComment } from 'react-icons/md';

const ContractActions = () => {
    return (
        <div className="bg-surface p-5 rounded-lg border border-white/5 sticky bottom-0">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Response Actions</h2>

            <div className="grid gap-3">
                <button className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-4 rounded-md transition-colors shadow-lg shadow-emerald-900/20">
                    <MdSend className="text-lg" />
                    Approve & Send to Client
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 w-full bg-surfaceHighlight hover:bg-white/10 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm border border-white/5">
                        <MdRefresh /> Regenerate
                    </button>
                    <button className="flex items-center justify-center gap-2 w-full bg-surfaceHighlight hover:bg-white/10 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm border border-white/5">
                        <MdAssignmentInd /> Assign
                    </button>
                </div>

                <button className="flex items-center justify-center gap-2 w-full text-text-secondary hover:text-white py-2 transition-colors text-sm">
                    <MdComment /> Add Internal Comment
                </button>
            </div>
        </div>
    );
};

export default ContractActions;
