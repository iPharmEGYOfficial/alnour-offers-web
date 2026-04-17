import { useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import AdminBannerCard from "../components/admin/AdminBannerCard";
import AdminSocialCampaignCard from "../components/admin/AdminSocialCampaignCard";
import { socialCampaigns } from "../config/socialCampaigns";

const initialBanners = [
  {
    id: "banner-1",
    title: "Main Hero Banner",
    subtitle: "Primary homepage promotional banner",
    slot: "Hero",
    link: "/offers",
    enabled: true
  },
  {
    id: "banner-2",
    title: "Mid Page Banner",
    subtitle: "Secondary campaign placement",
    slot: "Middle",
    link: "/offers",
    enabled: false
  },
  {
    id: "banner-3",
    title: "Side Promo Banner",
    subtitle: "Compact promotional placement",
    slot: "Side",
    link: "/offers",
    enabled: true
  }
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState(initialBanners);

  function toggleBanner(id) {
    setBanners((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  }

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="hero-card">
          <h2>Banner and Campaign Manager</h2>
          <p className="subtle">Control homepage banners and promotional social campaign placements.</p>
        </div>

        <section className="home-section">
          <div className="section-head">
            <div>
              <h2>Store Banners</h2>
              <p>Manage hero, middle, and side banners shown to customers.</p>
            </div>
          </div>

          <div className="admin-banner-grid">
            {banners.map((item) => (
              <AdminBannerCard key={item.id} item={item} onToggle={toggleBanner} />
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="section-head">
            <div>
              <h2>Social Campaigns</h2>
              <p>Review reusable promotional campaigns for social and marketing channels.</p>
            </div>
          </div>

          <div className="admin-social-grid">
            {socialCampaigns.map((item) => (
              <AdminSocialCampaignCard key={item.key} item={item} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

