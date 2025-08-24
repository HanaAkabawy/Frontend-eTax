import React, { useState } from "react";
import UIInput from "./UIInput";
import { Mail, Lock } from "lucide-react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-lg space-y-4">
      <UIInput
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="w-4 h-4" />}
        helperText="We'll never share your email."
      />

      <UIInput
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<Lock className="w-4 h-4" />}
        error={password.length < 6 ? "Password must be at least 6 characters" : ""}
      />
    </div>
  );
}
