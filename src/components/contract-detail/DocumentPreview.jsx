import React, { useState } from 'react';
import { MdRemoveRedEye, MdCode } from 'react-icons/md';

const DocumentPreview = () => {
    const [viewMode, setViewMode] = useState('formatted'); // 'formatted' or 'raw'

    const dummyContent = `
    <h1 class="text-2xl font-bold mb-4">MUTUAL NON-DISCLOSURE AGREEMENT</h1>
    <p class="mb-4">This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of January 25, 2026, by and between:</p>
    <p class="mb-4"><strong>TechFlow Inc.</strong>, a Delaware corporation with its principal place of business at 123 Tech Blvd, San Francisco, CA ("Party A"),</p>
    <p class="mb-4">and</p>
    <p class="mb-4"><strong>Alpha Stream Ltd.</strong>, a UK limited company with its registered office at 456 Innovation Way, London ("Party B").</p>
    <h2 class="text-lg font-bold mb-2">1. Definition of Confidential Information</h2>
    <p class="mb-4">"Confidential Information" means any non-public information disclosed by one party ("Discloser") to the other party ("Recipient") that is designated as confidential or that, given the nature of the information or circumstances of disclosure, should reasonably be understood to be confidential.</p>
    <h2 class="text-lg font-bold mb-2">2. Obligations</h2>
    <p class="mb-4">Recipient agrees to: (a) protect Confidential Information with at least the same degree of care it uses to protect its own confidential information; and (b) not disclose Confidential Information to any third party without Discloser's prior written consent.</p>
    <h2 class="text-lg font-bold mb-2">3. Exclusions</h2>
    <p class="mb-4">The obligations under this Agreement shall not apply to information that is: (a) publicly known; (b) already known to Recipient; (c) independently developed by Recipient; or (d) lawfully obtained from a third party.</p>
  `;

    return (
        <div className="bg-surface rounded-lg border border-white/5 flex flex-col h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="h-12 border-b border-white/5 flex justify-between items-center px-4">
                <span className="text-sm font-medium text-text-secondary">Document Preview</span>
                <div className="flex bg-background rounded-md p-1 border border-white/5">
                    <button
                        onClick={() => setViewMode('formatted')}
                        className={`px-3 py-1 text-xs font-medium rounded-sm flex items-center gap-2 transition-colors ${viewMode === 'formatted' ? 'bg-surfaceHighlight text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        <MdRemoveRedEye /> Formatted
                    </button>
                    {/* <button
                        onClick={() => setViewMode('raw')}
                        className={`px-3 py-1 text-xs font-medium rounded-sm flex items-center gap-2 transition-colors ${viewMode === 'raw' ? 'bg-surfaceHighlight text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        <MdCode /> AI Raw Output
                    </button> */}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 rounded-b-lg font-serif">
                {viewMode === 'formatted' ? (
                    <div dangerouslySetInnerHTML={{ __html: dummyContent }} className="prose max-w-none" />
                ) : (
                    <pre className="font-mono text-sm whitespace-pre-wrap text-slate-700">
                        {dummyContent}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default DocumentPreview;
