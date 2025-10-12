import React, { useEffect, useState, useContext } from "react";
import { FaBox, FaCalendarAlt, FaDollarSign, FaTruck } from "react-icons/fa";
import { getMyPurchases } from "../../api/purchaseApi";
import { AuthContext } from "../../context/AuthContext";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getMyPurchases(token);
        // Only keep orders with status "paid"
        const paidOrders = (res.data.purchases || []).filter(
          (order) => order.status === "paid"
        );
        setOrders(paidOrders);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const statusColor = {
    paid: "text-green-600 bg-green-50",
    cancelled: "text-red-600 bg-red-50",
    to_be_paid: "text-yellow-600 bg-yellow-50",
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-700 mb-6">My Orders</h1>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center">No paid orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition"
            >
              {/* Left: Product + ID */}
              <div>
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaBox className="text-green-600" /> {order.product?.name}
                </h2>
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
              </div>

              {/* Middle: Date + Total */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <FaCalendarAlt className="text-green-600" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <FaDollarSign className="text-green-600" />${order.amount}
                </div>
              </div>

              {/* Right: Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColor[order.status]
                  }`}
                >
                  Paid
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
