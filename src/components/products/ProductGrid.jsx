import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import productService from "../../services/productService";
import "./product-grid.css";

export default function ProductGrid() {
  const [state, setState] = useState({
    loading: true,
    items: [],
    error: "",
  });

  async function loadProducts() {
    try {
      setState((s) => ({ ...s, loading: true, error: "" }));

      const res = await productService.getProducts({ pageSize: 24 });

      setState({
        loading: false,
        items: res?.items ?? [],
        error: "",
      });
    } catch (err) {
      console.error("❌ Product load error:", err);

      setState({
        loading: false,
        items: [],
        error: "تعذر تحميل المنتجات حالياً",
      });
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  if (state.loading) {
    return <div className="status-box">⏳ جارٍ تحميل المنتجات...</div>;
  }

  if (state.error) {
    return (
      <div className="status-box">
        ❌ {state.error}
        <br />
        <button onClick={loadProducts} className="retry-btn">
          🔄 إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!state.items.length) {
    return <div className="status-box">📭 لا توجد منتجات حالياً</div>;
  }

  return (
    <div className="product-grid">
      {state.items.map((p) => (
        <ProductCard key={p.productID || p.barcode} product={p} />
      ))}
    </div>
  );
}
