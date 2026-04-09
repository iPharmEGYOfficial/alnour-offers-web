import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import HeroBanner from "../components/home/HeroBanner";
import PromoStrip from "../components/home/PromoStrip";
import CategoryGrid from "../components/home/CategoryGrid";
import AdSlots from "../components/home/AdSlots";
import FeaturedPreview from "../components/home/FeaturedPreview";

export default function HomePage() {
  return (
    <div className="page">
      <Header />

      <main className="container home-layout">
        <HeroBanner />
        <PromoStrip />
        <CategoryGrid />
        <AdSlots />
        <FeaturedPreview />
      </main>

      <Footer />
    </div>
  );
}
