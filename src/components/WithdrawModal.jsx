"use client";

import { useContext, useState } from "react";
import { FaTimes, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import { SiTether, SiVisa, SiMastercard } from "react-icons/si";
import { AuthContext } from "../context/AuthContext";
import { withdrawRequest } from "../api/paymentApi";

export default function WithdrawModal({ isOpen, onClose, onSuccess }) {
  const { token } = useContext(AuthContext);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [form, setForm] = useState({
    accountName: "",
    accountNumber: "",
    amount: "",
    method: "",
  });
  const [loading, setLoading] = useState(false);
  const fee = form.amount
    ? Math.round(Number(form.amount) * 0.05 * 100) / 100
    : 0;
  const netAmount = form.amount
    ? Math.round((Number(form.amount) - fee) * 100) / 100
    : 0;
  if (!isOpen) return null;

  const withdrawalMethods = [
    { id: 1, name: "Bank Transfer", img: "/bank.png" },
    { id: 2, name: "Easypaisa", img: "/Easypaisa-logo.png" },
    { id: 3, name: "JazzCash", img: "/new-Jazzcash-logo.png" },
    { id: 4, name: "Bkash", img: "/bkash.webp" },
    { id: 5, name: "Nagad", img: "/nagad.png" },
    { id: 6, name: "UPI", img: "/upi.jpg" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWithdraw = async () => {
    const { accountName, accountNumber, amount, method } = form;

    if (!accountName || !accountNumber || !amount || !method) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      await withdrawRequest(token, {
        amount: Number(amount),
        method,
        accountName,
        accountNumber,
      });
      alert("Withdrawal request submitted successfully");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to submit withdrawal request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaMoneyBillWave className="mr-2 text-green-500" /> Withdraw Funds
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-4 space-y-4">
          {/* Account Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              name="accountName"
              value={form.accountName}
              onChange={handleChange}
              placeholder="Enter account name"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Withdraw Amount
            </label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <span className="mr-2 text-gray-500">$</span>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full outline-none text-gray-900"
                min="1"
              />
            </div>
            {form.amount && Number(form.amount) > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <div>
                  Fee (5%): <span className="text-red-500">${fee}</span>
                </div>
                <div>
                  Net Amount:{" "}
                  <span className="text-green-600">${netAmount}</span>
                </div>
              </div>
            )}
          </div>

          {/* Withdrawal Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Withdrawal Method
            </label>
            <div className="space-y-3">
              {/* Tether TRC20 Option */}
              <div
                onClick={() => {
                  setSelectedPayment("trc20");
                  setForm({ ...form, method: "USDT (TRC20)" });
                }}
                className={`relative bg-green-500 rounded-md p-4 cursor-pointer transition-all ${
                  selectedPayment === "trc20" ? "ring-2 ring-green-600" : ""
                }`}
              >
                <div className="flex items-center justify-between text-white">
                  <div>
                    <div className="font-semibold text-lg">Tether</div>
                    <div className="text-sm opacity-90">USDT (TRC20)</div>
                  </div>
                  <img
                    src="/tether-usdt-logo.png"
                    alt="USDT TRC20"
                    className="w-16 h-auto"
                  />
                </div>
                {selectedPayment === "trc20" && (
                  <div className="absolute top-2 right-2">
                    <FaCheckCircle className="text-white" size={20} />
                  </div>
                )}
              </div>

              {/* Tether BEP20 Option */}
              <div
                onClick={() => {
                  setSelectedPayment("bep20");
                  setForm({ ...form, method: "USDT (BEP20)" });
                }}
                className={`relative border text-green-500 border-green-500 p-4 rounded-md cursor-pointer transition-all ${
                  selectedPayment === "bep20" ? "ring-2 ring-green-600" : ""
                }`}
              >
                <div className="flex items-center justify-between text-black">
                  <div>
                    <div className="font-semibold text-lg">Tether</div>
                    <div className="text-sm opacity-90">USDT (BEP20)</div>
                  </div>
                  <div className="w-8 h-8 border-2 border-white rounded flex items-center justify-center text-black text-xs">
                    <img src="/bdep.webp" alt="USDT BEP20" className="w-32" />
                  </div>
                </div>
                {selectedPayment === "bep20" && (
                  <div className="absolute top-2 right-2">
                    <FaCheckCircle className="text-white" size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="w-full py-3 font-medium bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            {loading ? "Submitting..." : "Submit Withdrawal Request"}
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="w-full py-3 font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
