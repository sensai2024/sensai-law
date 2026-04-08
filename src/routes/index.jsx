import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

// feature pages (placeholders for now)
const Dashboard = React.lazy(() => import('../features/dashboard/Dashboard'));
const CrmApprovals = React.lazy(() => import('../features/crm-approvals/CrmApprovals'));
const Contracts = React.lazy(() => import('../features/contracts/Contracts'));
const Transcriptions = React.lazy(() => import('../features/transcriptions/Transcriptions'));
const Errors = React.lazy(() => import('../features/errors/Errors'));
const ClientsList = React.lazy(() => import('../features/clients/ClientsList'));
const ClientDetails = React.lazy(() => import('../features/clients/ClientDetails'));

const AppRoutes = () => {
    return (
        <React.Suspense fallback={<div className="h-full flex items-center justify-center text-primary">Loading...</div>}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/crm-approval" element={<CrmApprovals />} />
                    <Route path="/contracts" element={<Contracts />} />
                    <Route path="/transcriptions" element={<Transcriptions />} />
                    <Route path="/errors" element={<Errors />} />
                    <Route path="/clients" element={<ClientsList />} />
                    <Route path="/clients/:clientId" element={<ClientDetails />} />
                </Route>
            </Routes>
        </React.Suspense>
    );
};

export default AppRoutes;
