import React from "react";
import { FaCommentDots } from "react-icons/fa";

export default function Feedback() {
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
        <FaCommentDots className="text-green-500" /> Feedback
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <p className="text-gray-700">
          We value your feedback. Share your thoughts to help us improve.
        </p>
      </div>
    </div>
  );
}
