import React, { useState, useEffect, useContext } from "react";
import { FaUsers, FaUserCircle, FaGift } from "react-icons/fa";
import { FiCopy, FiCheck } from "react-icons/fi";
import { getMyReferrals } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function Referral() {
  const { user, token } = useContext(AuthContext);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [openDetails, setOpenDetails] = useState({}); // Track open/close state

  const referralCode = user?.referralCode || "USER123";
  const referralLink = `partnersellercenter.shop/ref/${referralCode}`;

  useEffect(() => {
    if (!token) return;
    getMyReferrals(token)
      .then((res) => {
        setReferrals(res.data.referrals || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mask email helper
  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    return name.slice(0, 2) + "***@" + domain;
  };

  // Toggle details
  const toggleDetails = (id) => {
    setOpenDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* My Store Name */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-green-700">
          My Store:{" "}
          <span className="text-gray-800">{user?.storeName || "N/A"}</span>
        </h2>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
        <FaUsers className="text-green-500" /> Friends (Referral)
      </h1>

      {/* Info Section */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 mb-6">
        <p className="text-gray-700">
          Invite your friends and earn rewards when they join and shop with us.
        </p>
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center justify-between">
          <span className="font-semibold sm:text-sm text-xs text-green-600 truncate">
            {referralLink}
          </span>
          <button
            onClick={handleCopy}
            className="ml-3 flex items-center gap-1 px-2 py-1 border border-green-300 rounded-md text-green-600 hover:bg-green-100 transition text-xs sm:text-sm"
          >
            {copied ? (
              <>
                <FiCheck className="text-green-500" /> Copied
              </>
            ) : (
              <>
                <FiCopy /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Referrals Grid */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Your Referrals
        </h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : referrals.length === 0 ? (
          <p className="text-gray-500 text-sm">No referrals yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {referrals.map((referral) => (
              <div
                key={referral._id}
                className="w-full p-6 border rounded-xl shadow-sm bg-gray-50 hover:shadow-md transition flex flex-col items-center text-center"
              >
                <FaUserCircle className="text-green-500 text-5xl mb-2" />
                <p className="font-medium text-gray-800 text-lg">
                  {referral.name}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Joined on {new Date(referral.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-1 text-green-600 font-medium text-base mb-2">
                  <FaGift /> Referral
                </div>
                <button
                  onClick={() => toggleDetails(referral._id)}
                  className="text-xs text-green-700 underline mb-2"
                >
                  {openDetails[referral._id] ? "Hide Details" : "Show Details"}
                </button>
                {openDetails[referral._id] && (
                  <div className="w-full bg-white border border-green-100 rounded-lg p-3 text-left text-sm mt-2">
                    <div>
                      <span className="font-semibold">Store Name:</span>{" "}
                      {referral.storeName || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span>{" "}
                      {maskEmail(referral.email)}
                    </div>
                    <div>
                      <span className="font-semibold">Balance:</span>{" "}
                      {referral.balance != null
                        ? `Rs. ${referral.balance}`
                        : "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Recharge:</span>{" "}
                      {referral.rechargeAmount != null
                        ? `Rs. ${referral.rechargeAmount}`
                        : "N/A"}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
