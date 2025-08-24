
import { Mail, Lock, User } from "lucide-react";

export default function App() {
  const handleFormSubmit = async (values) => {
    console.log("Form submitted:", values);
    return new Promise((resolve) => setTimeout(resolve, 2000)); // simulate API
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Form
        title="Create Account"
        description="Fill in your details below to sign up"
        submitLabel="Sign Up"
        fields={[
          {
            name: "name",
            label: "Full Name",
            placeholder: "John Doe",
            required: true,
            icon: <User className="w-4 h-4" />,
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "example@mail.com",
            required: true,
            icon: <Mail className="w-4 h-4" />,
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "••••••••",
            required: true,
            icon: <Lock className="w-4 h-4" />,
          },
        ]}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
