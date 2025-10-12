import { useProducts } from "../../context/ProductsContext";
import ProductCard from "../Products/ProductCard";

export default function ProductGrid() {
  const { products, loading, error } = useProducts();

  if (loading)
    return <p className="text-gray-600 text-center">Loading products...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-5">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
