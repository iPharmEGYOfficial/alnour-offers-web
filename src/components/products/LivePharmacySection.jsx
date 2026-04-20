import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "../../services/productService";
import "./featured-products.css";
import "./product-grid.css";

export default function LivePharmacySection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await getProducts({
          page: 1,
          pageSize: 8,
        });

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
          <h2>منتجات الصيدلية</h2>
          <p>عرض منظم للمنتجات الجاهزة للشراء والإضافة إلى السلة</p>
        </div>
      </div>

      <div className="product-grid">
        {items.map((item) => (
          <ProductCard key={item.productID || item.barcode} product={item} />
        ))}
      </div>
    </section>
  );
}
