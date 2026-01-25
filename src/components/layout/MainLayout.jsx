import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-background text-text-primary flex">
            <Sidebar />
            <main className="flex-1 ml-[240px] p-8 w-[calc(100%-240px)]">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
