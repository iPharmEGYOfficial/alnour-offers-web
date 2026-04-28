import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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

function persistOrder(order) {
  const orders = readOrders();
  const exists = orders.some((x) => x.orderNo === order.orderNo);
  if (exists) return;

  const next = [
    {
      ...order,
      id: order.orderNo,
      status: "new",
      createdAt: new Date().toISOString(),
      ratingSubmitted: false,
    },
    ...orders,
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export default function OrderSuccessPage() {
  const location = useLocation();
  const order = location.state || null;

  useEffect(() => {
    if (order?.orderNo) {
      persistOrder(order);
    }
  }, [order]);

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>تم تأكيد الطلب بنجاح 🎉</h2>
          <p>شكرًا لك، تم تسجيل طلبك بنجاح</p>
        </div>
      </div>

      {!order ? (
        <div className="catalog-message">
          لا توجد بيانات طلب متاحة.
          <div style={{ marginTop: 12 }}>
            <Link to="/">العودة للرئيسية</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>
              رقم الطلب: {order.orderNo}
            </div>
            <div style={{ color: "#64748b", marginBottom: 6 }}>
              طريقة الدفع:{" "}
              {order.paymentMethod === "cash" ? "الدفع عند الاستلام" : "بطاقة"}
            </div>
            <div style={{ fontWeight: 700 }}>
              الإجمالي: {formatCurrency(order.total)}
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>العنوان</h3>
            <div>{order.address?.fullName}</div>
            <div style={{ color: "#64748b", marginTop: 6 }}>
              {order.address?.phone}
            </div>
            <div style={{ color: "#64748b", marginTop: 6 }}>
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
            <Link to="/" style={primaryLink}>
              العودة للرئيسية
            </Link>
            <Link to="/orders" style={secondaryLink}>
              الذهاب إلى طلباتي
            </Link>
            <Link to={`/invoice/${order.orderNo}`} style={secondaryLink}>
              عرض الفاتورة
            </Link>
            <Link to={`/invoice-print/${order.orderNo}`} style={secondaryLink}>
              طباعة الفاتورة
            </Link>
            <Link to={`/rate-order/${order.orderNo}`} style={secondaryLink}>
              تقييم الطلب
            </Link>
            <Link to="/offers" style={secondaryLink}>
              متابعة التسوق
            </Link>
          </div>
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

const innerCardStyle = {
  border: "1px solid #eef2f7",
  borderRadius: 12,
  padding: 12,
};

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









