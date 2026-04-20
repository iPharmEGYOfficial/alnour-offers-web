import { useEffect, useState } from "react";
import productService from "../../services/productService";
import ProductCard from "../products/ProductCard.jsx";

export default function FeaturedPreview() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await productService.getFeaturedProducts({ pageSize: 6 });
      setItems(res.items || []);
    })();
  }, []);

  return (
    <section className="card" style={{ margin: "16px 0", padding: 16 }}>
      <h3>منتجات مميزة</h3>
      <div className="product-grid">
        {items.map((p) => (
          <ProductCard key={p.productID} product={p} />
        ))}
      </div>
    </section>
  );
}
