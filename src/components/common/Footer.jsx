export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "40px",
        borderTop: "1px solid #e5e7eb",
        background: "#ffffff"
      }}
    >
      <div
        className="container"
        style={{
          padding: "20px 16px",
          display: "grid",
          gap: "10px"
        }}
      >
        <div style={{ fontWeight: 800, fontSize: "16px", color: "#111827" }}>
          صيدلية النور
        </div>

        <div style={{ color: "#6b7280", fontSize: "14px", lineHeight: 1.8 }}>
          متجر إلكتروني لعرض المنتجات الصحية والطبية وتجربة شراء سهلة وواضحة.
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            fontSize: "14px"
          }}
        >
          <a href="/" style={footerLinkStyle}>الرئيسية</a>
          <a href="/offers" style={footerLinkStyle}>المنتجات</a>
          <a href="/cart" style={footerLinkStyle}>السلة</a>
          <a href="/orders" style={footerLinkStyle}>طلباتي</a>
        </div>

        <div style={{ color: "#9ca3af", fontSize: "12px" }}>
          جميع الحقوق محفوظة لصيدلية النور
        </div>
      </div>
    </footer>
  );
}

const footerLinkStyle = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 600
};