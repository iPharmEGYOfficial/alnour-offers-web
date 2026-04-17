import { Link, useParams } from "react-router-dom";
import Header from "../components/common/Header";

export default function RatingSuccessPage() {
  const { orderId } = useParams();

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="hero-card" style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "32px" }}>تم استلام تقييمك بنجاح</h1>
          <p className="subtle">شكرًا لك، تم حفظ تقييم الطلب رقم #{orderId}</p>

          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.7)"
            }}
          >
            <h2 style={{ marginBottom: "10px" }}>اكتملت الخطوات بنجاح</h2>
            <p className="subtle" style={{ marginBottom: 0 }}>
              يمكنك الآن العودة إلى طلباتك أو متابعة العروض الجديدة.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "24px",
              flexWrap: "wrap"
            }}
          >
            <Link to="/orders" className="secondary-btn">
               العودة إلى طلباتي
            </Link>

            <Link to="/offers" className="primary-btn">
              متابعة العروض 
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

