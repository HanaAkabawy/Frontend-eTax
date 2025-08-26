import React from "react";
import Navbar from "../../Components/Ui/NavBar";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../Services/ApiRequest";



const UserLayout = ({ children }) => {
  const navigate = useNavigate();

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
      navigate('/user/auth/login', { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-400">
      {/* Navbar */}
      <Navbar name="Alhassan" onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default UserLayout;
