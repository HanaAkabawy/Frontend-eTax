import { Navigate } from "react-router-dom";

const AdminMiddleware = ({ children }) => {
  const token = localStorage.getItem("token"); // Or use context/auth state
  const role = localStorage.getItem("role"); // e.g., 'admin' or 'user'

  if (!token) {
    return <Navigate to="/admin/auth/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />; // Redirect to user dashboard if not admin
  }

  return children;
};

export default AdminMiddleware;
