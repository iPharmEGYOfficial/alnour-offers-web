import { Link } from "react-router-dom";
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

function formatStatus(status) {
  switch (status) {
    case "new":
      return "جديد";
    case "processing":
      return "قيد التجهيز";
    case "delivered":
      return "تم التسليم";
    default:
      return status || "غير معروف";
  }
}

export default function OrdersPage() {
  const orders = readOrders();

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>طلباتي</h2>
          <p>كل الطلبات المحفوظة محليًا داخل المتصفح</p>
        </div>
      </div>

      {!orders.length ? (
        <div className="catalog-message">لا توجد طلبات محفوظة حاليًا.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((order) => (
            <div key={order.orderNo} style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>
                    رقم الطلب: {order.orderNo}
                  </div>
                  <div style={{ color: "#64748b", marginTop: 6 }}>
                    الحالة: {formatStatus(order.status)}
                  </div>
                  <div style={{ color: "#64748b", marginTop: 6 }}>
                    التاريخ:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("ar-SA")
                      : "-"}
                  </div>
                </div>

                <div style={{ fontWeight: 800 }}>
                  {formatCurrency(order.total)}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 14,
                }}
              >
                <Link to={`/orders/${order.orderNo}`} style={secondaryLink}>
                  تفاصيل الطلب
                </Link>
                <Link to={`/invoice/${order.orderNo}`} style={secondaryLink}>
                  الفاتورة
                </Link>
                <Link
                  to={`/invoice-print/${order.orderNo}`}
                  style={secondaryLink}
                >
                  طباعة
                </Link>
                <Link to={`/rate-order/${order.orderNo}`} style={secondaryLink}>
                  تقييم الطلب
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 16,
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
