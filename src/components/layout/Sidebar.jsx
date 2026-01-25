import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    MdDashboard,
    MdDescription,
    MdPeople,
    MdAutoGraph,
    MdChat,
    MdAssessment,
    MdSettings
} from 'react-icons/md';

const Sidebar = () => {
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: MdDashboard },
        { path: '/contracts', label: 'Contracts', icon: MdDescription },
        { path: '/clients', label: 'Clients', icon: MdPeople },
        { path: '/automations', label: 'Automations', icon: MdAutoGraph },
        { path: '/feedback-bot', label: 'Feedback Bot', icon: MdChat },
        { path: '/analytics', label: 'Analytics', icon: MdAssessment },
        { path: '/settings', label: 'Settings', icon: MdSettings },
    ];

    return (
        <aside className="w-[240px] bg-surface border-r border-border h-screen fixed left-0 top-0 flex flex-col z-10 transition-colors">
            <div className="h-16 flex items-center px-6 border-b border-white/5">
                <h1 className="text-lg font-semibold tracking-wide text-text-primary">
                    <span className="text-primary">Legal</span>Auto
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                    }`
                                }
                            >
                                <item.icon className="text-lg" />
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        JD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-text-primary">John Doe</span>
                        <span className="text-[10px] text-text-secondary">Senior Partner</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
