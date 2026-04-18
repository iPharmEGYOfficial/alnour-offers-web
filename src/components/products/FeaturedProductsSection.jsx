import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getFeaturedProducts } from "../../services/productService";
import "./featured-products.css";
import "./product-grid.css";

export default function FeaturedProductsSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await getFeaturedProducts({
        page: 1,
        pageSize: 12
      });
      setItems(res.items || []);
    } catch {
      setItems([]);
    }
  }

  if (!items.length) return null;

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>الأجهزة الطبية المميزة</h2>
          <p>مجموعة مختارة من المنتجات المصورة داخل الكتالوج المحلي</p>
        </div>
      </div>

      <div className="product-grid">
        {items.map((item) => (
          <ProductCard key={item.productID} product={item} />
        ))}
      </div>
    </section>
  );
}