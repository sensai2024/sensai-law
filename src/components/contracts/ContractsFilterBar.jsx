import React from 'react';
import { MdSearch, MdFilterList } from 'react-icons/md';

const ContractsFilterBar = () => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
            <div className="relative w-full md:w-96">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                <input
                    type="text"
                    placeholder="Search contracts, clients, or IDs..."
                    className="w-full bg-surface border border-white/10 rounded-md pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <select className="bg-surface border border-white/10 rounded-md px-3 py-2 text-sm text-text-secondary focus:outline-none hover:border-white/20 cursor-pointer">
                    <option>All Statuses</option>
                    <option>Draft</option>
                    <option>Review</option>
                    <option>Approved</option>
                </select>

                <select className="bg-surface border border-white/10 rounded-md px-3 py-2 text-sm text-text-secondary focus:outline-none hover:border-white/20 cursor-pointer">
                    <option>All Types</option>
                    <option>NDA</option>
                    <option>MSA</option>
                    <option>Employment</option>
                </select>

                <button className="flex items-center gap-2 bg-surfaceHighlight hover:bg-white/20 text-text-primary px-3 py-2 rounded-md text-sm transition-colors border border-white/5">
                    <MdFilterList />
                    More Filters
                </button>
            </div>
        </div>
    );
};

export default ContractsFilterBar;
