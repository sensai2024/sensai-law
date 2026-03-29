import React, { useState } from 'react';
import { MdSearch, MdInsertDriveFile, MdPlayArrow } from 'react-icons/md';
import StatusPill from '../../../components/common/StatusPill';

const DocumentQueueTable = ({ documents, selectedDocId, onSelectDocument, onStartAutomation, currentType, isPending }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDocs = documents.filter(doc =>
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.detectedClient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-surface rounded-lg border border-white/5 flex flex-col h-full">
            {/* Search Bar */}
            <div className="p-4 border-b border-white/5">
                <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surfaceHighlight border border-white/5 rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-primary/50"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-sm min-w-[700px]">
                    <thead className="bg-surfaceHighlight sticky top-0 z-10">
                        <tr className="text-text-secondary text-xs uppercase">
                            <th className="px-4 py-3 text-left font-semibold">File Name</th>
                            <th className="px-4 py-3 text-left font-semibold">Source</th>
                            <th className="px-4 py-3 text-left font-semibold">Client</th>
                            <th className="px-4 py-3 text-center font-semibold">Action / Type</th>
                            <th className="px-4 py-3 text-left font-semibold">Status</th>
                            <th className="px-4 py-3 text-left font-semibold">Uploaded</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredDocs.map(doc => (
                            <tr
                                key={doc.id}
                                onClick={() => onSelectDocument(doc.id)}
                                className={`cursor-pointer transition-colors hover:bg-white/5 ${selectedDocId === doc.id ? 'bg-primary/10' : ''
                                    }`}
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <MdInsertDriveFile className="text-text-secondary" />
                                        <span className="text-white font-medium">{doc.fileName}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-text-secondary">{doc.source}</td>
                                <td className="px-4 py-3 text-white">{doc.detectedClient}</td>
                                <td className="px-4 py-3 text-center">
                                    {!doc.type ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onStartAutomation(doc);
                                            }}
                                            disabled={isPending}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                                isPending 
                                                ? 'bg-white/5 text-text-secondary cursor-not-allowed'
                                                : currentType === 'crm'
                                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20'
                                                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20'
                                            }`}
                                        >
                                            {isPending ? (
                                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <MdPlayArrow className="text-sm" />
                                            )}
                                            {isPending ? 'Starting...' : `Start ${currentType}`}
                                        </button>
                                    ) : (
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                            doc.type === 'crm' 
                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                            : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                        }`}>
                                            {doc.type === 'crm' ? "CRM Data" : "Generated Contract"}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <StatusPill status={doc.status} />
                                </td>
                                <td className="px-4 py-3 text-text-secondary text-xs">{doc.uploadedTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredDocs.length === 0 && (
                    <div className="p-8 text-center text-text-secondary">
                        No documents found
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentQueueTable;
