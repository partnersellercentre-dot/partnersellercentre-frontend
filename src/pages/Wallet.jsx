"use client";

import { useContext, useEffect, useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { PiHandDepositFill } from "react-icons/pi";
import { MdAccountBalance } from "react-icons/md";
import BottomNavigation from "../components/BottomNavigation";
import PaymentConfirmationModal from "../pages/PaymentConfirmation";
import PaymentQRCode from "./PaymentQRCode";
import WithdrawModal from "../components/WithdrawModal"; // <-- import your new modal
import { AuthContext } from "../context/AuthContext";
import { getMyTransactions } from "../api/paymentApi";
import { initDeposit } from "../api/deposit";

export default function Wallet() {
  const { user, token } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("account");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false); // <-- new
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [currentOrderNumber, setCurrentOrderNumber] = useState("");
  const [userBalance, setUserBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const inTransaction = transactions
    .filter(
      (txn) =>
        txn.type === "escrow" &&
        txn.status === "pending" &&
        txn.direction === "out"
    )
    .reduce((sum, txn) => sum + txn.amount, 0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await getMyTransactions(token);

        if (res.data.user && typeof res.data.user.balance === "number") {
          setUserBalance(res.data.user.balance);
        }

        if (Array.isArray(res.data.transactions)) {
          setTransactions(res.data.transactions);
        }
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };
    fetchBalance();
  }, [token, showPaymentModal, showDepositModal, showWithdrawModal]);

  const handleDeposit = () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const orderNumber = generateOrderNumber();
    setCurrentOrderNumber(orderNumber);
    setShowDepositModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    setDepositAmount("");
  };

  const handleConfirmPayment = async (selectedPayment) => {
    if (selectedPayment === "trc20" || selectedPayment === "bep20") {
      try {
        const res = await initDeposit({
          userId: user._id,
          amount: depositAmount,
          network: selectedPayment, // <-- send network
        });

        const { orderId, wallet } = res.data;

        setPaymentDetails({
          amount: depositAmount,
          orderNumber: orderId,
          address: wallet,
        });

        setShowPaymentModal(false);
        setShowQRCode(true);
      } catch (err) {
        console.error("Deposit init failed:", err);
        alert("Failed to initiate deposit");
      }
    } else {
      alert("Other methods not implemented yet.");
    }
  };

  const generateOrderNumber = () => {
    return `${new Date().getFullYear()}${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}${String(
      new Date().getHours()
    ).padStart(2, "0")}${String(new Date().getMinutes()).padStart(
      2,
      "0"
    )}${String(new Date().getSeconds()).padStart(2, "0")}${Math.floor(
      Math.random() * 10000
    )}`;
  };

  const handleQRCodeClose = () => {
    setShowQRCode(false);
    setDepositAmount("");
    setCurrentOrderNumber("");
    setPaymentDetails({});
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow py-6 pb-20 w-full max-w-full mx-auto">
        {/* My Assets Section */}
        <div className="bg-green-500 rounded-3xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MdAccountBalance className="mr-2 text-white" /> My Assets
          </h2>
          <div className="grid grid-cols-2 gap-6 mb-6 text-white">
            <div>
              <div className="text-3xl font-bold">${userBalance}</div>
              <div className="text-sm">Available Amount</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                ${inTransaction.toFixed(2)}
              </div>
              <div className="text-sm">In transaction</div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowDepositModal(true)}
              className="flex items-center justify-center bg-white text-black font-semibold py-3 px-4 transition-colors"
            >
              <PiHandDepositFill className="mr-2" /> Deposit
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)} // <-- open withdraw modal
              className="flex items-center justify-center bg-white text-black font-semibold py-3 px-4 transition-colors"
            >
              <FaMoneyBillWave className="mr-2" /> Withdrawal
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            {["account", "deposit", "withdrawal"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === tab
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "account"
                  ? "Account details"
                  : tab === "deposit"
                  ? "Deposit record"
                  : "Cash withdrawal records"}
              </button>
            ))}
          </div>

          <div className="p-4 flex flex-col space-y-6">
            {activeTab === "account" && (
              <div className="text-center text-gray-500">
                Account details coming soon
              </div>
            )}

            {activeTab === "deposit" && (
              <>
                {transactions.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No deposit records yet
                  </div>
                ) : (
                  transactions.map((txn) => (
                    <div
                      key={txn._id}
                      className="bg-white rounded-lg shadow-md border-l-4 border-green-500 p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-600">
                            {txn.type}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(txn.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="ml-0 md:ml-4">
                        <div className="text-lg font-bold text-gray-900 mb-1">
                          {txn.status}
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Operation amount</span>
                          <span
                            className={
                              txn.amount < 0 ? "text-red-500" : "text-green-500"
                            }
                          >
                            {txn.amount > 0 ? "+" : ""}
                            {txn.amount}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Method</span>
                          <span>{txn.method}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === "withdrawal" && (
              <>
                {transactions.filter((txn) => txn.type === "withdraw")
                  .length === 0 ? (
                  <div className="text-center text-gray-500">
                    No withdrawal records yet
                  </div>
                ) : (
                  transactions
                    .filter((txn) => txn.type === "withdraw")
                    .map((txn) => (
                      <div
                        key={txn._id}
                        className="bg-white rounded-lg shadow-md border-l-4 border-yellow-500 p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                            <span className="text-sm text-gray-600">
                              {txn.method || "N/A"}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(txn.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="ml-0 md:ml-4">
                          <div
                            className={`text-lg font-bold mb-1 ${
                              txn.status === "approved"
                                ? "text-green-600"
                                : txn.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {txn.status.charAt(0).toUpperCase() +
                              txn.status.slice(1)}
                          </div>

                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Withdrawal amount</span>
                            <span className="text-red-500">- {txn.amount}</span>
                          </div>

                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Account Name</span>
                            <span>{txn.accountName || "N/A"}</span>
                          </div>

                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Account Number</span>
                            <span>{txn.accountNumber || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 w-96 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Deposit Amount</h2>
            <div className="flex items-center mb-4 border px-3 py-2">
              <span className="mr-2 text-gray-500">$</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full outline-none text-gray-900"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[30, 100, 200, 500, 1000, 5000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(amt)}
                  className={`px-2 py-2 rounded-md font-semibold text-white ${
                    depositAmount == amt
                      ? "bg-green-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>
            <button
              onClick={handleDeposit}
              className="w-full bg-green-500 text-white rounded-md font-semibold py-2 transition-colors hover:bg-green-600"
            >
              Deposit
            </button>
            <button
              onClick={() => setShowDepositModal(false)}
              className="mt-2 w-full bg-gray-200 text-gray-700 rounded-md font-semibold py-2 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <WithdrawModal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={() => setShowWithdrawModal(false)} // refresh after success
        />
      )}

      {/* Payment Confirmation Modal */}
      <PaymentConfirmationModal
        isOpen={showPaymentModal}
        onClose={handlePaymentModalClose}
        amount={depositAmount}
        onConfirm={handleConfirmPayment}
        orderNumber={currentOrderNumber}
      />

      {/* Payment QR Code Modal */}
      {showQRCode && (
        <PaymentQRCode
          amount={paymentDetails.amount}
          orderNumber={paymentDetails.orderNumber}
          address={paymentDetails.address}
          onClose={handleQRCodeClose}
        />
      )}

      <BottomNavigation />
    </div>
  );
}
