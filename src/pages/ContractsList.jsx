import React, { useState, useMemo } from 'react';
import ContractsFilterBar from '../components/contracts/ContractsFilterBar';
import ContractsTable from '../components/contracts/ContractsTable';
import { MOCK_CONTRACTS } from '../data/mockContracts';

const ContractsList = () => {
    const [filters, setFilters] = useState({
        search: '',
        status: 'All',
        type: 'All'
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const filteredContracts = useMemo(() => {
        return MOCK_CONTRACTS.filter(contract => {
            // Search filter (ID, client, or type)
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
                contract.id.toLowerCase().includes(searchLower) ||
                contract.client.toLowerCase().includes(searchLower) ||
                contract.type.toLowerCase().includes(searchLower);

            // Status filter
            const matchesStatus = filters.status === 'All' || contract.status === filters.status;

            // Type filter
            const matchesType = filters.type === 'All' || contract.type === filters.type;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [filters]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary">Contracts</h1>
                    <p className="text-text-secondary">Manage and track all legal documents</p>
                </div>
            </div>

            <ContractsFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
            />
            <ContractsTable contracts={filteredContracts} />
        </div>
    );
};

export default ContractsList;
