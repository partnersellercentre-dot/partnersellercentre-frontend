import { toast } from "react-toastify";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api/productsApi";

function CreateProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const productFormData = new FormData();
    productFormData.append("name", formData.name);
    productFormData.append("price", formData.price);
    productFormData.append("category", formData.category);
    if (formData.image) {
      productFormData.append("image", formData.image);
    }

    try {
      const response = await createProduct(productFormData, token);
      toast.success("✅ Product created successfully!");
      navigate("/admin/admin-products");
    } catch (error) {
      // Show generic error message
      toast.error("❌ Failed to create product. Please try again.");
      console.error("Error creating product:", error);
    }
  };

  const handleBack = () => {
    navigate("/admin/admin-products");
  };

  return (
    <div className="min-h-screen flex flex-col justify-start py-8 items-center px-6">
      <div className="max-w-7xl w-full">
        <button
          onClick={handleBack}
          className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-700 mb-6 w-full sm:w-auto"
        >
          Back to Products
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="price"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="category"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
              required
            >
              <option value="">-- Select Category --</option>
              <option value="Gadgets">Gadgets</option>
              <option value="Electronics">Electronics</option>
              <option value="Shoes">Shoes</option>
              <option value="Shirts">Shirts</option>
              <option value="Books">Books</option>
              <option value="Home Decores">Home Decores</option>
              <option value="Health & Wellness">Health & Wellness</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="image"
              className="block text-gray-700 text-lg font-semibold mb-2"
            >
              Product Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
            />
            {formData.image && (
              <div className="mt-4">
                <h3 className="text-gray-700">Image Preview:</h3>
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Product Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg shadow-md"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
