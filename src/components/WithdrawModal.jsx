"use client";

import { useContext, useState } from "react";
import { toast } from "react-toastify";
import {
  FaTimes,
  FaMoneyBillWave,
  FaCheckCircle,
  FaChevronDown,
} from "react-icons/fa";
import { SiTether, SiVisa, SiMastercard } from "react-icons/si";
import { AuthContext } from "../context/AuthContext";
import { withdrawRequest } from "../api/paymentApi";

export default function WithdrawModal({
  isOpen,
  onClose,
  onSuccess,
  withdrawableBalance,
  isRestricted,
}) {
  const { token, user } = useContext(AuthContext);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [form, setForm] = useState({
    withdrawalAddress: "",
    amount: "",
    method: "",
  });
  const [loading, setLoading] = useState(false);
  const fee = form.amount
    ? Math.round(Number(form.amount) * 0.038 * 100) / 100
    : 0;
  const netAmount = form.amount
    ? Math.round((Number(form.amount) - fee) * 100) / 100
    : 0;
  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWithdraw = async () => {
    const { withdrawalAddress, amount, method } = form;

    if (!withdrawalAddress || !amount || !method) {
      toast.warning("Please fill in all fields before submitting.");
      return;
    }

    if (Number(amount) <= 0) {
      toast.warning("Please enter a valid amount");
      return;
    }

    if (Number(amount) < 30) {
      toast.warning("Minimum withdrawal amount is 30 USDT");
      return;
    }

    const maxAvailable = isRestricted ? withdrawableBalance : user?.balance;
    if (Number(amount) > maxAvailable) {
      toast.error("Insufficient withdrawable balance");
      return;
    }

    try {
      setLoading(true);
      await withdrawRequest(token, {
        amount: Number(amount),
        method,
        accountName: "Crypto Wallet",
        accountNumber: withdrawalAddress,
      });
      toast.success("Withdrawal request submitted successfully");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit withdrawal request");
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
          {/* Guidelines */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              Withdrawal Guidelines
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-yellow-500 shrink-0" size={12} />
                <span>Minimum withdrawal amount: 30 USDT</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-yellow-500 shrink-0" size={12} />
                <span>Network handling fees: 3.8%</span>
              </li>
            </ul>
          </div>

          {/* Withdrawal Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Withdrawal Address
            </label>
            <input
              type="text"
              name="withdrawalAddress"
              value={form.withdrawalAddress}
              onChange={handleChange}
              placeholder="Enter your wallet address"
              className="w-full border rounded-md px-3 py-2 outline-none text-gray-900"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Withdraw Amount (Available: $
              {isRestricted
                ? withdrawableBalance?.toFixed(2)
                : user?.balance?.toFixed(2) || 0}
              )
            </label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <span className="mr-2 text-gray-500">$</span>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="30"
                className="w-full outline-none text-gray-900"
                min="30"
              />
            </div>
            {isRestricted && (
              <p className="text-[10px] text-gray-500 mt-1">
                * Withdrawal is restricted to earned commissions and bonuses
                only.
              </p>
            )}
            {form.amount && Number(form.amount) > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <div>
                  Network handling fees (3.8%):{" "}
                  <span className="text-red-500">${fee}</span>
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
            <div className="grid grid-cols-2 gap-3">
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
                    <img
                      src="/bdep.webp"
                      alt="USDT BEP20"
                      className="w-32 "
                    />{" "}
                  </div>
                </div>
                {selectedPayment === "bep20" && (
                  <div className="absolute top-2 right-2">
                    <FaCheckCircle className="text-green-600" size={20} />
                  </div>
                )}
              </div>

              {/* Easypaisa Option */}
              <div
                onClick={() => {
                  setSelectedPayment("easypaisa");
                  setForm({ ...form, method: "Easypaisa" });
                }}
                className={`relative border text-blue-600 border-blue-500 p-4 rounded-md cursor-pointer transition-all ${
                  selectedPayment === "easypaisa" ? "ring-2 ring-blue-600" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">Easypaisa</div>
                    <div className="text-sm opacity-90">PKR Wallet</div>
                  </div>
                  <img
                    src="/Easypaisa-logo.png"
                    alt="Easypaisa"
                    className="w-16 h-auto"
                  />
                </div>
                {selectedPayment === "easypaisa" && (
                  <div className="absolute top-2 right-2">
                    <FaCheckCircle className="text-blue-600" size={20} />
                  </div>
                )}
              </div>

              {/* JazzCash Option */}
              <div
                onClick={() => {
                  setSelectedPayment("jazzcash");
                  setForm({ ...form, method: "JazzCash" });
                }}
                className={`relative border text-red-600 border-red-500 p-4 rounded-md cursor-pointer transition-all ${
                  selectedPayment === "jazzcash" ? "ring-2 ring-red-600" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">JazzCash</div>
                    <div className="text-sm opacity-90">PKR Wallet</div>
                  </div>
                  <img
                    src="/new-Jazzcash-logo.png"
                    alt="JazzCash"
                    className="w-16 h-auto"
                  />
                </div>
                {selectedPayment === "jazzcash" && (
                  <div className="absolute top-2 right-2">
                    <FaCheckCircle className="text-red-600" size={20} />
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
