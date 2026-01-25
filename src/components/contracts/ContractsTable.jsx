import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusPill from '../common/StatusPill';

const ContractsTable = () => {
    const navigate = useNavigate();

    const contracts = [
        { id: 'CON-402', client: 'TechFlow Inc.', type: 'MSA', status: 'Review', stage: 'QA Review', updated: '10 mins ago', reviewer: 'AI + Paralegal' },
        { id: 'CON-399', client: 'Alpha Stream', type: 'NDA', status: 'Approved', stage: 'Finalised', updated: '2h ago', reviewer: 'Auto-Approved' },
        { id: 'CON-398', client: 'MegaCorp EU', type: 'DPA', status: 'Draft', stage: 'Drafting (AI)', updated: '5h ago', reviewer: 'AI Agent' },
        { id: 'CON-395', client: 'Solex Energy', type: 'Employment', status: 'Rejected', stage: 'Intake', updated: '1d ago', reviewer: 'Manual Check' },
        { id: 'CON-392', client: 'TechFlow Inc.', type: 'SOW', status: 'Review', stage: 'Client Review', updated: '2d ago', reviewer: 'John Doe' },
        { id: 'CON-390', client: 'BrightStart', type: 'NDA', status: 'Approved', stage: 'Finalised', updated: '3d ago', reviewer: 'Auto-Approved' },
    ];

    return (
        <div className="bg-surface rounded-lg border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="py-3 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">ID</th>
                            <th className="py-3 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Client</th>
                            <th className="py-3 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Type</th>
                            <th className="py-3 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                            <th className="py-3 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Stage</th>
                            <th className="py-3 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider">Last Updated</th>
                            <th className="py-3 px-6 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Reviewer</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {contracts.map((contract) => (
                            <tr
                                key={contract.id}
                                onClick={() => navigate(`/contracts/${contract.id}`)}
                                className="hover:bg-white/5 cursor-pointer transition-colors group"
                            >
                                <td className="py-4 px-6 text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{contract.id}</td>
                                <td className="py-4 px-6 text-sm text-text-primary">{contract.client}</td>
                                <td className="py-4 px-6 text-sm text-text-secondary">{contract.type}</td>
                                <td className="py-4 px-6"><StatusPill status={contract.status} /></td>
                                <td className="py-4 px-6 text-sm text-text-secondary">{contract.stage}</td>
                                <td className="py-4 px-6 text-sm text-text-secondary">{contract.updated}</td>
                                <td className="py-4 px-6 text-sm text-text-secondary hidden md:table-cell">{contract.reviewer}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContractsTable;
