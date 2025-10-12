import React from "react";
import { FaQuestionCircle } from "react-icons/fa";

export default function Help() {
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
        <FaQuestionCircle className="text-green-500" /> Help
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <p className="text-gray-700">
          Need assistance? Check our help resources or reach out to our support
          team.
        </p>
      </div>
    </div>
  );
}
