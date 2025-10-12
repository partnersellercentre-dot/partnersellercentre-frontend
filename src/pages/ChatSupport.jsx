import React, { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

function ChatSupport() {
  useEffect(() => {
    const crispId = import.meta.env.VITE_CRISP_WEBSITE_ID;

    if (!crispId) {
      console.error("Crisp website ID is not set!");
      return;
    }

    Crisp.configure(crispId);
  }, []);

  const openChat = () => {
    Crisp.chat.open();
  };

  const steps = [
    {
      title: "Initiate Recharge Request",
      details: [
        "Visit our website and fill out the recharge request form.",
        "Contact our customer support team via phone, email, or live chat.",
      ],
    },
    {
      title: "Provide Required Details",
      details: [
        "Account number/username",
        "Recharge amount",
        "Payment method (bank deposit, cash payment, cheque/money order)",
      ],
    },
    {
      title: "Make Payment",
      details: [
        "Bank Deposit: Deposit cash into our designated bank account:",
        "  - Bank Name: [Insert Bank Name]",
        "  - Account Number: [Insert Account Number]",
        "  - Branch: [Insert Branch]",
        "Cash Payment: Visit our physical location or authorized payment agent.",
        "Cheque/Money Order: Send to our office address: [Insert Address]",
      ],
    },
    {
      title: "Payment Confirmation",
      details: [
        "Wait for our customer support team to verify your payment.",
        "Receive recharge credit in your account once payment is confirmed.",
      ],
    },
  ];

  const importantDetails = [
    "Minimum/Maximum Recharge Limit: PKR [Insert Amount] to PKR [Insert Amount]",
    "Recharge Fees: [Insert Fee Details]",
    "Refund Policy: [Insert Refund Policy]",
    "Recharge Timeframe: Recharge credits will be updated within [Insert Timeframe] hours after payment confirmation",
  ];

  const additionalRequirements = [
    "Transaction ID: Provide transaction ID or payment receipt to our customer support team.",
    "Payment Receipt: Keep a copy of payment receipt for future reference.",
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-green-200">
      <h2 className="text-2xl font-bold text-green-600 mb-6 text-start">
        Offline Recharge Instructions
      </h2>

      {steps.map((step, index) => (
        <div
          key={index}
          className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg mb-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            {index + 1}. {step.title}
          </h3>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            {step.details.map((detail, i) => (
              <li key={i}>{detail}</li>
            ))}
          </ul>
        </div>
      ))}

      <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg mb-4 shadow-sm">
        <h3 className="text-lg font-semibold text-green-700 mb-2">
          Important Details
        </h3>
        <ul className="list-disc list-inside text-gray-800 space-y-1">
          {importantDetails.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg mb-6 shadow-sm">
        <h3 className="text-lg font-semibold text-green-700 mb-2">
          Additional Requirements
        </h3>
        <ul className="list-disc list-inside text-gray-800 space-y-1">
          {additionalRequirements.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={openChat}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md"
      >
        Chat with Support
      </button>
    </div>
  );
}

export default ChatSupport;
