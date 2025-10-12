"use client";

import { useContext, useState } from "react";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import { SiTether, SiVisa, SiMastercard } from "react-icons/si";
import { useNavigate } from "react-router-dom"; // ✅ for navigation
import { AuthContext } from "../context/AuthContext";
import { depositRequest } from "../api/paymentApi";

export default function PaymentConfirmationModal({
  isOpen,
  onClose,
  amount,
  orderNumber,
  onConfirm,
}) {
  const [activeTab, setActiveTab] = useState("online");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  if (!isOpen) return null;

  const handlePayment = () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }
    onConfirm(selectedPayment);
  };

  const offlineOptions = [
    { id: 1, name: "Bank Transfer", img: "/public/bank.png" },
    {
      id: 2,
      name: "Easypaisa",
      img: "/Easypaisa-logo.png",
    },
    {
      id: 3,
      name: "JazzCash",
      img: "/new-Jazzcash-logo.png",
    },
    {
      id: 4,
      name: "Bkash",
      img: "/bkash.webp",
    },
    { id: 5, name: "Nagad", img: "/nagad.png" },
    { id: 6, name: "UPI", img: "/upi.jpg" },
  ];

  const handleOfflineDeposit = async (opt) => {
    try {
      // Prepare deposit data
      const depositData = {
        amount: Number(amount),
        method: opt.name,
        screenshot: null, // Optional, can add later
      };
      // Call API to create pending deposit
      await depositRequest(token, depositData);
      // Navigate to chat-support page
      navigate("/chat-support", {
        state: { method: opt.name, amount },
      });
    } catch (error) {
      alert("Failed to create deposit request. Please try again.");
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Payment Confirmation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Order Details */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">
              Recharge order number:{" "}
              <span className="text-gray-900">{orderNumber}</span>
            </p>
            <p className="text-sm text-gray-600">
              Deposit amount:{" "}
              <span className="text-red-500 font-semibold">${amount}</span>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("online")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "online"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Online deposit
            </button>
            <button
              onClick={() => setActiveTab("offline")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "offline"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Offline deposit
            </button>
          </div>

          {/* Online Deposit Options */}
          {activeTab === "online" && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Payment options
              </h3>

              {/* Tether TRC20 Option */}
              <div
                onClick={() => setSelectedPayment("trc20")}
                className={`relative bg-green-500 rounded-md p-4 mb-3 cursor-pointer transition-all ${
                  selectedPayment === "trc20" ? "ring-2 ring-green-600" : ""
                }`}
              >
                <div className="flex items-center justify-between text-white">
                  <div>
                    <div className="font-semibold text-lg">Tether</div>
                    <div className="text-sm opacity-90">USDT (TRC20)</div>
                  </div>
                  <img
                    src="/tether-usdt-logo.png" // Existing logo
                    alt="USDT TRC20"
                    className="w-16 h-auto"
                  />
                </div>
                {selectedPayment === "tether-trc20" && (
                  <div className="absolute top-2 right-2">
                    <FaCheckCircle className="text-white" size={20} />
                  </div>
                )}
              </div>

              {/* Tether BEP20 Option */}
              <div
                onClick={() => setSelectedPayment("bep20")}
                className={`relative border text-green-500 border-green-500 p-4 rounded-md mb-3 cursor-pointer transition-all ${
                  selectedPayment === "bep20" ? "ring-2 ring-green-600" : ""
                }`}
              >
                <div className="flex items-center justify-between text-black">
                  <div>
                    <div className="font-semibold text-lg">Tether</div>
                    <div className="text-sm opacity-90">USDT (BEP20)</div>
                  </div>
                  <div className="w-8 h-8 border-2 border-white rounded flex items-center justify-center text-black text-xs">
                    <img
                      src="/bdep.webp" // Existing logo
                      alt="USDT TRC20"
                      className="w-32 "
                    />{" "}
                  </div>
                </div>
                {selectedPayment === "tether-bep20" && (
                  <div className="absolute top-2 right-2">
                    <FaCheckCircle className="text-white" size={20} />
                  </div>
                )}
              </div>

              {/* Card Options */}
              <div
                onClick={() => setSelectedPayment("card")}
                className={`relative bg-gray-100 p-4 cursor-pointer transition-all ${
                  selectedPayment === "card" ? "ring-2 ring-green-600" : ""
                }`}
              >
                <div className="flex items-center justify-center space-x-4">
                  <SiVisa size={32} />
                  <SiMastercard size={32} />
                </div>
                {selectedPayment === "card" && (
                  <div className="absolute top-2 right-2">
                    <FaCheckCircle className="text-green-600" size={20} />
                  </div>
                )}
              </div>

              {/* Confirm Button */}
              <button
                onClick={() => handlePayment(selectedPayment)}
                className="w-full mt-4 py-3 font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Offline Deposit Options */}
          {activeTab === "offline" && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Select a method
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {offlineOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className="border border-green-500  p-3 flex flex-col items-center justify-center rounded-lg cursor-pointer"
                    onClick={() => handleOfflineDeposit(opt)} // <-- Call handler
                  >
                    <img
                      src={opt.img}
                      alt={opt.name}
                      className="w-12 h-12 object-contain mb-2"
                    />
                    <p className="text-xs font-normal text-green-500 text-center">
                      {opt.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
