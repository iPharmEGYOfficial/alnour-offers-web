export default function PromoStrip() {
  const promos = [
    "تجربة عرض مرتبة وسريعة للمنتجات الطبية والصحية",
    "إمكانية تطوير الربط المباشر مع بيانات الصيدلية لاحقًا",
    "تجهيز واجهة قابلة للتوسعة للعروض والتسويق والمتابعة"
  ];

  return (
    <section
      style={{
        marginTop: "18px",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "14px 16px"
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap"
        }}
      >
        {promos.map((item, index) => (
          <span
            key={index}
            style={{
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
              borderRadius: "999px",
              padding: "8px 12px",
              fontSize: "13px",
              fontWeight: 700
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}