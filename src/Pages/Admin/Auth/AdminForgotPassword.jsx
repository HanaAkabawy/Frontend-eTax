import React from "react";
//import Form from "../../Components/Ui/Form/Form";
import Form from "../../../Components/Ui/Form/Form";
import apiRequest from "../../../Services/ApiRequest";

export default function AdminForgotPassword() {
  const handleForgotPassword = async (values) => {
    try {
      const res = await apiRequest("POST", "/forgot-password", values);
      alert(res.message || "Password reset email sent!");
    } catch (err) {
      alert(err.message || "Failed to send reset email.");
    }
  };

  const fields = [
    { name: "email", label: "Admin Email", type: "email", placeholder: "Enter your email", required: true },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Form
        title="Admin Forgot Password"
        description="Enter your email to receive reset instructions"
        fields={fields}
        onSubmit={handleForgotPassword}
        submitLabel="Send Reset Link"
      />
    </div>
  );
}
