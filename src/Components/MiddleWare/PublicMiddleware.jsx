import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicMiddleware = ({ children }) => {
  const token = localStorage.getItem('token'); // check if user is logged in

  if (token && !role==="admin") {
    // Redirect logged-in users to their dashboard
    return <Navigate to="/" replace />; 
    // If you want admins to go to /admin/dashboard, you can add logic here
  }
  else if ((token && role==="admin")){

    return <Navigate to="/admin/dashboard" replace />; 


  }

  return children;
};

export default PublicMiddleware;
