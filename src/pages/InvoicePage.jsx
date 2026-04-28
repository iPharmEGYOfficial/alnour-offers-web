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

export default function InvoicePage() {
  const { id } = useParams();
  const order = readOrders().find((x) => String(x.orderNo) === String(id));

  if (!order) {
    return <div className="catalog-message">الفاتورة غير موجودة.</div>;
  }

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>الفاتورة</h2>
          <p>رقم الفاتورة/الطلب: {order.orderNo}</p>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontWeight: 800, marginBottom: 12 }}>صيدلية النور</div>
        <div style={{ color: "#64748b", marginBottom: 6 }}>
          العميل: {order.address?.fullName}
        </div>
        <div style={{ color: "#64748b", marginBottom: 6 }}>
          الجوال: {order.address?.phone}
        </div>
        <div style={{ color: "#64748b", marginBottom: 16 }}>
          التاريخ:{" "}
          {order.createdAt
            ? new Date(order.createdAt).toLocaleString("ar-SA")
            : "-"}
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thtd}>المنتج</th>
              <th style={thtd}>الكمية</th>
              <th style={thtd}>السعر</th>
              <th style={thtd}>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item) => (
              <tr key={item.productID}>
                <td style={thtd}>{item.productName || item.name || "منتج"}</td>
                <td style={thtd}>{item.qty}</td>
                <td style={thtd}>{formatCurrency(item.price)}</td>
                <td style={thtd}>
                  {formatCurrency(
                    Number(item.price || 0) * Number(item.qty || 0),
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 16, fontWeight: 800 }}>
          الإجمالي النهائي: {formatCurrency(order.total)}
        </div>

        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}
        >
          <Link to={`/invoice-print/${order.orderNo}`} style={secondaryLink}>
            نسخة الطباعة
          </Link>
          <Link to={`/orders/${order.orderNo}`} style={secondaryLink}>
            العودة لتفاصيل الطلب
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

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thtd = {
  border: "1px solid #e5e7eb",
  padding: 10,
  textAlign: "right",
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









