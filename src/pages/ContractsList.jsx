import React from 'react';
import ContractsFilterBar from '../components/contracts/ContractsFilterBar';
import ContractsTable from '../components/contracts/ContractsTable';

const ContractsList = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary">Contracts</h1>
                    <p className="text-text-secondary">Manage and track all legal documents</p>
                </div>
            </div>

            <ContractsFilterBar />
            <ContractsTable />
        </div>
    );
};

export default ContractsList;
