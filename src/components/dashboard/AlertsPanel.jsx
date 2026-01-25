import React from 'react';
import { MdErrorOutline, MdWarningAmber, MdAccessTime } from 'react-icons/md';

const AlertItem = ({ type, message, time, action }) => {
    const styles = {
        error: { icon: MdErrorOutline, color: 'text-red-500', bg: 'bg-red-500/10' },
        warning: { icon: MdWarningAmber, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        info: { icon: MdAccessTime, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    };

    const style = styles[type] || styles.info;
    const Icon = style.icon;

    return (
        <div className="flex gap-3 p-3 rounded-md bg-background/50 border border-white/5 mb-3 last:mb-0">
            <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center ${style.bg} ${style.color}`}>
                <Icon className="text-lg" />
            </div>
            <div className="flex-1">
                <p className="text-sm text-text-primary mb-1">{message}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary">{time}</span>
                    {action && (
                        <button className="text-xs font-medium text-primary hover:text-primaryHover hover:underline">
                            {action}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const AlertsPanel = () => {
    const alerts = [
        { type: 'error', message: 'Draft failed QA check: Contract #402', time: '10m ago', action: 'Review' },
        { type: 'warning', message: 'Client waiting > 48h: TechFlow MSA', time: '2h ago', action: 'Nudge' },
        { type: 'info', message: 'Manual approval required: Vendor Agreement', time: '5h ago', action: 'Approve' },
    ];

    if (alerts.length === 0) return null;

    return (
        <div className="bg-surface border border-white/5 rounded-lg p-5 h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-md font-semibold text-text-primary">Action Required</h2>
                <span className="text-xs font-medium bg-red-500 text-white px-2 py-0.5 rounded-full">3</span>
            </div>
            <div>
                {alerts.map((alert, index) => (
                    <AlertItem key={index} {...alert} />
                ))}
            </div>
        </div>
    );
};

export default AlertsPanel;
