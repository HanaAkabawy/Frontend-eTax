import React from "react";
import apiRequest from "../../../Services/ApiRequest";
import Form from "../../../Components/Ui/Form/Form";
import { useNavigate,Link } from "react-router-dom";
import { handleApiError, handleApiSuccess } from "../../../Utils/ErrorHandler";

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
      handleApiSuccess("Success! Redirected to your dashboard.");
      
    } catch (err) {
      handleApiError("Admin Login Failed");
    }
  };

  const fields = [
    { name: "email", label: "Admin Email", type: "email", placeholder: "Enter admin email", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "Enter password", required: true },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Form
        title="Admin Login"
        description="Sign in to admin dashboard"
        fields={fields}
        onSubmit={handleAdminLogin}
        submitLabel="Login"
      />
      {/* Links BELOW the form so they don’t interfere with submit */}
      <div className="mt-4 flex flex-col items-center space-y-2">
          <Link to="/admin/auth/forgotpassword" className="text-sm text-blue-600 hover:underline"
>Forgot Password?</Link>

        </div>
      </div>
  );
}
