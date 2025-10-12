import axios from "axios";

const API = axios.create({
  baseURL: "https://pec-app-backend.vercel.app/api",
  // baseURL: "http://localhost:5000/api", // Use local backend for dev
});

// Create a new product (Admin only)
export const createProduct = (data, token) =>
  API.post("/products/create", data, {
    headers: { Authorization: `Bearer ${token}` }, // REMOVE Content-Type
  });
// Get all products
export const getProducts = () => API.get("/products");
// Get products by category
export const getProductsByCategory = (category) =>
  API.get(`/products/category/${category}`);
// Get a single product by ID
export const getProductById = (id) => API.get(`/products/${id}`);

// Update an existing product (Admin only)
export const updateProduct = (id, data, token) =>
  API.put(`/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Delete a product (Admin only)
export const deleteProduct = (id, token) =>
  API.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
