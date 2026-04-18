export default function HeroBanner() {
  return (
    <section className="card" style={{ margin: "16px 0", padding: 20 }}>
      <h1 style={{ marginTop: 0 }}>مرحبًا بكم في صيدلية النور</h1>
      <p className="subtle">
        عروض مميزة على الأجهزة الطبية ومنتجات العناية – توصيل سريع داخل الخرمة
      </p>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <a href="/offers" className="primary-btn">تصفح المنتجات</a>
        <a href="/cart" className="secondary-btn">السلة</a>
      </div>
    </section>
  );
}