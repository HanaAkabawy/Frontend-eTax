import React from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import Button from "../Ui/Button/Button";

const Navbar = ({ name, onLogout }) => {
  const links = [
    { path: "/", label: "Home" },
    { path: "/user/profile", label: "Profile" },
    { path: "/user/subscriptions", label: "Subscriptions" },
    { path: "/user/myposts", label: "My Posts" },
  ];

  return (
    <nav className="w-full bg-gray-900 text-gray-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Left: Greeting */}
        <div className="text-lg font-semibold">
          Hello, <span className="text-indigo-400">{name}</span>
        </div>

        {/* Middle: Navigation Links */}
        <ul className="flex gap-6">
          {links.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `text-gray-300 hover:text-white transition ${
                    isActive ? "text-indigo-400 font-semibold" : ""
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right: Logout Button */}
        <Button
          onClick={onLogout}
          variant="destructive"
          size="sm"
          leftIcon={<LogOut className="w-5 h-5" />}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
