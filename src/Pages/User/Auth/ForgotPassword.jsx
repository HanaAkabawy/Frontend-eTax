import React from "react";
//import Form from "../../Components/Ui/Form/Form";
import Form from "../../../Components/Ui/Form/Form";
import apiRequest from "../../../Services/ApiRequest";
import { handleApiError } from "../../../Utils/ErrorHandler";
import { handleApiSuccess } from "../../../Utils/ErrorHandler";
   


export default function ForgotPassword() {
  const handleForgotPassword = async (values) => {
    try {
      const res= await apiRequest("POST", "/forgot-password", values);  //backend generates a password reset token and emails the reset link.
      handleApiSuccess(res);
      
    } catch (err) {
      handleApiError(err,'Failed sending the reset link');
    }
  };

  const fields = [
    { name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Form
        title="Forgot Password"
        description="We'll send a reset link to your email"
        fields={fields}
        onSubmit={handleForgotPassword}
        submitLabel="Send Reset Link"
      />
    </div>
  );
}
