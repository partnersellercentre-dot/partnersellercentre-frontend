import React, { useContext, useEffect, useState } from "react";
import { getPendingTransactions, approveDeposit } from "../../api/paymentApi";
import { AuthContext } from "../../context/AuthContext";

function PendingDeposit() {
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const [editAmounts, setEditAmounts] = useState({}); // { [id]: value }

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      try {
        const res = await getPendingTransactions(token);
        setPendingDeposits(res.data.transactions || []);
      } catch (err) {
        alert("Failed to fetch pending deposits");
      }
      setLoading(false);
    };
    fetchPending();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      const editedAmount = editAmounts[id];
      await approveDeposit(
        token,
        id,
        editedAmount !== undefined ? Number(editedAmount) : undefined
      );
      setPendingDeposits((prev) => prev.filter((t) => t._id !== id));
      alert("Deposit approved!");
    } catch (err) {
      alert("Failed to approve deposit");
    }
  };

  const handleReject = (id) => {
    // here you would call rejectDeposit API
    setPendingDeposits((prev) => prev.filter((t) => t._id !== id));
    alert("Deposit rejected!");
  };

  return (
    <div className="text-black w-full h-screen p-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-6">Pending Deposits</h2>
      {loading ? (
        <div>Loading...</div>
      ) : pendingDeposits.length === 0 ? (
        <div>No pending deposits.</div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-md">
          <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-left text-gray-300">
              <thead className="bg-gray-700 text-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 min-w-[120px]">User</th>
                  <th className="px-4 py-3 min-w-[100px]">Amount</th>
                  <th className="px-4 py-3 min-w-[100px]">Method</th>
                  <th className="px-4 py-3 min-w-[150px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDeposits.map((dep) => (
                  <tr key={dep._id} className="border-b border-gray-600">
                    <td className="px-4 py-3">{dep.user?.name || dep.user}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="1"
                        value={
                          editAmounts[dep._id] !== undefined
                            ? editAmounts[dep._id]
                            : dep.amount
                        }
                        onChange={(e) =>
                          setEditAmounts((prev) => ({
                            ...prev,
                            [dep._id]: e.target.value,
                          }))
                        }
                        className="w-24 px-2 py-1 rounded bg-gray-700 text-white border border-gray-500"
                      />
                    </td>
                    <td className="px-4 py-3">{dep.method}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleApprove(dep._id)}
                        className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(dep._id)}
                        className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        Reject
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

export default PendingDeposit;
