import React, { useContext, useEffect, useState } from "react";
import { FaBars, FaBell, FaUser } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../../api/api";
import { motion } from "framer-motion";

function AdminNavbar({ toggleSidebar }) {
  const { token, user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const fetchNoti = async () => {
      try {
        const { data } = await getNotifications(token);

        // ✅ fix: data.notifications might be undefined or array
        const notis = data.notifications || [];
        setNotifications(notis.filter((n) => !n.isRead));
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    fetchNoti();
    // const interval = setInterval(fetchNoti, 10000); // refresh every 10s
    // return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="bg-[#1f1b2e] p-4 text-white fixed top-0 left-0 right-0 z-40 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-4">
        <button className="lg:hidden p-2" onClick={toggleSidebar}>
          <FaBars className="text-2xl" />
        </button>
        <span className="text-2xl font-semibold">PSC Dashboard</span>
      </div>

      <div className="flex items-center space-x-6">
        <button
          className="relative"
          onClick={() => navigate("/admin/notifications")}
        >
          <FaBell className="text-2xl" />
          {notifications.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
            >
              {notifications.length}
            </motion.span>
          )}
        </button>

        <button className="flex items-center space-x-2">
          <FaUser className="text-2xl" />
          <span className="hidden sm:block">{user?.username || "Admin"}</span>
        </button>
      </div>
    </div>
  );
}

export default AdminNavbar;
