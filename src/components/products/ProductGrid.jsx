import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import productService from "../../services/productService";
import "./product-grid.css";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await productService.getProducts({
        page: 1,
        pageSize: 24
      });
      setProducts(res.items || []);
    } catch (err) {
      console.error("ERROR LOADING PRODUCTS", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="catalog-message">جارٍ تحميل المنتجات...</div>;
  }

  if (!products.length) {
    return <div className="catalog-message">لا توجد منتجات متاحة حاليًا.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.productID} product={p} />
      ))}
    </div>
  );
}