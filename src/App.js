import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedMiddleware from './Components/MiddleWare/ProtectedMiddleware';
import PublicMiddleware from './Components/MiddleWare/PublicMiddleware';
import AdminMiddleware from './Components/MiddleWare/AdminMiddleware';

import NotFound from './Pages/NotFound';

// Layouts
import AdminLayout from './Pages/Admin/AdminLayout';
import UserLayout from './Pages/User/UserLayout';

// Admin Auth Pages
import AdminLogIn from './Pages/Admin/Auth/AdminLogIn';
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
import CreatePost from './Pages/User/CreatePost';
import MyPosts from './Pages/User/myPosts';
import UserPosts from './Pages/User/UserPosts';
import UserSubscription from './Pages/User/UserSubscription';
import UserProfile from './Pages/User/UserProfile';


function App() {
  // Public routes
  const publicRoutes = [
    { path: '/admin/auth/login', element: <AdminLogIn /> },
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

   // ✅ Updated Protected User Routes - 
  const userRoutes = [
    { path: '/', element: <Home /> }, // View all posts
    { path: '/user/create', element: <CreatePost /> }, // Create a new post
    { path: '/user/myposts', element: <MyPosts /> }, // View current user's own posts
    { path: '/user/post/:id', element: <UserPosts /> }, // View another user's posts by ID
    { path: '/user/profile', element: <UserProfile /> }, // User profile
    { path: '/user/subscriptions', element: <UserSubscription /> }, // Subscriptions 
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

              <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
