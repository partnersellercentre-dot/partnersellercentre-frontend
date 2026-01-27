import React, { useEffect, useState } from "react";
import { FiX, FiBell } from "react-icons/fi";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";
import { getSocialLinks } from "../api/api";

const AnnouncementModal = ({ isOpen, onClose, announcement }) => {
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: "",
    telegram: "",
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const res = await getSocialLinks();
        if (res.data.socialLinks) {
          setSocialLinks(res.data.socialLinks);
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    };
    fetchSocialLinks();
  }, []);

  const isValidUrl = (url) => {
    return url && /^https?:\/\/.+/.test(url);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <FiBell className="text-xl animate-bounce" />
            <h2 className="text-xl font-bold">Important Announcement</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-700 rounded-full p-1 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {announcement.title}
          </h3>
          <div className="prose prose-green max-w-none text-gray-600 leading-relaxed max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {announcement.message.split("\n").map((line, i) => (
              <p key={i} className="mb-3">
                {line}
              </p>
            ))}
          </div>

          {/* Social Links */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-3">
              Questions? Contact us directly:
            </p>
            <div className="flex gap-6">
              {isValidUrl(socialLinks.whatsapp) ? (
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-600 transition-transform hover:scale-110"
                  aria-label="Contact us on WhatsApp"
                >
                  <FaWhatsapp size={32} />
                </a>
              ) : (
                <span className="text-gray-300">
                  <FaWhatsapp size={32} />
                </span>
              )}
              {isValidUrl(socialLinks.telegram) ? (
                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-transform hover:scale-110"
                  aria-label="Contact us on Telegram"
                >
                  <FaTelegram size={32} />
                </a>
              ) : (
                <span className="text-gray-300">
                  <FaTelegram size={32} />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform active:scale-95 transition-all shadow-md"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
