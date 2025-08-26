import React from "react";
import Form from "../../../Components/Ui/Form/Form";
import apiRequest from "../../../Services/ApiRequest";
import { useNavigate } from "react-router-dom";
import { handleApiError, handleApiSuccess } from "../../../Utils/ErrorHandler";

export default function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      const res = await apiRequest("POST", "/register", formData, {
        "Content-Type": "multipart/form-data",
      });

      handleApiSuccess(res);
      navigate("/user/auth/login", {
        state: {
          successMessage: res.message || "Registration successful! Please log in.",
        },
      });
    } catch (err) {
      handleApiError(err, "SignUp failed");
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Fill in your details to sign up
        </p>

        <Form
          fields={fields}
          onSubmit={handleSignUp}
          submitLabel="Register"
        />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/user/auth/login")}
            className="text-blue-600 hover:underline font-medium"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
