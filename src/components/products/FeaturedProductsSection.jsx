import ProductCard from "./ProductCard";
import mockProducts from "../../services/mockProducts.json";
import "./featured-products.css";
import "./product-grid.css";

export default function FeaturedProductsSection() {
  const featuredItems = (mockProducts || []).slice(0, 12);

  function handleAddToCart(product) {
    console.log("ADD FEATURED TO CART:", product);
  }

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>Featured Medical Devices</h2>
          <p>Hand-picked medical and healthcare devices with local images.</p>
        </div>
      </div>

      <div className="product-grid">
        {featuredItems.map((item) => (
          <ProductCard
            key={`featured-${item.productID}`}
            product={item}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
}