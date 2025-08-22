import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/Routes/ProtectedRoutes';
import PublicRoute from './Components/Routes/PublicRoutes';

// Pages

// Admin Auth Pages
import AdminLogIn from './Pages/Admin/Auth/AdminLogIn';
import AdminSignUp from './Pages/Admin/Auth/AdminSignUp';
import AdminForgotPassword from './Pages/Admin/Auth/AdminForgotPassword';
import AdminResetPassword from './Pages/Admin/Auth/AdminResetPassword';

// User Auth Pages
import LogIn from './Pages/User/Auth/LogIn';
import SignUp from './Pages/User/Auth/SignUp';
import ForgotPassword from './Pages/User/Auth/ForgotPassword';
import ResetPassword from './Pages/User/Auth/ResetPassword';

// Admin Protected Pages
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminApproval from './Pages/Admin/AdminApproval';

// User Protected Pages
import Home from './Pages/User/Home';
import UserSubscription from './Pages/User/Subscription';

function App() {
  return (
    <Router>
      <Routes>
   
        {/* Admin Auth */}
        <Route path="/admin/auth/login" element={
          <PublicRoute>
            <AdminLogIn />
          </PublicRoute>
        } />
        <Route path="/admin/auth/signup" element={
          <PublicRoute>
            <AdminSignUp />
          </PublicRoute>
        } />
        <Route path="/admin/auth/forgotpassword" element={
          <PublicRoute>
            <AdminForgotPassword />
          </PublicRoute>
        } />
        <Route path="/admin/auth/resetpassword" element={
          <PublicRoute>
            <AdminResetPassword />
          </PublicRoute>
        } />

        {/* User Auth */}
        <Route path="/user/auth/login" element={
          <PublicRoute>
            <LogIn />
          </PublicRoute>
        } />
        <Route path="/user/auth/signUp" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        <Route path="/user/auth/forgotpassword" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/user/auth/resetpassword" element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/approval" element={
          <ProtectedRoute>
            <AdminApproval />
          </ProtectedRoute>
        } />

        {/* Protected User Routes */}
        <Route path="/user/dashboard" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/user/subscription" element={
          <ProtectedRoute>
            <UserSubscription />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
