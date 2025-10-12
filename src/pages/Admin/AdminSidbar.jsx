import React from "react";
import { FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { adminMenuItems } from "./AdminMenu";

function AdminSidebar({ closeSidebar, setActiveLink, activeLink }) {
  const navigate = useNavigate();

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    closeSidebar();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="sm:h-screen h-full bg-green-800 p-4 border-r text-white relative flex flex-col">
      {/* Close button (mobile) */}
      <button
        onClick={closeSidebar}
        className="absolute top-4 right-4 sm:hidden text-white text-2xl"
      >
        <FaTimes />
      </button>

      <h2 className="text-xl font-semibold mb-8 text-white">Admin Panel</h2>

      {/* Sidebar Links + Logout pinned bottom */}
      <div className="flex flex-col justify-between flex-1">
        {/* Menu Items */}
        <ul className="flex flex-col gap-2 overflow-auto">
          {adminMenuItems
            .filter((item) => item.name !== "Logout")
            .map((item) => (
              <li
                key={item.name}
                className={`mb-2 rounded-lg w-full cursor-pointer ${
                  activeLink === item.name ? "bg-green-600" : "bg-green-800"
                }`}
              >
                <Link
                  to={item.path}
                  onClick={() => handleLinkClick(item.name)}
                  className="block w-full p-2 capitalize text-white"
                >
                  {item.name}
                </Link>
              </li>
            ))}
        </ul>

        {/* Logout button fixed bottom */}
        <div className="mt-2 mb-3">
          <button
            onClick={handleLogout}
            className="w-full bg-red-700 hover:bg-red-600 cursor-pointer rounded-lg p-2 text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
