import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import HeroBanner from "../components/home/HeroBanner";
import PromoStrip from "../components/home/PromoStrip";
import CategoryGrid from "../components/home/CategoryGrid";
import AdSlots from "../components/home/AdSlots";
import FeaturedProductsSection from "../components/products/FeaturedProductsSection";
import LivePharmacySection from "../components/products/LivePharmacySection";

export default function HomePage() {
  return (
    <div className="page">
      <Header />

      <main className="container home-layout">
        <HeroBanner />

        <PromoStrip />

        <CategoryGrid />

        <FeaturedProductsSection />

        <LivePharmacySection />

        <AdSlots />
      </main>

      <Footer />
    </div>
  );
}