import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

/**
 * Guard for routes that require admin privileges
 */
const AdminGuard = ({ children }) => {
  const { session, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // If not admin, redirect to dashboard or show unauthorized
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminGuard;
