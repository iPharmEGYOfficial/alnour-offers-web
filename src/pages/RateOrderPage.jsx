import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import useAuthStore from "../store/authStore";
import { submitRating } from "../services/orderService";
import { useToast } from "../components/ui/ToastProvider";

export default function RateOrderPage() {
  const { orderId } = useParams();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await submitRating({
        customerId: user.customerID,
        orderId: Number(orderId),
        stars: Number(stars),
        comment,
      });

      showToast("تم إرسال التقييم بنجاح", "success");

      setTimeout(() => {
        navigate(`/orders/${orderId}/rating-success`);
      }, 500);
    } catch (err) {
      showToast(err?.response?.data?.message || "فشل إرسال التقييم", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="hero-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <h2 style={{ margin: 0 }}>تقييم الطلب</h2>
              <p className="subtle" style={{ marginTop: "8px" }}>
                شاركنا رأيك في الطلب رقم #{orderId}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link to={`/orders/${orderId}`} className="secondary-btn">
                رجوع إلى التفاصيل
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-card" style={{ marginTop: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "700" }}>عدد النجوم</label>
          <input
            type="number"
            min="1"
            max="5"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            style={{
              height: "50px",
              borderRadius: "16px",
              border: "1px solid rgba(128, 144, 186, 0.22)",
              padding: "0 14px",
              background: "rgba(255, 255, 255, 0.82)",
              width: "100%",
              marginBottom: "16px"
            }}
          />

          <label style={{ display: "block", marginBottom: "8px", fontWeight: "700" }}>تعليقك</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب رأيك هنا..."
            style={{
              width: "100%",
              minHeight: "140px",
              borderRadius: "16px",
              border: "1px solid rgba(128, 144, 186, 0.22)",
              padding: "14px",
              background: "rgba(255, 255, 255, 0.82)",
              resize: "vertical"
            }}
          />

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
            <Link to={`/orders/${orderId}`} className="secondary-btn">
              رجوع
            </Link>

            <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "جارٍ الإرسال..." : "إرسال التقييم"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

