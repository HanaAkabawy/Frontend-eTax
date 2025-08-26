import React from "react";
import Form from "../../../Components/Ui/Form/Form";
import apiRequest from "../../../Services/ApiRequest";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../../../Utils/ErrorHandler";
import { handleApiSuccess } from "../../../Utils/ErrorHandler";

export default function SignUp() {
  const navigate = useNavigate();
  const handleSignUp = async (values) => {
    try {
       const formData = new FormData();

      Object.keys(values).forEach((key) => {
        // console.log(key,values[key]);
        formData.append(key, values[key]);
        // console.log(formData);
   
      });

      const res = await apiRequest("POST", "/register", formData, {
          "Content-Type": "multipart/form-data",
      }); 

      console.log("after register")
     // Redirect to login with success message from backend
      navigate("/user/auth/login");
      handleApiSuccess(res);
        //state: { successMessage: res.message || "Registration successful! Please log in." },
      //});
    } catch (err) {
      handleApiError(err,'SignUp failed');
    }
  };

  const fields = [
    { name: "name", label: "Name", type: "text", placeholder: "Enter your name", required: true },
    { name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
    { name: "national_id", label: "National ID", type: "text", placeholder: "Enter your national ID", required: true },
    { name: "national_id_image", label: "National ID Image", type: "file", required: true },
    { name: "profile_picture", label: "Profile Picture", type: "file", required: false },
    { name: "password", label: "Password", type: "password", placeholder: "Create a password", required: true },
    { name: "password_confirmation", label: "Confirm Password", type: "password", placeholder: "Re-enter password", required: true },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Form
        title="User Sign Up"
        description="Create your new account"
        fields={fields}
        onSubmit={handleSignUp}
        submitLabel="Register"
      />
    </div>
  );
}
