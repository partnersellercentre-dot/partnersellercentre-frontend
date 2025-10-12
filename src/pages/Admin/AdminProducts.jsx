import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  deleteProduct,
  updateProduct,
} from "../../api/productsApi";
import Table from "./Table";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await deleteProduct(id, token);
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      setError("Error deleting product");
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setImage(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductToEdit(null);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("price", e.target.price.value);
    formData.append("category", e.target.category.value);
    if (image) formData.append("image", image);

    try {
      // Make the update request
      const updatedProduct = await updateProduct(
        productToEdit._id,
        formData,
        token
      );

      // Replace the old product in the state with the updated product
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productToEdit._id ? updatedProduct.data : product
        )
      );

      handleCloseModal();
    } catch (error) {
      setError("Error updating product");
    }
  };

  const handleCreateProduct = () => {
    navigate("/admin/create-product");
  };

  return (
    <div className="h-full flex flex-col px-4 sm:px-8 py-4 sm:py-6">
      <div className="max-w-full mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-end items-end mb-8 space-y-4 sm:space-y-0">
          <button
            onClick={handleCreateProduct}
            className="bg-green-600 text-xs sm:text-sm py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          >
            Create Product
          </button>
        </div>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          {products.length > 0 ? (
            <Table
              products={products}
              onDelete={handleDeleteProduct}
              onEdit={handleEditProduct}
            />
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">Edit Product</h3>
            <form onSubmit={handleUpdateProduct}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={productToEdit?.name}
                  className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={productToEdit?.price}
                  className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  defaultValue={productToEdit?.category}
                  className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700">
                  Image (optional)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
