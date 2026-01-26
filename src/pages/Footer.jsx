import React, { useEffect, useState } from "react";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";
import { getSocialLinks } from "../api/api";

function Footer() {
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
        // Keep defaults if error
      }
    };
    fetchSocialLinks();
  }, []);

  const isValidUrl = (url) => {
    return url && /^https?:\/\/.+/.test(url);
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="w-full p-6 flex flex-col items-center">
        {/* Top Section */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-green-500">
            Partner Seller Centre
          </h2>
        </div>

        <p className="text-gray-600 mb-4">You can contact us using these:</p>

        <div className="flex gap-6 mb-8">
          {isValidUrl(socialLinks.whatsapp) ? (
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-600 transition-colors"
              aria-label="Contact us on WhatsApp"
            >
              <FaWhatsapp size={40} />
            </a>
          ) : (
            <span className="text-gray-400 cursor-not-allowed">
              <FaWhatsapp size={40} />
            </span>
          )}
          {isValidUrl(socialLinks.telegram) ? (
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 transition-colors"
              aria-label="Contact us on Telegram"
            >
              <FaTelegram size={40} />
            </a>
          ) : (
            <span className="text-gray-400 cursor-not-allowed">
              <FaTelegram size={40} />
            </span>
          )}
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} - All rights reserved by
          partnersellercentre.shop
        </div>
      </div>
    </footer>
  );
}

export default Footer;
