import ProductCard from "./ProductCard";
import mockProducts from "../../services/mockProducts.json";
import useCartStore from "../../store/cartStore";
import "./featured-products.css";
import "./product-grid.css";

export default function FeaturedProductsSection() {
  const addToCart = useCartStore((s) => s.addItem);

  const featuredItems = (mockProducts || []).slice(0, 12);

  function handleAddToCart(product) {
    addToCart({
      ...product,
      qty: 1
    });
  }

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>الأجهزة الطبية المميزة</h2>
          <p>مجموعة مختارة من الأجهزة الطبية بصور حقيقية من الصيدلية</p>
        </div>
      </div>

      <div className="product-grid">
        {featuredItems.map((item) => (
          <ProductCard
            key={item.productID}
            product={item}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
}


