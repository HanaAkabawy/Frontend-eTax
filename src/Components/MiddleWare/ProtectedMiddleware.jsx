import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedMiddleware = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // or your auth logic

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedMiddleware;
