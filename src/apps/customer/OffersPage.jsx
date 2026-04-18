import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/products/ProductCard";
import productService from "../../services/productService";
import debounce from "../../utils/debounce";

export default function OffersPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitial();
  }, []);

  async function loadInitial() {
    try {
      setLoading(true);
      const res = await productService.getProducts({ page: 1, pageSize: 24 });
      setItems(res.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const doSearch = useMemo(
    () =>
      debounce(async (q) => {
        try {
          setLoading(true);
          const res = await (productService.searchProducts
            ? productService.searchProducts(q)
            : productService.getProducts({ page: 1, pageSize: 24, search: q }));

          setItems(res.items || []);
        } catch {
          setItems([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  function handleChange(e) {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      loadInitial();
      return;
    }

    doSearch(value);
  }

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>منتجات صيدلية النور</h2>
          <p>تصفح المنتجات وابحث بالاسم أو الباركود</p>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={handleChange}
          placeholder="ابحث بالاسم أو الباركود"
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "14px"
          }}
        />
      </div>

      {loading ? (
        <div className="catalog-message">جارٍ تحميل النتائج...</div>
      ) : items.length === 0 ? (
        <div className="catalog-message">لا توجد منتجات مطابقة.</div>
      ) : (
        <div className="product-grid">
          {items.map((item) => (
            <ProductCard key={item.productID || item.barcode} product={item} />
          ))}
        </div>
      )}
    </section>
  );
}