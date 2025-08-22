import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedMiddleware from './Components/MiddleWare/ProtectedMiddleware';
import PublicMiddleware from './Components/MiddleWare/PublicMiddleware';
import AdminMiddleware from './Components/MiddleWare/AdminMiddleware';

// Layouts
import AdminLayout from './Pages/Admin/AdminLayout';
import UserLayout from './Pages/User/UserLayout';

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
import AdminUsers from './Pages/Admin/AdminUsers';
import AdminSubscriptions from './Pages/Admin/AdminSubscriptions';
import AdminPosts from './Pages/Admin/AdminPosts';
import AdminSettings from './Pages/Admin/AdminSettings';

// User Protected Pages
import Home from './Pages/User/Home';
import UserSubscription from './Pages/User/UserSubscription';
import UserProfile from './Pages/User/UserProfile';
import UserPosts from './Pages/User/UserPosts';

function App() {
  // Public routes
  const publicRoutes = [
    { path: '/admin/auth/login', element: <AdminLogIn /> },
    { path: '/admin/auth/signup', element: <AdminSignUp /> },
    { path: '/admin/auth/forgotpassword', element: <AdminForgotPassword /> },
    { path: '/admin/auth/resetpassword', element: <AdminResetPassword /> },
    { path: '/user/auth/login', element: <LogIn /> },
    { path: '/user/auth/signUp', element: <SignUp /> },
    { path: '/user/auth/forgotpassword', element: <ForgotPassword /> },
    { path: '/user/auth/resetpassword', element: <ResetPassword /> },
  ];

  // Protected Admin routes
  const adminRoutes = [
    { path: '/admin/dashboard', element: <AdminDashboard /> },
    { path: '/admin/users', element: <AdminUsers /> },
    { path: '/admin/subscriptions', element: <AdminSubscriptions /> },
    { path: '/admin/posts', element: <AdminPosts /> },
    { path: '/admin/settings', element: <AdminSettings /> },
  ];

  // Protected User routes
  const userRoutes = [
    { path: '/', element: <Home /> },
    { path: '/user/profile', element: <UserProfile /> },
    { path: '/user/subscriptions', element: <UserSubscription /> },
    { path: '/user/myposts', element: <UserPosts /> },
  ];

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element }, index) => (
          <Route
            key={index}
            path={path}
            element={<PublicMiddleware>{element}</PublicMiddleware>}
          />
        ))}

        {/* Admin Protected Routes with Layout */}
        {adminRoutes.map(({ path, element }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <AdminMiddleware>
                <AdminLayout>{element}</AdminLayout>
              </AdminMiddleware>
            }
          />
        ))}

        {/* User Protected Routes with Layout */}
        {userRoutes.map(({ path, element }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <ProtectedMiddleware>
                <UserLayout>{element}</UserLayout>
              </ProtectedMiddleware>
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
