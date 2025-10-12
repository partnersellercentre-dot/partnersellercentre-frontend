"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { getMyPurchases, claimProfit } from "../api/purchaseApi";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { releaseBuyerEscrow } from "../api/paymentApi";

export default function OrderCenter() {
  const [currentPage, setCurrentPage] = useState(1);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const totalPages = 5;

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      try {
        const res = await getMyPurchases(token);
        setPurchases(res.data.purchases || []);
      } catch (err) {
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, [token]);

  // Timer to update remaining seconds for all purchases every second
  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const canClaimProfit = (purchase) => {
    const purchaseTime = new Date(purchase.createdAt);
    const now = new Date();
    const secondsSincePurchase = (now - purchaseTime) / 1000;
    return secondsSincePurchase >= 30 && purchase.status === "to_be_paid";
  };

  const handleDetailsClick = (purchase) => {
    navigate(`/products/${purchase.product?._id || purchase._id}`, {
      state: { order: purchase.product || purchase },
    });
  };

  const handleTransfer = async (purchase) => {
    try {
      if (!purchase.buyerEscrowTransactionId) {
        toast.error("Escrow transaction not found for this order.");
        return;
      }
      const res = await releaseBuyerEscrow(
        token,
        purchase.buyerEscrowTransactionId
      );
      toast.success(res.data.message || "Funds transferred to your wallet!");
      // Optionally refresh wallet
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to transfer funds. Try again."
      );
    }
  };

  const handleClaimProfit = async (purchaseId) => {
    setClaiming(purchaseId);
    try {
      const res = await claimProfit(token, purchaseId);
      toast.success(res.data.message || "Profit claimed!");
      // Refresh purchases to update status and balance
      const refreshed = await getMyPurchases(token);
      setPurchases(refreshed.data.purchases || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to claim profit. Please try again."
      );
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-3 w-full">
      <div className="mb-4">
        <h1 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
          Dropshipping in progress — your product is expected to sell within 72
          hours.
        </h1>
      </div>

      <div className="space-y-3 mb-6">
        {loading ? (
          <p className="text-gray-500 text-center text-sm">Loading...</p>
        ) : purchases.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">No orders yet.</p>
        ) : (
          purchases.map((purchase) => {
            const purchaseTime = new Date(purchase.createdAt);
            const now = new Date();
            const secondsSincePurchase = (now - purchaseTime) / 1000;
            const remainingSeconds = Math.ceil(30 - secondsSincePurchase);

            return (
              <div
                key={purchase._id}
                className="bg-white rounded-md shadow-sm border border-gray-200 p-3 sm:p-4 overflow-hidden"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600 truncate">
                    {purchase._id}
                  </span>
                  <span className="text-xs sm:text-sm text-green-600 font-medium">
                    {purchase.status || "Completed"}
                  </span>
                </div>

                {/* Product Info */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                    <img
                      src={purchase.product?.image || "/placeholder.svg"}
                      alt={purchase.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {purchase.product?.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        ${purchase.product?.price?.toFixed(2)} × 1
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center text-xs sm:text-sm space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handleDetailsClick(purchase)}
                    className="flex-1 py-1 px-2 border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => handleTransfer(purchase)}
                    className="flex-1 py-1 px-2 border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded"
                  >
                    Transfer
                  </button>

                  {canClaimProfit(purchase) ? (
                    <button
                      onClick={() => handleClaimProfit(purchase._id)}
                      disabled={claiming === purchase._id}
                      className="flex-1 py-1 px-2 bg-green-500 text-white font-medium hover:bg-green-600 transition-colors rounded"
                    >
                      {claiming === purchase._id
                        ? "Claiming..."
                        : "Claim Profit"}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 py-1 px-2 bg-gray-300 text-gray-600 font-medium rounded cursor-not-allowed"
                    >
                      {purchase.status === "paid"
                        ? "Profit Claimed"
                        : `Wait ${
                            remainingSeconds > 0 ? remainingSeconds : 0
                          }s`}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {purchases.length > 0 && (
        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaAngleDoubleLeft size={12} />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft size={12} />
          </button>

          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded text-xs sm:text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight size={12} />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaAngleDoubleRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
