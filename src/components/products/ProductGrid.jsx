import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import productService from "../../services/productService";
import "./product-grid.css";

export default function ProductGrid() {
  const [state, setState] = useState({ loading: true, items: [] });

  useEffect(() => {
    (async () => {
      try {
        const res = await productService.getProducts({ pageSize: 24 });
        setState({ loading: false, items: res.items || [] });
      } catch {
        setState({ loading: false, items: [] });
      }
    })();
  }, []);

  if (state.loading) {
    return <div className="status-box">جارٍ تحميل المنتجات...</div>;
  }

  if (!state.items.length) {
    return <div className="status-box">لا توجد منتجات حالياً</div>;
  }

  return (
    <div className="product-grid">
      {state.items.map((p) => (
        <ProductCard key={p.productID} product={p} />
      ))}
    </div>
  );
}