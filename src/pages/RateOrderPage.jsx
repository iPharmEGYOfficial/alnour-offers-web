import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const STORAGE_KEY = "alnour_orders";

function readOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrderRating(orderNo, payload) {
  const orders = readOrders().map((order) =>
    String(order.orderNo) === String(orderNo)
      ? {
          ...order,
          ratingSubmitted: true,
          rating: payload,
        }
      : order,
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export default function RateOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stars, setStars] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    saveOrderRating(id, {
      stars,
      title,
      comment,
      createdAt: new Date().toISOString(),
    });

    navigate("/rating-success", {
      state: {
        orderNo: id,
        stars,
      },
    });
  }

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>تقييم الطلب</h2>
          <p>رقم الطلب: {id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={cardStyle}>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>عدد النجوم</label>
          <select
            value={stars}
            onChange={(e) => setStars(Number(e.target.value))}
            style={inputStyle}
          >
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
            <option value={2}>2</option>
            <option value={1}>1</option>
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>عنوان التقييم</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            placeholder="مثال: تجربة ممتازة"
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>ملاحظاتك</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ ...inputStyle, minHeight: 120 }}
            placeholder="اكتب ملاحظاتك هنا"
          />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="submit" style={primaryBtn}>
            إرسال التقييم
          </button>

          <Link to="/orders" style={secondaryLink}>
            العودة إلى طلباتي
          </Link>
        </div>
      </form>
    </section>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 16,
};

const labelStyle = {
  display: "block",
  marginBottom: 8,
  fontWeight: 700,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  fontSize: 14,
  outline: "none",
};

const primaryBtn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
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









