import { useEffect, useState } from "react";
import { getCatalogMeta } from "../../services/productService";

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadMeta();
  }, []);

  async function loadMeta() {
    try {
      const meta = await getCatalogMeta();
      setCategories(meta?.categories || []);
    } catch {
      setCategories([]);
    }
  }

  if (!categories.length) return null;

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>أقسام المنتجات</h2>
          <p>تصفح سريع حسب النوع أو الاستخدام</p>
        </div>
      </div>

      <div className="product-grid">
        {categories.map((item) => (
          <div key={item.key} className="product-card">
            <div className="product-body">
              <div className="product-name">{item.label}</div>
              <div className="product-brand">{item.count} منتج</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}