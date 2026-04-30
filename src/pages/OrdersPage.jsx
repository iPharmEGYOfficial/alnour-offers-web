import { Link } from "react-router-dom";
import { useState } from "react";
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

function writeOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders || []));
}

function getStageIndex(status) {
  const idx = stages.findIndex((x) => x.key === status);
  return idx >= 0 ? idx : 0;
}

function formatStatus(status) {
  return stages.find((x) => x.key === status)?.label || "جديد";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(readOrders());

  function deleteOrder(orderNo) {
    if (!confirm("هل تريد حذف هذا الطلب؟")) return;

    const next = orders.filter((o) => String(o.orderNo) !== String(orderNo));
    writeOrders(next);
    setOrders(next);
  }

  function updateOrderStatus(orderNo, status) {
    const next = orders.map((o) =>
      String(o.orderNo) === String(orderNo) ? { ...o, status } : o,
    );

    writeOrders(next);
    setOrders(next);
  }

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
                <div style={topRow}>
                  <div>
                    <div style={{ fontWeight: 900 }}>
                      رقم الطلب: {order.orderNo}
                    </div>

                    <div style={muted}>
                      الحالة: {formatStatus(order.status || "new")}
                    </div>

                    <div style={muted}>
                      التاريخ:{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("ar-SA")
                        : "-"}
                    </div>
                  </div>

                  <div style={{ fontWeight: 900, fontSize: 18 }}>
                    {formatCurrency(order.total)}
                  </div>
                </div>

                <div style={stepsWrap}>
                  {stages.map((stage, index) => (
                    <div key={stage.key} style={stepItem}>
                      <span style={circleStyle(index <= activeIndex)}>
                        {index + 1}
                      </span>
                      <span
                        style={{
                          fontWeight: index === activeIndex ? 900 : 600,
                        }}
                      >
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={editBox}>
                  <label style={{ fontWeight: 800 }}>تعديل حالة الطلب:</label>

                  <select
                    value={order.status || "new"}
                    onChange={(e) =>
                      updateOrderStatus(order.orderNo, e.target.value)
                    }
                    style={selectStyle}
                  >
                    {stages.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={actionsRow}>
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

                  <Link
                    to={`/rate-order/${order.orderNo}`}
                    style={secondaryLink}
                  >
                    تقييم الطلب
                  </Link>

                  <button
                    type="button"
                    onClick={() => deleteOrder(order.orderNo)}
                    style={dangerBtn}
                  >
                    حذف الطلب
                  </button>
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

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const muted = {
  color: "#64748b",
  marginTop: 6,
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

const editBox = {
  marginTop: 14,
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const selectStyle = {
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontWeight: 800,
};

const actionsRow = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 14,
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

const dangerBtn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #fecaca",
  background: "#fee2e2",
  color: "#b91c1c",
  fontWeight: 900,
  cursor: "pointer",
};
