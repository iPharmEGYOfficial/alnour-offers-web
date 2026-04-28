import { Link } from "react-router-dom";
import formatCurrency from "../utils/formatCurrency";

const STORAGE_KEY = "alnour_orders";

const stages = [
  { key: "new", label: "جديد" },
  { key: "processing", label: "قيد التجهيز" },
  { key: "out_for_delivery", label: "خرج للتوصيل" },
  { key: "delivered", label: "تم التسليم" },
];

function readOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getStageIndex(status) {
  const idx = stages.findIndex((x) => x.key === status);
  return idx >= 0 ? idx : 0;
}

function formatStatus(status) {
  return stages.find((x) => x.key === status)?.label || "جديد";
}

export default function OrdersPage() {
  const orders = readOrders();

  return (
    <section className="catalog-section" dir="rtl">
      <div className="catalog-section__head">
        <div>
          <h2>طلباتي</h2>
          <p>كل الطلبات محفوظة محليًا داخل المتصفح</p>
        </div>
      </div>

      {!orders.length ? (
        <div className="catalog-message">لا توجد طلبات حتى الآن.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((order) => {
            const activeIndex = getStageIndex(order.status || "new");

            return (
              <div key={order.orderNo} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>رقم الطلب: {order.orderNo}</div>
                    <div style={{ color: "#64748b", marginTop: 6 }}>
                      الحالة: {formatStatus(order.status || "new")}
                    </div>
                    <div style={{ color: "#64748b", marginTop: 6 }}>
                      التاريخ: {order.createdAt ? new Date(order.createdAt).toLocaleString("ar-SA") : "-"}
                    </div>
                  </div>

                  <div style={{ fontWeight: 800 }}>
                    {formatCurrency(order.total)}
                  </div>
                </div>

                <div style={stepsWrap}>
                  {stages.map((stage, index) => (
                    <div key={stage.key} style={stepItem}>
                      <span style={circleStyle(index <= activeIndex)}>{index + 1}</span>
                      <span style={{ fontWeight: index === activeIndex ? 800 : 500 }}>
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                  <Link to={`/orders/${order.orderNo}`} style={secondaryLink}>تفاصيل الطلب</Link>
                  <Link to={`/invoice/${order.orderNo}`} style={secondaryLink}>الفاتورة</Link>
                  <Link to={`/invoice-print/${order.orderNo}`} style={secondaryLink}>طباعة</Link>
                  <Link to={`/rate-order/${order.orderNo}`} style={secondaryLink}>تقييم الطلب</Link>
                </div>
              </div>
            );
          })}
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

const stepsWrap = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 16,
  paddingTop: 12,
  borderTop: "1px solid #eef2f7",
};

const stepItem = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#0f172a",
};

function circleStyle(active) {
  return {
    width: 28,
    height: 28,
    borderRadius: "999px",
    display: "inline-grid",
    placeItems: "center",
    background: active ? "#2563eb" : "#e5e7eb",
    color: active ? "#fff" : "#475569",
    fontWeight: 800,
  };
}

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
