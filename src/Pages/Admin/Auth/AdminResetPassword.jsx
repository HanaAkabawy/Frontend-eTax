import React from "react";
//import Form from "../../Components/Ui/Form/Form";
import Form from "../../../Components/Ui/Form/Form";
import apiRequest from "../../../Services/ApiRequest";

export default function AdminResetPassword() {
  const handleResetPassword = async (values) => {
    try {
      const res = await apiRequest("POST", "/reset-password", values);
      alert(res.message || "Password has been reset!");
    } catch (err) {
      alert(err.message || "Reset failed.");
    }
  };

  const fields = [
    { name: "token", label: "Reset Token", type: "text", placeholder: "Paste the token you received", required: true },
    { name: "email", label: "Admin Email", type: "email", placeholder: "Enter your email", required: true },
    { name: "password", label: "New Password", type: "password", placeholder: "Enter new password", required: true },
    { name: "password_confirmation", label: "Confirm Password", type: "password", placeholder: "Re-enter new password", required: true },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Form
        title="Admin Reset Password"
        description="Set a new password for your admin account"
        fields={fields}
        onSubmit={handleResetPassword}
        submitLabel="Reset Password"
      />
    </div>
  );
}
