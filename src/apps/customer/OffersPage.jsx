import { useEffect, useMemo, useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProductCard from "../components/products/ProductCard";
import productService from "../services/productService";
import debounce from "../utils/debounce";
import BarcodeScanner from "../components/ui/BarcodeScanner";
import useCartStore from "../store/cartStore";
import { useToast } from "../components/ui/ToastProvider";

export default function OffersPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [showScanner, setShowScanner] = useState(false);

  const addToCart = useCartStore((s) => s.addToCart);
  const { showToast } = useToast();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await productService.getProducts();
    setItems(res.items || []);
  }

  const doSearch = useMemo(
    () =>
      debounce(async (q) => {
        const res = await productService.searchProducts(q);
        setItems(res.items || []);
      }, 300),
    []
  );

  function handleChange(e) {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      load();
      return;
    }

    doSearch(value);
  }

  // 🔥🔥🔥 MAGIC HERE
  async function handleScan(code) {
    setShowScanner(false);
    setSearch(code);

    const res = await productService.searchProducts(code);
    const found = res.items || [];

    if (found.length === 0) {
      showToast("❌ المنتج غير موجود", "error");
      return;
    }

    const product = found[0];

    addToCart({
      ...product,
      qty: 1
    });

    showToast(`✅ تم إضافة ${product.productName} للسلة`, "success");

    setItems(found); // optional: show result
  }

  return (
    <div>
      <Header />

      <div className="container">
        <h1>منتجات الصيدلية</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={search}
            onChange={handleChange}
            placeholder="🔍 ابحث أو امسح باركود..."
            style={{ flex: 1, padding: "12px" }}
          />

          <button
            onClick={() => setShowScanner(true)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              background: "#0ea5e9",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            📷
          </button>
        </div>

        <div className="product-grid" style={{ marginTop: "20px" }}>
          {items.map((p) => (
            <ProductCard key={p.productID} product={p} />
          ))}
        </div>
      </div>

      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      <Footer />
    </div>
  );
}