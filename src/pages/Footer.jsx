import React from "react";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";

function Footer() {
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
          <a
            href="https://wa.me/923166226704"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-600 transition-colors"
            aria-label="Contact us on WhatsApp"
          >
            <FaWhatsapp size={40} />
          </a>
          <a
            href="https://t.me/+923166226704"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors"
            aria-label="Contact us on Telegram"
          >
            <FaTelegram size={40} />
          </a>
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
