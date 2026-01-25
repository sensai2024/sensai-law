import React from 'react';

const StatusPill = ({ status }) => {
    const styles = {
        'Draft': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'Review': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        'Approved': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        'Rejected': 'bg-red-500/10 text-red-500 border-red-500/20',
        'Pending': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    };

    const style = styles[status] || styles['Pending'];

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
            {status}
        </span>
    );
};

export default StatusPill;
