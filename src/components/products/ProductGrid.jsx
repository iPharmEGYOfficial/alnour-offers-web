import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import productService from "../../services/productService.js";
import "./product-grid.css";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await productService.getProducts();
      setProducts(res.items || []);
    } catch (err) {
      console.error("ERROR LOADING PRODUCTS", err);
    }
  }

  function handleAddToCart(product) {
    console.log("ADD TO CART:", product);
  }

  if (!products.length) {
    return <div style={{ padding: 20 }}>Loading products...</div>;
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard
          key={p.productID}
          product={p}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
