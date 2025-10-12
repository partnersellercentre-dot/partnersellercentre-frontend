import React, { useEffect, useState, useContext } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import {
  getAllTransactions,
  approveWithdraw,
  rejectWithdraw,
} from "../../api/paymentApi";
import { toast } from "react-toastify";

function PendingWithdrawal() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchPendingWithdrawals();
  }, []);

  // ✅ Fetch only withdraw-type transactions with status=pending
  const fetchPendingWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await getAllTransactions(token, "pending");
      const filtered =
        res?.transactions?.filter((t) => t.type === "withdraw") || [];

      setWithdrawals(filtered);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      toast.error("Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve handler
  const handleApprove = async (id) => {
    try {
      await approveWithdraw(token, id);
      toast.success("Withdrawal approved successfully!");
      fetchPendingWithdrawals();
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("Failed to approve withdrawal");
    }
  };

  // ✅ Reject handler
  const handleReject = async (id) => {
    try {
      await rejectWithdraw(token, id);
      toast.info("Withdrawal rejected");
      fetchPendingWithdrawals();
    } catch (error) {
      console.error("Reject error:", error);
      toast.error("Failed to reject withdrawal");
    }
  };

  return (
    <div className="w-full text-black p-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Pending Withdrawals
      </h2>

      {loading ? (
        <div className="text-gray-200">Loading...</div>
      ) : withdrawals.length === 0 ? (
        <div className="text-gray-300">No pending withdrawals.</div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-md">
          {/* Scrollable table */}
          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead className="bg-gray-700 text-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Account Name</th>
                  <th className="px-6 py-3">Account Number</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w._id} className="border-b border-gray-600">
                    <td className="px-6 py-3 capitalize">
                      {w.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-3">${w.amount}</td>
                    <td className="px-6 py-3">{w.method || "N/A"}</td>
                    <td className="px-6 py-3">{w.accountName || "N/A"}</td>
                    <td className="px-6 py-3">{w.accountNumber || "N/A"}</td>
                    <td className="px-6 py-3 flex space-x-4">
                      <button
                        onClick={() => handleApprove(w._id)}
                        className="text-green-500 hover:text-green-600"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleReject(w._id)}
                        className="text-red-500 hover:text-red-600"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingWithdrawal;
