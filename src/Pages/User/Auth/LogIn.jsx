import { useEffect } from "react";
import Form from "../../../Components/Ui/Form/Form";
import apiRequest from "../../../Services/ApiRequest";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { handleApiError } from "../../../Utils/ErrorHandler";
import { handleApiSuccess } from "../../../Utils/ErrorHandler";


export default function LogIn() {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const hash = queryParams.get("hash");
  const expires = queryParams.get("expires");
  const signature = queryParams.get("signature");

   const verifyEmail = async () => {
    try {
      const res = await apiRequest(
        "GET",
        `/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`
      );
      handleApiSuccess(res);
      navigate("/user/auth/login");
    } catch (err) {
      handleApiError(err, "Email verification failed!");
    }
  };


  const successMessage = location.state?.successMessage;
  const navigate = useNavigate();
  const handleLogin = async (values) => {
    try {
      const res = await apiRequest("POST", "/login", values);  //calls my Laravel backend at /api/login.
      localStorage.setItem("token", res.access_token);   //saves the token in the browser so the user stays logged in.
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem('role',res.user.is_admin?'admin':'user');
      
      //navigate to home
      navigate("/", { replace: true });
      handleApiSuccess(res);
      
    } catch (err) {
      handleApiError(err,'Login Failed');
    }

  };

  const fields = [   //field to be filled by the user 
    { name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "Enter your password", required: true },
  ];

    useEffect(() => {
      if (id && hash && expires && signature) {
        verifyEmail();
      }
    }
    , [id, hash, expires, signature]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-200 text-green-800 rounded shadow">
          {successMessage}
        </div>
      )}
      {/* Login form */}
      <Form
        title="User Login"
        description="Access your account"
        fields={fields}
        onSubmit={handleLogin}
        submitLabel="Login"
      />

      {/* Extra links */}
      <div className="mt-4 flex flex-col items-center space-y-2">
        {/* Forgot password link */}
        <Link
          to="/user/auth/forgotpassword"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>

        {/* Sign Up button */}
        <button
          onClick={() => navigate("/user/auth/signUp")}
          className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Create New Account
        </button>
      </div>
    </div>
  );
}
