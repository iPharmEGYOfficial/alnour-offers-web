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

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await productService.getProducts({ pageSize: 24 });

        if (!mounted) return;

        setState({
          loading: false,
          items: res.items || [],
          error: "",
        });
      } catch {
        if (!mounted) return;

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

  if (state.loading) {
    return <div className="status-box">جارٍ تحميل المنتجات...</div>;
  }

  if (state.error) {
    return <div className="status-box">{state.error}</div>;
  }

  if (!state.items.length) {
    return <div className="status-box">لا توجد منتجات حالياً</div>;
  }

  return (
    <div className="product-grid">
      {state.items.map((p) => (
        <ProductCard key={p.productID || p.barcode} product={p} />
      ))}
    </div>
  );
}
