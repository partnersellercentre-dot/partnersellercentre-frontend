import React, { useEffect, useState, useContext } from "react";
import { getNotifications } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FaBell } from "react-icons/fa";

export default function Notifications() {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await getNotifications(token);
        console.log("Notifications API response:", data);

        // ✅ Defensive: ensure it's always an array
        setNotifications(
          Array.isArray(data.notifications) ? data.notifications : []
        );
      } catch (err) {
        console.error("Failed to fetch notifications", err);
        setNotifications([]); // fallback empty
      }
    };

    fetchNotifications();
  }, [token]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
        <FaBell className="text-green-500" /> Notifications
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications available.</p>
        ) : (
          notifications.map((noti, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                noti.isRead
                  ? "bg-gray-100"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <p className="text-gray-800 font-medium">{noti.message}</p>
              <p className="text-gray-500 text-sm">
                {new Date(noti.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
