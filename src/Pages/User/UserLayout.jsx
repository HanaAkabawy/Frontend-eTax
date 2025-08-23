import React from "react";
import Navbar from "../../Components/Ui/NavBar";

const UserLayout = ({ children }) => {
  const handleLogout = () => {
    console.log("User logged out");
    // Add logout logic here
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
