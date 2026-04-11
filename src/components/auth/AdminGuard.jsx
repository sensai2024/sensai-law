import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import LoadingPage from '../ui/LoadingPage';

/**
 * Guard for routes that require admin privileges
 */
const AdminGuard = ({ children }) => {
  const { session, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
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
