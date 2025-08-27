import React from "react";
//import Form from "../../Components/Ui/Form/Form";
import Form from "../../../Components/Ui/Form/Form";
import apiRequest from "../../../Services/ApiRequest";
import { useLocation } from "react-router-dom";
import { handleApiError, handleApiSuccess } from "../../../Utils/ErrorHandler";

export default function AdminResetPassword() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const token = queryParams.get("token");
  const email = queryParams.get("email"); 

  const handleResetPassword = async (values) => {
    try {
      values.email=email;
      values.token=token;
      const res = await apiRequest("POST", "/reset-password", values);
      handleApiSuccess(res);
    } catch (err) {
      handleApiError(err,'Reset Failed');
    }
  };

  const fields = [
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
