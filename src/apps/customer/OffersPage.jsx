import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/products/ProductCard.jsx";
import productService from "../../services/productService";
import debounce from "../../utils/debounce";

export default function OffersPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState("default");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);

  useEffect(() => {
    loadProducts(1, true);
  }, []);

  async function loadProducts(pageNumber = 1, reset = false) {
    try {
      setLoading(true);
      const res = await productService.getProducts({ page: pageNumber, pageSize: 50 });
      const newItems = res?.items || [];
      setAllItems((prev) => (reset ? newItems : [...prev, ...newItems]));
      setHasMore(Boolean(res?.hasMore ?? newItems.length > 0));
    } catch (error) {
      console.error("OffersPage load error:", error);
      if (reset) setAllItems([]);
    } finally {
      setLoading(false);
    }
  }

  const doSearch = useMemo(
    () =>
      debounce(async (q) => {
        try {
          setLoading(true);
          const res = await productService.searchProducts(q, { pageSize: 100 });
          setAllItems(res?.items || []);
          setPage(1);
          setHasMore(false);
        } catch (error) {
          console.error("OffersPage search error:", error);
          setAllItems([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    [],
  );

  function handleSearch(e) {
    const value = e.target.value;
    setSearch(value);
    if (!value.trim()) {
      loadProducts(1, true);
      setPage(1);
      return;
    }
    doSearch(value);
  }

  useEffect(() => {
    let filtered = [...allItems];
    if (offersOnly) filtered = filtered.filter((i) => i.hasOffer);
    if (onlyAvailable) filtered = filtered.filter((i) => Number(i.stockQty) > 0);
    if (sort === "price_asc") filtered.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sort === "price_desc") filtered.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    setItems(filtered);
  }, [allItems, sort, onlyAvailable, offersOnly]);

  function loadMore() {
    const next = page + 1;
    setPage(next);
    loadProducts(next);
  }

  return (
    <section className="catalog-section">
      <h2>🛍️ المنتجات والعروض</h2>

      <input value={search} onChange={handleSearch} placeholder="ابحث باسم المنتج أو الباركود" style={inputStyle} />

      <div style={filterBar}>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">ترتيب عادي</option>
          <option value="price_asc">السعر من الأقل للأعلى</option>
          <option value="price_desc">السعر من الأعلى للأقل</option>
        </select>

        <label>
          <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
          المتوفر فقط
        </label>

        <label>
          <input type="checkbox" checked={offersOnly} onChange={(e) => setOffersOnly(e.target.checked)} />
          العروض فقط
        </label>
      </div>

      <div style={{ margin: "10px 0", color: "#64748b" }}>عدد المنتجات: {items.length}</div>

      <div className="product-grid">
        {items.map((p) => (
          <ProductCard key={p.productID || p.id || p.barcode} product={p} />
        ))}
      </div>

      {hasMore && !search && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={loadMore} style={loadMoreBtn} disabled={loading}>تحميل المزيد</button>
        </div>
      )}

      {loading && <div style={{ textAlign: "center" }}>جارٍ التحميل...</div>}
    </section>
  );
}

const inputStyle = { width: "100%", padding: "12px", margin: "12px 0", borderRadius: "10px", border: "1px solid #ddd" };
const filterBar = { display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap", marginBottom: "10px" };
const loadMoreBtn = { padding: "10px 20px", borderRadius: "10px", background: "#2563eb", color: "#fff", border: "none", cursor: "pointer" };
