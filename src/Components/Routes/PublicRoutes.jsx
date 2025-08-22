import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // check if user is logged in

  if (token) {
    // Redirect logged-in users to their dashboard
    return <Navigate to="/user/dashboard" replace />; 
    // If you want admins to go to /admin/dashboard, you can add logic here
  }

  return children;
};

export default PublicRoute;
