import ProductsHeader from "../components/Products/ProductsHeader.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import Footer from "./Footer.jsx";

export default function Products() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto min-h-screen">
        <ProductsHeader />
        <div className="px-4 pb-24">
          <ProductGrid />
        </div>
        <Footer />
      </div>
    </div>
  );
}
