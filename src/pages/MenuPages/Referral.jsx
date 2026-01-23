import React, { useState, useEffect, useContext } from "react";
import {
  FaUsers,
  FaUserCircle,
  FaGift,
  FaWhatsapp,
  FaChartLine,
  FaGlobe,
  FaStar,
  FaCrown,
  FaGem,
  FaRocket,
} from "react-icons/fa";
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
  const referralLink = `https://www.partnersellercentre.shop/ref/${referralCode}`;

  const rewardTiers = [
    {
      title: "Starter",
      activeStores: "3",
      funds: "$200",
      commission: "$30",
      weeklySalary: "$5",
      icon: <FaRocket className="text-blue-500" />,
    },
    {
      title: "Growth",
      activeStores: "10",
      funds: "$100",
      commission: "$00",
      weeklySalary: "$0",
      icon: <FaChartLine className="text-green-500" />,
    },
    {
      title: "Expansion",
      activeStores: "30",
      funds: "$3100",
      commission: "$00",
      weeklySalary: "$0",
      icon: <FaGlobe className="text-purple-500" />,
    },
    {
      title: "Premium",
      activeStores: "40",
      funds: "$200",
      commission: "$90",
      weeklySalary: "$5",
      icon: <FaStar className="text-red-500" />,
    },
    {
      title: "Elite",
      activeStores: "70",
      funds: "$1100",
      commission: "$50",
      weeklySalary: "$25",
      icon: <FaCrown className="text-red-500" />,
    },
    {
      title: "Diamond",
      activeStores: "100",
      funds: "2,55K",
      commission: "$70",
      weeklySalary: "",
      icon: <FaGem className="text-blue-400" />,
    },
  ];

  const investmentCommissions = [
    { level: "Lv1", rate: "7%" },
    { level: "Lv2", rate: "1.8%" },
    { level: "Lv3", rate: "1.2%" },
    { level: "Lv4", rate: "0.8%" },
    { level: "Lv5", rate: "0.5%" },
    { level: "Lv6", rate: "0.3%" },
  ];

  const weeklySalaryCommissions = [
    { level: "Lv1", rate: "3%" },
    { level: "Lv2", rate: "2%" },
    { level: "Lv3", rate: "1.5%" },
    { level: "Lv4", rate: "0.8%" },
  ];

  const monthlyTeamRebates = [
    { stores: "3 stores", rebate: "$30" },
    { stores: "10 stores", rebate: "$100" },
    { stores: "20 stores", rebate: "$300" },
    { stores: "30 stores", rebate: "$400" },
    { stores: "40 stores", rebate: "$500" },
    { stores: "70 stores", rebate: "$750" },
    { stores: "100 stores", rebate: "$1000" },
  ];

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
    <div className="p-4 min-h-screen bg-gray-50 pb-20">
      {/* Invite Your Friends Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">
          Invite Your Friends
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2 hover:bg-green-700 transition"
          >
            {copied ? <FiCheck /> : "Copy Referral Link"}
          </button>
          <a
            href={`https://wa.me/?text=Join me on Partner Seller Centre: ${referralLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-xl shadow-sm hover:bg-green-600 transition"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-blue-600 text-white p-3 rounded-xl text-center shadow-md">
          <p className="text-[10px] sm:text-xs font-medium opacity-90 leading-tight">
            Total Team Members
          </p>
          <p className="text-xl sm:text-2xl font-bold mt-1">
            {referrals.length}
          </p>
        </div>
        <div className="bg-green-500 text-white p-3 rounded-xl text-center shadow-md">
          <p className="text-[10px] sm:text-xs font-medium opacity-90 leading-tight">
            Active Stores
          </p>
          <p className="text-xl sm:text-2xl font-bold mt-1">
            {referrals.filter((r) => r.accountStatus === "Active").length || 0}
          </p>
        </div>
        <div className="bg-red-500 text-white p-3 rounded-xl text-center shadow-md flex flex-col justify-center relative">
          <p className="text-[10px] sm:text-xs font-medium opacity-90 leading-tight">
            Inactive Stores
          </p>
          <p className="text-xl sm:text-2xl font-bold mt-1">
            {referrals.filter((r) => r.accountStatus !== "Active").length || 0}
          </p>
          <span className="absolute top-1 right-2 text-white font-bold text-xs">
            ×
          </span>
        </div>
      </div>

      {/* Reward Tiers */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Your Rewards Tiers
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {rewardTiers.map((tier, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-3">
                {tier.icon}
                <span className="font-bold text-gray-800">{tier.title}</span>
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                <p>{tier.activeStores} Active Friend Stores</p>
                <p>{tier.funds} Total Friend Store Funds</p>
                <p>{tier.commission} Commission</p>
                {tier.weeklySalary && <p>{tier.weeklySalary} Weekly Salary</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Rates Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Investment Commission */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-green-700 mb-4 border-b pb-2">
            Store's Investment Commission
          </h3>
          <div className="grid grid-cols-2 gap-y-2">
            {investmentCommissions.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between pr-4 odd:border-r odd:mr-4"
              >
                <span className="text-gray-600 font-medium">{item.level}</span>
                <span className="text-green-600 font-bold">{item.rate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Salary Commission */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-blue-700 mb-4 border-b pb-2">
            Weekly Salary Commission
          </h3>
          <div className="grid grid-cols-2 gap-y-2">
            {weeklySalaryCommissions.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between pr-4 odd:border-r odd:mr-4"
              >
                <span className="text-gray-600 font-medium">{item.level}</span>
                <span className="text-blue-600 font-bold">{item.rate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Team Rebates */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="font-bold text-purple-700 mb-4 border-b pb-2">
            Monthly Team Rebates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {monthlyTeamRebates.map((item, idx) => (
              <div
                key={idx}
                className="bg-purple-50 p-2 rounded-lg flex justify-between items-center px-4"
              >
                <span className="text-gray-700 font-medium">{item.stores}</span>
                <span className="text-purple-700 font-bold">{item.rebate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referrals List (Existing) */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaUsers className="text-green-500" /> Your Referrals
        </h2>
        {loading ? (
          <p className="text-gray-500 text-sm italic">
            Loading your referrals...
          </p>
        ) : referrals.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            No referrals yet. Share your link to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {referrals.map((referral) => (
              <div
                key={referral._id}
                className="w-full p-6 border rounded-xl shadow-sm bg-gray-50 hover:shadow-md transition flex flex-col items-center text-center"
              >
                <FaUserCircle className="text-green-400 text-5xl mb-2" />
                <p className="font-bold text-gray-800 text-lg">
                  {referral.name}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Joined on {new Date(referral.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-1 text-green-600 font-semibold text-sm mb-3">
                  <FaGift /> Referral Reward Active
                </div>
                <button
                  onClick={() => toggleDetails(referral._id)}
                  className="text-xs font-bold text-green-700 hover:text-green-800 underline mb-2 transition"
                >
                  {openDetails[referral._id]
                    ? "Hide Participant Details"
                    : "Show Participant Details"}
                </button>
                {openDetails[referral._id] && (
                  <div className="w-full bg-white border border-green-100 rounded-lg p-3 text-left text-sm mt-2 space-y-1">
                    <div>
                      <span className="font-semibold text-gray-500">
                        Store Name:
                      </span>{" "}
                      <span className="text-gray-800 font-medium">
                        {referral.storeName || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500">
                        Email:
                      </span>{" "}
                      <span className="text-gray-800 font-medium">
                        {maskEmail(referral.email) || "Not Provided"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500">
                        Account Level:
                      </span>{" "}
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {referral.accountLevel || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500">
                        Status:
                      </span>{" "}
                      <span
                        className={`${referral.accountStatus === "Active" ? "text-green-600" : "text-red-500"} font-bold`}
                      >
                        {referral.accountStatus || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500">
                        Verified:
                      </span>{" "}
                      <span className="text-gray-800 font-medium">
                        {referral.isKycApproved ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile/Footer info from image */}
      <div className="mt-12 text-center text-gray-500">
        <p className="font-bold text-gray-800">{user?.name || "User"}</p>
        <p className="text-xs">
          Joined on{" "}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Jan 22, 2024"}
        </p>
      </div>
    </div>
  );
}
