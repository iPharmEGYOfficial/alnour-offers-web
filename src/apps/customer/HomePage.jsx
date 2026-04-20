import HeroBanner from "../../components/home/HeroBanner";
import PromoStrip from "../../components/home/PromoStrip";
import CategoryGrid from "../../components/home/CategoryGrid";
// import FeaturedPreview from "../../components/home/FeaturedPreview"; ❌ مؤقت
import AdSlots from "../../components/home/AdSlots";

import ProductGrid from "../../components/products/ProductGrid"; // 🔥 الجديد

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <PromoStrip />

      <CategoryGrid />

      {/* 🔥 المنتجات الحقيقية */}
      <section style={{ padding: "15px" }}>
        <h2 style={{ marginBottom: "10px" }}>🛍️ أحدث المنتجات</h2>

        <ProductGrid />
      </section>

      {/* ❌ نوقفه مؤقتًا لأنه بيعتمد على API */}
      {/* <FeaturedPreview /> */}

      <AdSlots />
    </>
  );
}
