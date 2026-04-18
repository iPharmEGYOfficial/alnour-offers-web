import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import productService from "../../services/productService";
import useCartStore from "../../store/cartStore";
import "./featured-products.css";
import "./product-grid.css";

export default function FeaturedProductsSection() {
  const addItem = useCartStore((s) => s.addItem);
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await productService.getFeaturedProducts({ pageSize: 12 });
      setItems(res.items || []);
    })();
  }, []);

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>الأجهزة الطبية المميزة</h2>
          <p>مجموعة مختارة من الأجهزة الطبية من الصيدلية</p>
        </div>
      </div>

      <div className="product-grid">
        {items.map((item) => (
          <ProductCard
            key={item.productID}
            product={item}
            onAddToCart={(p) => addItem({ ...p, qty: 1 })}
          />
        ))}
      </div>
    </section>
  );
}