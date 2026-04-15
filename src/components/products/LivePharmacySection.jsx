import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getLiveProducts } from "../../services/productService";
import "./featured-products.css";
import "./product-grid.css";

export default function LivePharmacySection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setErrorText("");

      const result = await getLiveProducts({
        page: 1,
        pageSize: 12,
        search: ""
      });

      setProducts(result?.items || []);
    } catch (error) {
      console.error("LIVE PHARMACY LOAD ERROR:", error);
      setErrorText("Failed to load live pharmacy products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart(product) {
    console.log("ADD LIVE TO CART:", product);
  }

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>Live Pharmacy Products</h2>
          <p>Real-time products from the pharmacy bridge cache.</p>
        </div>
      </div>

      {loading && <div className="catalog-message">Loading live products...</div>}

      {!loading && errorText && (
        <div className="catalog-message catalog-message--error">{errorText}</div>
      )}

      {!loading && !errorText && (
        <div className="product-grid">
          {products.map((item) => (
            <ProductCard
              key={`live-${item.productID}`}
              product={item}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}