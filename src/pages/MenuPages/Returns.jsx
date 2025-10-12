import React from "react";
import {
  FaUndo,
  FaBoxOpen,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function Returns() {
  return (
    <div className="p-6 h-full bg-gray-50">
      {/* Header */}
      <h1 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
        <FaUndo className="text-green-500" /> My Returns
      </h1>

      {/* Container */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <p>No Product Returns</p>
      </div>
    </div>
  );
}
