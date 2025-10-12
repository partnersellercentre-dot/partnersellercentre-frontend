import React, { useEffect } from "react";
import { FaHeart, FaShoppingCart, FaStore } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext"; // ✅ import

function WishList() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { cart, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-green-600 mb-6">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <p className="text-gray-500">No items in wishlist yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => {
              // Use _id everywhere
              const isInCart = cart.some(
                (cartItem) => cartItem._id === item._id
              );

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-40 object-contain"
                    />
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow text-red-500 hover:text-red-600"
                    >
                      <FaHeart />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 mt-4">
                    <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
                      {item.name}
                    </h2>
                    {item.oldPrice && (
                      <p className="text-xs text-gray-500 line-through">
                        ${item.oldPrice.toFixed(2)}
                      </p>
                    )}
                    <p className="text-green-600 font-bold">
                      ${item.price.toFixed(2)}
                    </p>
                    {item.store && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                        <FaStore />
                        <span>Sold by {item.store}</span>
                      </div>
                    )}
                  </div>

                  {/* Add/Remove to Cart Button */}
                  <button
                    onClick={() => {
                      if (isInCart) {
                        removeFromCart(item._id);
                      } else {
                        addToCart(item);
                      }
                    }}
                    className={`mt-4 py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                      isInCart
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    <FaShoppingCart />
                    {isInCart ? "Remove from Cart" : "Add to Cart"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishList;
