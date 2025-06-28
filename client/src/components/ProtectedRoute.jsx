import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

// Wrapper for protected routes – only allows access if token exists
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  // If no token – redirect to login
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;