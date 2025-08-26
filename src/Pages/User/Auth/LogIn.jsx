import React from "react";
//import Form from "../../Components/Ui/Form/Form";
import Form from "../../../Components/Ui/Form/Form";
import apiRequest from "../../../Services/ApiRequest";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
  const navigate = useNavigate();
  const handleLogin = async (values) => {
    try {
      const res = await apiRequest("POST", "/login", values);  //calls my Laravel backend at /api/login.
      localStorage.setItem("token", res.access_token);   //saves the token in the browser so the user stays logged in.
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem('role',res.user.is_admin?'admin':'user');
      
      //navigate to home
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err.message);
      alert(err.message || "Admin login failed.");
    }

  };

  const fields = [   //field to be filled by the user 
    { name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "Enter your password", required: true },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Form
        title="User Login"
        description="Access your account"
        fields={fields}
        onSubmit={handleLogin}
        submitLabel="Login"
      />
    </div>
  );
}
