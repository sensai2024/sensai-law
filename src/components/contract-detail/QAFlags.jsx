import React from 'react';
import { MdWarning, MdInfo } from 'react-icons/md';

const FlagItem = ({ severity, description, resolution }) => {
    const isHigh = severity === 'High';
    return (
        <div className={`p-3 rounded-md border mb-3 ${isHigh ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            <div className="flex gap-2 items-start mb-1">
                <div className={`mt-0.5 ${isHigh ? 'text-red-500' : 'text-amber-500'}`}>
                    {isHigh ? <MdWarning /> : <MdInfo />}
                </div>
                <div>
                    <span className={`text-xs font-bold uppercase tracking-wide ${isHigh ? 'text-red-500' : 'text-amber-500'}`}>
                        {severity} Severity
                    </span>
                    <p className="text-sm text-text-primary mt-1 leading-snug">{description}</p>
                </div>
            </div>
            {resolution && (
                <div className="ml-6 mt-2 pt-2 border-t border-white/5">
                    <span className="text-xs text-text-secondary block mb-0.5">Suggested Resolution:</span>
                    <p className="text-xs text-text-primary">{resolution}</p>
                </div>
            )}
        </div>
    );
};

const QAFlags = () => {
    return (
        <div className="bg-surface p-5 rounded-lg border border-white/5 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-text-primary">AI Compliance Flags</h2>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-1">
                <FlagItem
                    severity="High"
                    description="Indemnity clause cap is missing, violating standard risk policy."
                    resolution="Insert standard cap of 2x contract value."
                />
                <FlagItem
                    severity="Medium"
                    description="Governing law is set to 'New York', but client address is in 'California'."
                    resolution="Confirm if NY law is intentional choice."
                />
            </div>
        </div>
    );
};

export default QAFlags;
