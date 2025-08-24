import React from "react";
//import Form from "../../Components/Ui/Form/Form";
import Form from "../../../Components/Ui/Form/Form";
import apiRequest from "../../../Services/ApiRequest";

export default function ResetPassword() {
  const handleResetPassword = async (values) => {
    try {
      await apiRequest("POST", "/reset-password", values);  //backend validates the token, updates the password, and logs the user in.
      alert("Password reset successful!");
    } catch (err) {
      alert(err.message || "Reset failed.");
    }
  };

  const fields = [
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "New Password", type: "password", required: true },
    { name: "password_confirmation", label: "Confirm Password", type: "password", required: true },
    { name: "token", label: "Reset Token", type: "text", required: true }, // backend usually provides this in reset link
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Form
        title="Reset Password"
        description="Enter your new password"
        fields={fields}
        onSubmit={handleResetPassword}
        submitLabel="Reset Password"
      />
    </div>
  );
}
