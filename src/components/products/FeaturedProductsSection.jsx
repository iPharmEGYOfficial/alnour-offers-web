import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import productService from "../../services/productService";
import useCartStore from "../../store/cartStore";
import "./featured-products.css";
import "./product-grid.css";

export default function FeaturedProductsSection() {
  const addToCart = useCartStore((s) => s.addToCart);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await productService.getFeaturedProducts({ pageSize: 12 });
        if (!mounted) return;
        setItems(res?.items || []);
      } catch {
        if (!mounted) return;
        setItems([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!items.length) return null;

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
            key={item.productID || item.barcode}
            product={item}
            onAddToCart={(p) => addToCart({ ...p, qty: 1 })}
          />
        ))}
      </div>
    </section>
  );
}
