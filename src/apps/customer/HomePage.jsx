import { Link } from "react-router-dom";
import HeroBanner from "../../components/home/HeroBanner";
import PromoStrip from "../../components/home/PromoStrip";
import CategoryGrid from "../../components/home/CategoryGrid";
import AdSlots from "../../components/home/AdSlots";
import ProductGrid from "../../components/products/ProductGrid.jsx";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <PromoStrip />
      <CategoryGrid />

      <section style={{ padding: "15px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>🛍️ عروض وأجهزة مختارة</h2>
            <p style={{ margin: "6px 0 0", color: "#64748b" }}>
              منتجات محلية بصور وأسعار جاهزة للطلب
            </p>
          </div>

          <Link
            to="/offers"
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              background: "#2563eb",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            تصفح كل المنتجات
          </Link>
        </div>

        <ProductGrid />
      </section>

      <AdSlots />
    </>
  );
}
