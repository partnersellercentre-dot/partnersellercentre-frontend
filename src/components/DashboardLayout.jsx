// src/components/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import Footer from "../pages/Footer";
import AnnouncementModal from "./AnnouncementModal";
import { getAnnouncements } from "../api/api";

export default function DashboardLayout({ children }) {
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);

  useEffect(() => {
    const fetchLatestAnnouncement = async () => {
      try {
        const hasShown = sessionStorage.getItem("announcementShown");
        if (hasShown) return;

        const res = await getAnnouncements();
        if (res.data.announcements && res.data.announcements.length > 0) {
          setLatestAnnouncement(res.data.announcements[0]); // First one is latest due to sort in backend
          setShowAnnouncement(true);
        }
      } catch (err) {
        console.error("Error fetching announcement:", err);
      }
    };

    fetchLatestAnnouncement();
  }, []);

  const handleCloseAnnouncement = () => {
    setShowAnnouncement(false);
    sessionStorage.setItem("announcementShown", "true");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow px-4 py-6 pb-20 max-w-full mx-auto w-full">
        {children}
      </main>

      <AnnouncementModal
        isOpen={showAnnouncement}
        onClose={handleCloseAnnouncement}
        announcement={latestAnnouncement}
      />

      <BottomNavigation />
    </div>
  );
}
