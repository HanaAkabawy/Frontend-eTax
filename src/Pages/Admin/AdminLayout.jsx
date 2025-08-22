import React from "react";
import Sidebar from "../../Components/Ui/SideBar"; // Import the sidebar component

const AdminLayout = ({ children }) => {
  const handleLogout = () => {
    console.log("Admin logged out");
    // Add your logout logic here
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar name="Alhassan" onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
