import axios from "axios";

const API = axios.create({
  baseURL: "https://partnersellerbackend.vercel.app/api", // Adjust as per your deployed backend
  // baseURL: "http://localhost:5000/api",
});

export const createNowPayment = (token, data) =>
  API.post("/nowpayments/create", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
