import HeroBanner from "../components/home/HeroBanner";
import PromoStrip from "../components/home/PromoStrip";
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedPreview from "../components/home/FeaturedPreview";
import AdSlots from "../components/home/AdSlots";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <PromoStrip />
      <CategoryGrid />
      <FeaturedPreview />
      <AdSlots />
    </>
  );
}