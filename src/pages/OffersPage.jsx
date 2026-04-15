import { useEffect, useMemo, useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductCard from "../components/products/ProductCard";
import { getProducts } from "../services/productService";
import { getRuntimeLabel } from "../config/runtimeConfig";

export default function OffersPage() {
  const [search, setSearch] = useState("");
  const [featured, setFeatured] = useState([]);
  const [offersStrip, setOffersStrip] = useState([]);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const runtimeLabel = useMemo(() => getRuntimeLabel(), []);

  useEffect(() => {
    loadFeatured();
    loadOffersStrip();
  }, []);

  useEffect(() => {
    loadPagedProducts();
  }, [page]);

  async function loadFeatured() {
    try {
      const result = await getProducts({
        page: 1,
        pageSize: 4,
        search: "",
        offersOnly: false
      });
      setFeatured(result.items || []);
    } catch {
      setFeatured([]);
    }
  }

  async function loadOffersStrip() {
    try {
      const result = await getProducts({
        page: 1,
        pageSize: 6,
        search: "",
        offersOnly: true
      });
      setOffersStrip(result.items || []);
    } catch {
      setOffersStrip([]);
    }
  }

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

  const goPrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const goNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="hero-card">
          <h1 style={{ marginTop: 0 }}>Today&apos;s Offers</h1>
          <p className="subtle">
            Current runtime: <strong>{runtimeLabel}</strong>
          </p>

          <div className="offers-search-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, barcode, or brand"
              className="admin-search-input"
            />
            <button className="primary-btn" onClick={doSearch}>Search</button>
          </div>
        </div>

        <section className="home-section">
          <div className="section-head">
            <div>
              <h2>Top Offers</h2>
              <p>Highlighted offer items from the live pharmacy feed</p>
            </div>
          </div>

          <div className="products-grid-inline">
            {offersStrip.map((p) => (
              <ProductCard key={p.productID || p.barcode} product={p} />
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="section-head">
            <div>
              <h2>Featured Products</h2>
              <p>Popular products selected from the current pharmacy catalog</p>
            </div>
          </div>

          <div className="products-grid-inline">
            {featured.map((p) => (
              <ProductCard key={p.productID || p.barcode} product={p} />
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="section-head">
            <div>
              <h2>All Products</h2>
              <p>Browse the live inventory available for customer viewing</p>
            </div>
          </div>

          {loading ? (
            <div className="status-box">Loading products...</div>
          ) : items.length === 0 ? (
            <div className="status-box">No products found.</div>
          ) : (
            <div className="products-grid-inline">
              {items.map((p) => (
                <ProductCard key={p.productID || p.barcode} product={p} />
              ))}
            </div>
          )}

          <div className="pagination-row">
            <button className="secondary-btn" onClick={goPrev} disabled={page <= 1}>
              Previous
            </button>
            <span className="subtle">Page {page} of {totalPages}</span>
            <button className="secondary-btn" onClick={goNext} disabled={page >= totalPages}>
              Next
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
