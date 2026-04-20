import { Link, useParams } from "react-router-dom";
import formatCurrency from "../utils/formatCurrency";

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

export default function OrderDetailsPage() {
  const { id } = useParams();
  const order = readOrders().find((x) => String(x.orderNo) === String(id));

  if (!order) {
    return <div className="catalog-message">الطلب غير موجود.</div>;
  }

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>تفاصيل الطلب</h2>
          <p>رقم الطلب: {order.orderNo}</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>بيانات الطلب</h3>
          <div>
            طريقة الدفع:{" "}
            {order.paymentMethod === "cash" ? "الدفع عند الاستلام" : "بطاقة"}
          </div>
          <div style={{ marginTop: 8 }}>
            الإجمالي: {formatCurrency(order.total)}
          </div>
          <div style={{ marginTop: 8 }}>
            التاريخ:{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString("ar-SA")
              : "-"}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>العنوان</h3>
          <div>{order.address?.fullName}</div>
          <div style={{ marginTop: 8 }}>{order.address?.phone}</div>
          <div style={{ marginTop: 8 }}>
            {order.address?.city} - {order.address?.district} -{" "}
            {order.address?.street}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>المنتجات</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {(order.items || []).map((item) => (
              <div key={item.productID} style={innerCardStyle}>
                <div style={{ fontWeight: 700 }}>
                  {item.productName || item.name || "منتج"}
                </div>
                <div style={{ color: "#64748b", marginTop: 6 }}>
                  الكمية: {item.qty}
                </div>
                <div style={{ color: "#64748b", marginTop: 6 }}>
                  السعر: {formatCurrency(item.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to={`/invoice/${order.orderNo}`} style={secondaryLink}>
            عرض الفاتورة
          </Link>
          <Link to={`/invoice-print/${order.orderNo}`} style={secondaryLink}>
            طباعة
          </Link>
          <Link to={`/rate-order/${order.orderNo}`} style={secondaryLink}>
            تقييم الطلب
          </Link>
        </div>
      </div>
    </section>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 16,
};

const innerCardStyle = {
  border: "1px solid #eef2f7",
  borderRadius: 12,
  padding: 12,
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
