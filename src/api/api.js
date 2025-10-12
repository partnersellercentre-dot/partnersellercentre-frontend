// src/api/index.js
import axios from "axios";

// Create an axios instance to manage requests to the backend
const API = axios.create({
  baseURL: "https://pec-app-backend.vercel.app/api",
  // baseURL: "http://localhost:5000/api", // use this for local dev
});

// Send OTP to email
export const sendOtp = (data) => API.post("/auth/send-otp", data); // { email }

// Register using OTP + password
export const registerWithOtp = (data) => API.post("/auth/register-otp", data); // { email, otp, password }

// Login using OTP
export const loginWithOtp = (data) => API.post("/auth/login-otp", data); // { email, otp }

// Register using username + password
export const registerWithUsername = (data) =>
  API.post("/auth/register-username", data); // { username, password, invitationCode }

// Login using username + password
export const loginWithUsername = (data) =>
  API.post("/auth/login-username", data); // { username, password }

// Get user profile (after authentication)
export const getProfile = (token) =>
  API.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });

export const getAdminProfile = (token) =>
  API.get("/admin/admin-profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const registerAdmin = (data) => API.post("/admin/register", data); // { username, password }

// Admin Login using username + password
export const loginAdmin = (data) => API.post("/admin/login", data); // { username, password }

export const getUsers = (token) =>
  API.get("/admin/users", {
    headers: { Authorization: `Bearer ${token}` }, // Pass token for authentication
  });

export const getMyReferrals = (token) =>
  API.get("/referral/my-referrals", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllOrders = (token) =>
  API.get("/admin/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getBasicStats = (token) =>
  API.get("/statistics/basic", {
    headers: { Authorization: `Bearer ${token}` },
  });
// Get total revenue (admin)
export const getTotalRevenue = (token) =>
  API.get("/admin/revenue", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUser = (token, userId) =>
  API.delete(`/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUserStatus = (token, userId, status) =>
  API.put(
    `/admin/users/${userId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

// Update user profile (name + profile image)
export const updateProfile = (token, data) => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.profileImage) formData.append("profileImage", data.profileImage);

  return API.put("/auth/update-profile", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ---------------------- KYC APIs ---------------------- */

// Create new KYC (uploads idFront + idBack to Cloudinary via backend)
export const createKYC = (token, data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("address", data.address);
  formData.append("phone", data.phone);
  formData.append("email", data.email);
  formData.append("idType", data.idType);
  formData.append("idNumber", data.idNumber);

  // ✅ Append files (they go to Cloudinary on backend)
  if (data.idFront instanceof File) {
    formData.append("idFront", data.idFront);
  }
  if (data.idBack instanceof File) {
    formData.append("idBack", data.idBack);
  }

  return API.post("/kyc", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getMyKYC = (token) =>
  API.get("/kyc/my-kyc", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get all KYC records
export const getAllKYC = (token) =>
  API.get("/kyc", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get a single KYC by ID
export const getKYCById = (token, id) =>
  API.get(`/kyc/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Update an existing KYC
export const updateKYC = (token, id, data) => {
  const formData = new FormData();

  // Append updated fields only
  if (data.name) formData.append("name", data.name);
  if (data.address) formData.append("address", data.address);
  if (data.phone) formData.append("phone", data.phone);
  if (data.email) formData.append("email", data.email);
  if (data.idType) formData.append("idType", data.idType);
  if (data.idNumber) formData.append("idNumber", data.idNumber);

  // ✅ Append new files (Cloudinary will replace old ones if new uploaded)
  if (data.idFront instanceof File) {
    formData.append("idFront", data.idFront);
  }
  if (data.idBack instanceof File) {
    formData.append("idBack", data.idBack);
  }

  return API.put(`/kyc/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete a KYC
export const deleteKYC = (token, id) =>
  API.delete(`/kyc/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

/* ---------------------- Settings APIs ---------------------- */

// Get current user settings
export const getSettings = (token) =>
  API.get("/settings", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Update user settings
export const updateSettings = (token, data) =>
  API.put("/settings", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Approve or Reject a KYC (admin only)
export const verifyOrRejectKYC = (token, id, status) =>
  API.put(
    `/admin/verify/${id}`, // ✅ Correct endpoint
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

/* ---------------------- Announcements APIs ---------------------- */

// ✅ Get all announcements (User + Admin)
export const getAnnouncements = () => API.get("/announcements");

// ✅ Create a new announcement (Admin)
export const createAnnouncement = (token, data) =>
  API.post("/announcements", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ✅ Delete announcement (Admin)
export const deleteAnnouncement = (token, id) =>
  API.delete(`/announcements/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

/* ---------------------- Notifications APIs ---------------------- */

// ✅ Get all notifications (Admin only)
export const getNotifications = (token) =>
  API.get("/notifications", {
    headers: { Authorization: `Bearer ${token}` },
  });

// ✅ Mark a notification as read
export const markNotificationRead = (token, id) =>
  API.put(
    `/notifications/${id}/read`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

// ✅ Delete a notification
export const deleteNotification = (token, id) =>
  API.delete(`/notifications/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
