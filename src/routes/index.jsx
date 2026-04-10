import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { AuthProvider } from '../features/auth/AuthContext';
import AuthGuard from '../components/auth/AuthGuard';
import AdminGuard from '../components/auth/AdminGuard';

// Auth pages
const LoginPage = React.lazy(() => import('../features/auth/LoginPage'));
const ForgotPasswordPage = React.lazy(() => import('../features/auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('../features/auth/ResetPasswordPage'));
const ChangePasswordPage = React.lazy(() => import('../features/auth/ChangePasswordPage'));

// Admin pages
const AdminUsersPage = React.lazy(() => import('../features/admin/AdminUsersPage'));

// Feature pages
const Dashboard = React.lazy(() => import('../features/dashboard/Dashboard'));
const CrmApprovals = React.lazy(() => import('../features/crm-approvals/CrmApprovals'));
const Contracts = React.lazy(() => import('../features/contracts/Contracts'));
const Transcriptions = React.lazy(() => import('../features/transcriptions/Transcriptions'));
const Errors = React.lazy(() => import('../features/errors/Errors'));
const ClientsList = React.lazy(() => import('../features/clients/ClientsList'));
const ClientDetails = React.lazy(() => import('../features/clients/ClientDetails'));

const AppRoutes = () => {
    return (
        <AuthProvider>
            <React.Suspense fallback={
                <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            }>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    {/* Protected Routes */}
                    <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/crm-approval" element={<CrmApprovals />} />
                        <Route path="/contracts" element={<Contracts />} />
                        <Route path="/transcriptions" element={<Transcriptions />} />
                        <Route path="/errors" element={<Errors />} />
                        <Route path="/clients" element={<ClientsList />} />
                        <Route path="/clients/:clientId" element={<ClientDetails />} />
                        <Route path="/settings/security" element={<ChangePasswordPage />} />
                        
                        {/* Admin Only Routes */}
                        <Route path="/admin/users" element={<AdminGuard><AdminUsersPage /></AdminGuard>} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </React.Suspense>
        </AuthProvider>
    );
};

export default AppRoutes;
