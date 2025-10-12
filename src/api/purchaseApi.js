/* ---------------------- PURCHASE APIs ---------------------- */
import axios from "axios";

const API = axios.create({
  baseURL: "https://pec-app-backend.vercel.app/api",
  // baseURL: "http://localhost:5000/api", // Use local backend for dev
});
export const buyProduct = (token, data) =>
  API.post("/purchases/buy", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// User fetch own purchases
export const getMyPurchases = (token) =>
  API.get("/purchases/my", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Admin fetch all purchases
export const getAllPurchases = (token) =>
  API.get("/purchases/all", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const claimProfit = (token, purchaseId) =>
  API.post(
    "/purchases/claim-profit",
    { purchaseId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const deletePurchase = (token, id) =>
  API.delete(`/purchases/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
