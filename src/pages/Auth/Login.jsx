"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiBell, FiUser } from "react-icons/fi";
import {
  sendOtp,
  loginWithOtp,
  loginWithUsername,
  loginAdmin,
} from "../../api/api";
import { toast } from "react-toastify";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Email");
  const [agreed, setAgreed] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [role, setRole] = useState("user");

  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    username: "",
    password: "",
  });

  // Step 1: Obtain OTP
  const handleObtainCode = async () => {
    if (!formData.email) return toast.error("Enter your email first!");

    try {
      await sendOtp({ email: formData.email });
      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  // Step 2: Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreed) return toast.warning("Please agree to the policies first!");

    // ✅ Email OTP login
    if (activeTab === "Email") {
      if (!otpSent) return toast.error("Please obtain OTP first!");
      if (!formData.verificationCode) return toast.error("Enter OTP please!");

      try {
        const res = await loginWithOtp({
          email: formData.email,
          otp: formData.verificationCode,
        });

        login(res.data.token, res.data.user.role);
        toast.success("Login successful 🎉");

        if (res.data.user.role === "user") {
          navigate("/products");
        } else {
          navigate("/admin");
        }
      } catch (err) {
        toast.error("Login failed");
      }
    }

    // ✅ Username + Password login
    if (activeTab === "Account") {
      if (!formData.username) return toast.error("Enter your username!");
      if (!formData.password) return toast.error("Enter your password!");

      try {
        let res;
        let userRole = role;

        if (role === "admin") {
          res = await loginAdmin({
            username: formData.username,
            password: formData.password,
          });
          userRole = res.data.admin.role;
        } else {
          res = await loginWithUsername({
            username: formData.username,
            password: formData.password,
          });
          userRole = res.data.user.role;
        }

        login(res.data.token, userRole);
        toast.success("Login successful 🎉");

        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/products");
        }
      } catch (err) {
        toast.error(err.response?.data?.error || "Account login failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">◊</span>
          </div>
          <span className="text-green-600 font-bold text-xl">PSC</span>
        </div>
        <div className="flex items-center space-x-4">
          <FiBell className="text-gray-600" size={20} />
          <FiUser className="text-gray-600" size={20} />
          <div className="flex items-center space-x-1">
            <img src="/united-kingdom.png" alt="UK" className="w-5 h-3" />
            <span className="text-sm text-gray-600">EN</span>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="px-4 py-6 flex-1 w-full">
        <div className="max-w-7xl mx-auto w-full p-8">
          <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
            Login to Your Account
          </h1>

          {/* Tabs */}
          <div className="flex mb-6">
            {["Account", "Mobile", "Email"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-green-500 text-green-600 font-medium"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Account Login */}
          {activeTab === "Account" && (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Enter your username"
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  required
                />
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Agreement */}
              <div className="flex items-start space-x-2 py-2">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="agreement" className="text-sm text-gray-600">
                  Read and agree 'Service agreement' and 'Privacy policy'?
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium mt-6"
              >
                Login
              </button>
            </form>
          )}

          {/* Email Login */}
          {activeTab === "Email" && (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                  required
                />
              </div>

              {/* OTP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                  <input
                    type="text"
                    value={formData.verificationCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        verificationCode: e.target.value,
                      })
                    }
                    placeholder="Enter OTP"
                    className="flex-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleObtainCode}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors w-full sm:w-auto"
                  >
                    {otpSent ? "Resend OTP" : "Get Code"}
                  </button>
                </div>
              </div>

              {/* Agreement */}
              <div className="flex items-start space-x-2 py-2">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="agreement" className="text-sm text-gray-600">
                  Read and agree 'Service agreement' and 'Privacy policy'?
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium mt-6"
              >
                Login
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
