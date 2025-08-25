import React from "react";
//import Form from "../../Components/Ui/Form/Form";
import Form from "../../../Components/Ui/Form/Form";
import apiRequest from "../../../Services/ApiRequest";

export default function SignUp() {
  const handleSignUp = async (values) => {
    try {
       const formData = new FormData();

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      const res = await apiRequest("POST", "/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }); 
      alert("Registration successful! Check your email to verify.");
    } catch (err) {
      alert(err.message || "Sign up failed.");
    }
  };

  const fields = [
    { name: "name", label: "Name", type: "text", placeholder: "Enter your name", required: true },
    { name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
    { name: "national_id", label: "National ID", type: "text", placeholder: "Enter your national ID", required: true },
    { name: "national_id_image", label: "National ID Image", type: "file", required: true },
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
