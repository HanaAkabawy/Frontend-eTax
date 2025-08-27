import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Ui/SideBar"; // Import the sidebar component
import { useNavigate } from "react-router-dom";
import apiRequest from "../../Services/ApiRequest";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Alhassan"); // default fallback

  const handleLogout = async () => {
    try {
      //Call backend logout API
      await apiRequest("POST", "/logout", null, {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      });

      //Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem('role');

      //Redirect to login
      navigate('/admin/auth/login', { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user"); // assuming you store user as JSON
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || "Alhassan");
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar name={userName} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
