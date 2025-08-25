import React from "react";
import apiRequest from "../../../Services/ApiRequest";
import Form from "../../../Components/Ui/Form/Form";
import { useNavigate } from "react-router-dom";

export default function AdminLogIn() {
  const navigate = useNavigate();
  const handleAdminLogin = async (values) => {
    try {
      const res = await apiRequest("POST", "/login", values);      
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem('role',res.user.is_admin?'admin':'user');
      
      //navigate admin/dashboard
      navigate("/admin/dashboard", { replace: true });
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
