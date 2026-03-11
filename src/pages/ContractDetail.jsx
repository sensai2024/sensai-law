import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import { useContracts } from '../hooks/useContracts';
import DocumentPreview from '../components/contract-detail/DocumentPreview';
import ContractMetadata from '../components/contract-detail/ContractMetadata';
import QAFlags from '../components/contract-detail/QAFlags';
import ContractActions from '../components/contract-detail/ContractActions';

const ContractDetail = () => {
    const { id } = useParams();
    const { data: contracts, isLoading } = useContracts();
    
    const contract = contracts?.find(c => c.id === id);

    if (isLoading) {
        return <div className="p-8 text-center text-text-secondary">Loading contract...</div>;
    }

    if (!contract) {
        return <div className="p-8 text-center text-text-secondary">Contract not found.</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/contracts" className="p-2 rounded-full hover:bg-white/5 text-text-secondary transition-colors">
                    <MdArrowBack className="text-xl" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold text-text-primary">Contract Review</h1>
                        <span className="bg-white/10 text-text-secondary text-xs px-2 py-0.5 rounded font-mono">{contract.id}</span>
                    </div>
                    <p className="text-text-secondary text-sm">Review automated draft before sending to client</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full">
                {/* Left Panel - 60% */}
                <div className="w-full lg:w-[60%] bg-surface rounded-lg border border-white/5 flex flex-col h-[calc(100vh-140px)]">
                    <div className="h-12 border-b border-white/5 flex justify-between items-center px-4">
                        <span className="text-sm font-medium text-text-secondary">Document Preview</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 rounded-b-lg font-serif prose max-w-none">
                        <ReactMarkdown>
                            {contract.content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Right Panel - 40% */}
                <div className="w-full lg:w-[40%] flex flex-col overflow-y-auto">
                    {/* Passing contract data to existing components so they can use it if they accept props */}
                    <ContractMetadata contract={contract} clientName={contract.clientName} status={contract.status} createdAt={contract.createdAt} />
                    <QAFlags contract={contract} />
                    <div className="mt-auto">
                        <ContractActions contractId={contract.id} status={contract.status} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractDetail;
