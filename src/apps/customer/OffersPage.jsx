import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/products/ProductCard.jsx";
import productService from "../../services/productService";
import debounce from "../../utils/debounce";

const CATEGORY_LABELS = [
  "Medical Devices",
  "Thermometers",
  "Blood Pressure Monitors",
  "Mother & Baby",
  "Beauty Devices",
  "Personal Care",
  "First Aid",
  "Dental Care",
  "Massage Devices",
  "Hair Care",
];

export default function OffersPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("الكل");

  useEffect(() => {
    loadInitial();
  }, []);

  async function loadInitial() {
    try {
      setLoading(true);
      const res = await productService.getProducts({ page: 1, pageSize: 100 });
      const list = res?.items || [];
      setAllItems(list);
      setItems(list);
    } catch {
      setAllItems([]);
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
            : productService.getProducts({ page: 1, pageSize: 100, search: q }));

          setAllItems(res?.items || []);
        } catch {
          setAllItems([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    [],
  );

  useEffect(() => {
    let filtered = [...allItems];

    if (activeCategory !== "الكل") {
      filtered = filtered.filter(
        (item) => (item.categoryName || "") === activeCategory,
      );
    }

    setItems(filtered);
  }, [allItems, activeCategory]);

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
          <h2>الأجهزة الطبية ومنتجات العناية</h2>
          <p>ابحث بالاسم أو الباركود أو الماركة، ثم أضف مباشرة إلى السلة</p>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={handleChange}
          placeholder="ابحث باسم المنتج أو الباركود أو الماركة"
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <button
          type="button"
          onClick={() => setActiveCategory("الكل")}
          style={chipStyle(activeCategory === "الكل")}
        >
          الكل
        </button>

        {CATEGORY_LABELS.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            style={chipStyle(activeCategory === cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="catalog-message">جارٍ تحميل النتائج...</div>
      ) : items.length === 0 ? (
        <div className="catalog-message">لا توجد منتجات مطابقة.</div>
      ) : (
        <>
          <div style={{ marginBottom: 12, color: "#64748b", fontWeight: 600 }}>
            عدد النتائج: {items.length}
          </div>

          <div className="product-grid">
            {items.map((item) => (
              <ProductCard
                key={item.productID || item.barcode}
                product={item}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function chipStyle(active) {
  return {
    padding: "10px 14px",
    borderRadius: "999px",
    border: active ? "1px solid #2563eb" : "1px solid #d1d5db",
    background: active ? "#eff6ff" : "#ffffff",
    color: active ? "#2563eb" : "#374151",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
  };
}

