import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ReferralLanding() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      // ✅ Save referral code locally
      localStorage.setItem("referralCode", code);
      console.log("Referral code saved:", code);

      // ✅ Redirect after saving (to signup, or homepage)
      setTimeout(() => navigate("/register"), 1000);
    }
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Welcome to Partner Seller Centre!
      </h1>
      <p className="text-gray-700">
        You were referred by someone — getting things ready for you...
      </p>
    </div>
  );
}
