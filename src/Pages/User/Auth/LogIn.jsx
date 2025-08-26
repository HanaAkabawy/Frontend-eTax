import { useEffect } from "react";
import Form from "../../../Components/Ui/Form/Form";
import apiRequest from "../../../Services/ApiRequest";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { handleApiError, handleApiSuccess } from "../../../Utils/ErrorHandler";
import { CheckCircle2 } from "lucide-react"; // optional icons

export default function LogIn() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const hash = queryParams.get("hash");
  const expires = queryParams.get("expires");
  const signature = queryParams.get("signature");

  const successMessage = location.state?.successMessage;

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

  const handleLogin = async (values) => {
    try {
      const res = await apiRequest("POST", "/login", values);
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("role", res.user.is_admin ? "admin" : "user");

      navigate("/", { replace: true });
      handleApiSuccess(res);
    } catch (err) {
      handleApiError(err, "Login Failed");
    }
  };

  const fields = [
    { name: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
    { name: "password", label: "Password", type: "password", placeholder: "Enter your password", required: true },
  ];

  useEffect(() => {
    if (id && hash && expires && signature) {
      verifyEmail();
    }
  }, [id, hash, expires, signature]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back 👋</h2>
        <p className="text-center text-gray-500 mb-6">Login to access your account</p>

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-green-100 text-green-700 border border-green-300">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <Form
          title=""
          description=""
          fields={fields}
          onSubmit={handleLogin}
          submitLabel="Login"
        />

        {/* Links */}
        <div className="mt-6 flex flex-col items-center space-y-3">
          <Link
            to="/user/auth/forgotpassword"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>

          <button
            onClick={() => navigate("/user/auth/signUp")}
            className="w-full px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
}
