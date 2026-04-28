import { Link, useLocation } from "react-router-dom";

export default function RatingSuccessPage() {
  const location = useLocation();
  const data = location.state || null;

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>تم إرسال التقييم بنجاح ⭐</h2>
          <p>شكرًا لك على مشاركتنا رأيك</p>
        </div>
      </div>

      <div className="catalog-message">
        {data ? (
          <>
            تم حفظ تقييم الطلب رقم <strong>{data.orderNo}</strong> بعدد{" "}
            <strong>{data.stars}</strong> نجوم.
          </>
        ) : (
          <>تم حفظ التقييم بنجاح.</>
        )}

        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}
        >
          <Link to="/orders" style={primaryLink}>
            العودة إلى طلباتي
          </Link>
          <Link to="/" style={secondaryLink}>
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </section>
  );
}

const primaryLink = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 10,
  background: "#2563eb",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
};

const secondaryLink = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 700,
};









