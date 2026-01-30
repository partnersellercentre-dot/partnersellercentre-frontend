import React from "react";
import { FiX } from "react-icons/fi";
import SocialLinks from "./SocialLinks";

const SocialLinksModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4 pointer-events-none">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in slide-in-from-top duration-500 pointer-events-auto border border-gray-100">
        <div className="relative p-6 pt-10">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>

          <SocialLinks
            size={24}
            className="flex flex-row justify-center gap-3"
            showTitle={true}
          />
        </div>

        <div className="bg-gray-50 px-6 py-3">
          <button
            onClick={onClose}
            className="w-full py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transform active:scale-95 transition-all shadow-md"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksModal;
