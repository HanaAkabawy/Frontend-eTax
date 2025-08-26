import React from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Users, CreditCard, Settings, FileText } from "lucide-react";
import Button from "../Ui/Button/Button"; // ✅ adjust the import path

const Sidebar = ({ name, onLogout }) => {
  const links = [
    { path: "/admin/users", label: "Users", icon: <Users className="w-5 h-5" /> },
    { path: "/admin/subscriptions", label: "Subscriptions", icon: <CreditCard className="w-5 h-5" /> },
    { path: "/admin/posts", label: "Posts", icon: <FileText className="w-5 h-5" /> },
    { path: "/admin/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-gray-100 flex flex-col justify-between shadow-xl">
      {/* Greeting */}
      <div>
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">
            Hello, <span className="text-indigo-400">{name}</span>
          </h2>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <ul className="space-y-3 px-4">
            {links.map(({ path, label, icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl transition ${
                      isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-800"
                    }`
                  }
                >
                  {icon}
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-6 border-t border-gray-700">
        <Button
          onClick={onLogout}
          variant="destructive"
          size="md"
          className="w-full flex justify-start gap-3"
          leftIcon={<LogOut className="w-5 h-5" />}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
