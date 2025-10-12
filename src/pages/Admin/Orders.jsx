"use client";

import React, { useEffect, useState, useContext } from "react";
import { FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { getAllPurchases, deletePurchase } from "../../api/purchaseApi";
import { AuthContext } from "../../context/AuthContext";

function Table({ orders, onDelete }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-700 text-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">Order #</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-center">Claimed</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-all duration-200"
                >
                  <td className="px-6 py-3">
                    {order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-3">{order.user?.name || "N/A"}</td>
                  <td className="px-6 py-3">{order.product?.name || "N/A"}</td>
                  <td className="px-6 py-3 font-medium text-green-400">
                    ${order.amount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* ✅ Claimed Icon only */}
                  <td className="px-6 py-3 text-center">
                    {order.paymentClaimedAt ? (
                      <FaCheck className="text-green-500 text-lg" />
                    ) : (
                      <FaTimes className="text-red-500 text-lg" />
                    )}
                  </td>

                  {/* ✅ Action: Bin only */}
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => onDelete(order._id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Delete Order"
                    >
                      <FaTrashAlt className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-400 italic"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Orders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getAllPurchases(token);
        setOrders(res.data.purchases || []);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // ✅ Delete handler
  const handleDeleteOrder = async (id) => {
    try {
      await deletePurchase(token, id);
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-300">Loading...</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-medium">{error}</p>
    );

  return (
    <div className="min-h-screen  flex flex-col justify-start items-center px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-7xl w-full space-y-6">
        <h1 className="text-2xl font-semibold text-white mb-4">
          Orders Overview
        </h1>
        <Table orders={orders} onDelete={handleDeleteOrder} />
      </div>
    </div>
  );
}
