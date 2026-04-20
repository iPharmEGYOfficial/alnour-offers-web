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
        items: res?.items ?? [], // 🔥 حماية
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
    let mounted = true;

    (async () => {
      try {
        const res = await productService.getProducts({ pageSize: 24 });

        if (!mounted) return;

        setState({
          loading: false,
          items: res?.items ?? [],
          error: "",
        });
      } catch (err) {
        if (!mounted) return;

        console.error("❌ Product load error:", err);

        setState({
          loading: false,
          items: [],
          error: "تعذر تحميل المنتجات حالياً",
        });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ⏳ Loading
  if (state.loading) {
    return <div className="status-box">⏳ جارٍ تحميل المنتجات...</div>;
  }

  // ❌ Error
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

  // 📭 Empty
  if (!state.items.length) {
    return <div className="status-box">📭 لا توجد منتجات حالياً</div>;
  }

  // ✅ Grid
  return (
    <div className="product-grid">
      {state.items.map((p) => (
        <ProductCard
          key={p.productID || p.barcode || crypto.randomUUID()} // 🔥 fix
          product={p}
        />
      ))}
    </div>
  );
}
