import React from "react";
import apiRequest from "../../../Services/ApiRequest";
import Form from "../../../Components/UI/Form/Form";

export default function AdminLogIn() {
  const handleAdminLogin = async (values) => {
    try {
      const res = await apiRequest("POST", "/admin/login", values);
      localStorage.setItem("adminToken", res.token);
      alert("Admin logged in successfully!");
    } catch (err) {
      alert(err.message || "Admin login failed.");
    }
  };

  const fields = [
    { name: "email", label: "Admin Email", type: "email", placeholder: "Enter admin email", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "Enter password", required: true },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Form
        title="Admin Login"
        description="Sign in to admin dashboard"
        fields={fields}
        onSubmit={handleAdminLogin}
        submitLabel="Login"
      />
    </div>
  );
}
