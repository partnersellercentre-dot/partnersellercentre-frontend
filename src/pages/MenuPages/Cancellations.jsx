import React, { useEffect, useState, useContext } from "react";
import {
  FaTimesCircle,
  FaCalendarAlt,
  FaDollarSign,
  FaBox,
} from "react-icons/fa";
import { getMyPurchases } from "../../api/purchaseApi";
import { AuthContext } from "../../context/AuthContext";

export default function Cancellations() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getMyPurchases(token);
        // Only keep orders with status "cancelled"
        const cancelledOrders = (res.data.purchases || []).filter(
          (order) => order.status === "cancelled"
        );
        setOrders(cancelledOrders);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <h1 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-2">
        <FaTimesCircle className="text-green-500" /> My Cancellations
      </h1>

      {/* Cancelled Orders */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600 text-sm">No cancelled orders found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li
                key={order._id}
                className="flex items-center justify-between py-4"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  {/* If product image exists, show it, else fallback icon */}
                  {order.product?.image ? (
                    <img
                      src={order.product.image}
                      alt={order.product.name}
                      className="w-16 h-16 object-contain rounded-lg border"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg border">
                      <FaBox className="text-2xl text-green-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-gray-800 font-medium">
                      {order.product?.name || "Product"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Cancelled on{" "}
                      {new Date(
                        order.updatedAt || order.createdAt
                      ).toLocaleDateString()}
                    </p>
                    {/* Optionally, show a reason if you store it */}
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-gray-700 font-semibold">
                    <FaDollarSign className="inline mr-1 text-green-600" />
                    {order.amount}
                  </p>
                  <div className="flex items-center gap-1 text-red-600 text-xs font-semibold mt-1">
                    <FaTimesCircle /> Cancelled
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
