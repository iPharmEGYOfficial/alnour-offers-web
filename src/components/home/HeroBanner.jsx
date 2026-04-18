import RuntimeBadge from "../common/RuntimeBadge";

export default function HeroBanner() {
  return (
    <section
      className="hero-card"
      style={{
        marginTop: "18px",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef6ff 100%)",
        border: "1px solid #dbeafe"
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "16px"
        }}
      >
        <RuntimeBadge />

        <div>
          <h1 style={{ marginTop: 0, marginBottom: "10px" }}>مرحبًا بك في صيدلية النور</h1>
          <p className="subtle" style={{ lineHeight: 1.9, margin: 0 }}>
            منصة مرتبة لعرض المنتجات الطبية والصحية، مع كتالوج محلي واضح وتجربة شراء قابلة للتطوير
            نحو الربط المباشر مع الصيدلية والأنظمة الحية لاحقًا.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >
          <a href="/offers" className="primary-btn" style={{ textDecoration: "none" }}>
            تصفح المنتجات
          </a>

          <a href="/cart" className="secondary-btn" style={{ textDecoration: "none" }}>
            الانتقال إلى السلة
          </a>
        </div>
      </div>
    </section>
  );
}