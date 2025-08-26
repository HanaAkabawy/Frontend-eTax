import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicMiddleware = ({ children }) => {
  const token = localStorage.getItem('token'); // check if user is logged in
  const role = localStorage.getItem('role');   // get user role

  if (token && role !== "admin") {
    // Redirect logged-in non-admin users to their dashboard
    return <Navigate to="/" replace />;
  } else if (token && role === "admin") {
    // Redirect admins to their dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default PublicMiddleware;
