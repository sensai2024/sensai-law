import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import DocumentPreview from '../components/contract-detail/DocumentPreview';
import ContractMetadata from '../components/contract-detail/ContractMetadata';
import QAFlags from '../components/contract-detail/QAFlags';
import ContractActions from '../components/contract-detail/ContractActions';

const ContractDetail = () => {
    const { id } = useParams();

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/contracts" className="p-2 rounded-full hover:bg-white/5 text-text-secondary transition-colors">
                    <MdArrowBack className="text-xl" />
                </Link>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold text-text-primary">Contract Review</h1>
                        <span className="bg-white/10 text-text-secondary text-xs px-2 py-0.5 rounded font-mono">{id || 'CON-402'}</span>
                    </div>
                    <p className="text-text-secondary text-sm">Review automated draft before sending to client</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full">
                {/* Left Panel - 60% */}
                <div className="w-full lg:w-[60%] bg-surface rounded-lg">
                    <DocumentPreview />
                </div>

                {/* Right Panel - 40% */}
                <div className="w-full lg:w-[40%] flex flex-col overflow-y-auto">
                    <ContractMetadata />
                    <QAFlags />
                    <div className="mt-auto">
                        <ContractActions />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractDetail;
