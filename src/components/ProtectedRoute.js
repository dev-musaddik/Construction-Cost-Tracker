import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    // Logged in but no authorized role, redirect to dashboard or unauthorized page
    return <Navigate to="/dashboard" />; // Or a specific unauthorized page
  }

  return children;
};

export default ProtectedRoute;