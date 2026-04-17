import { useEffect, useMemo, useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductCard from "../components/products/ProductCard";
import FeaturedProductsSection from "../components/products/FeaturedProductsSection";
import { getProducts } from "../services/productService";
import { getRuntimeLabel } from "../config/runtimeConfig";

export default function OffersPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const runtimeLabel = useMemo(() => getRuntimeLabel(), []);

  useEffect(() => {
    loadPagedProducts();
  }, [page]);

  async function loadPagedProducts(query = search, targetPage = page) {
    try {
      setLoading(true);
      const result = await getProducts({
        page: targetPage,
        pageSize: 12,
        search: query,
        offersOnly: false
      });
      setItems(result.items || []);
      setTotalPages(Number(result.totalPages || 1));
    } catch {
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  const doSearch = () => {
    setPage(1);
    loadPagedProducts(search, 1);
  };

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="hero-card">
          <h1 style={{ marginTop: 0 }}>منتجات صيدلية النور</h1>
          <p className="subtle">
            حالة التشغيل: <strong>{runtimeLabel}</strong>
          </p>

          <div className="offers-search-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم المنتج أو الباركود أو العلامة التجارية"
              className="admin-search-input"
            />
            <button className="primary-btn" onClick={doSearch}>بحث</button>
          </div>
        </div>

        <FeaturedProductsSection />

        <section className="home-section">
          <div className="section-head">
            <div>
              <h2>كل المنتجات</h2>
              <p>استعراض المنتجات المحلية التجريبية داخل المشروع</p>
            </div>
          </div>

          {loading ? (
            <div className="status-box">جارٍ تحميل المنتجات...</div>
          ) : items.length === 0 ? (
            <div className="status-box">لا توجد منتجات مطابقة.</div>
          ) : (
            <div className="products-grid-inline">
              {items.map((p) => (
                <ProductCard key={p.productID || p.barcode} product={p} />
              ))}
            </div>
          )}

          <div className="pagination-row">
            <button className="secondary-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
              السابق
            </button>
            <span className="subtle">صفحة {page} من {totalPages}</span>
            <button className="secondary-btn" onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))} disabled={page >= totalPages}>
              التالي
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
