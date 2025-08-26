import React from "react";
//import Form from "../../Components/Ui/Form/Form";
import Form from "../../../Components/Ui/Form/Form";
import apiRequest from "../../../Services/ApiRequest";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { handleApiError, handleApiSuccess } from "../../../Utils/ErrorHandler";


export default function ResetPassword() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const token = queryParams.get("token");
  const email = queryParams.get("email");  
  console.log(token,email);
  const handleResetPassword = async (values) => {
    try {
      values.email=email;
      values.token=token;
      await apiRequest("POST", "/reset-password", values);  //backend validates the token, updates the password, and logs the user in.

     // Redirect to login with success message from backend
      navigate("/user/auth/login");
      handleApiSuccess("Success! Please log in with your new password.");
        //state: { successMessage: res.message || "Success! Please log in with your new password." },
      //});
    } catch (err) {
     handleApiError(err, 'Reset password failed');
    }
  };

  const fields = [
    
    { name: "password", label: "New Password", type: "password", required: true },
    { name: "password_confirmation", label: "Confirm Password", type: "password", required: true },
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
