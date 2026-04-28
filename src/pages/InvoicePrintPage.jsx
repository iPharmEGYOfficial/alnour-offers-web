import { useEffect } from "react";
import { useParams } from "react-router-dom";
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

export default function InvoicePrintPage() {
  const { id } = useParams();
  const order = readOrders().find((x) => String(x.orderNo) === String(id));

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
          direction: rtl !important;
        }

        header, footer, nav, .site-header, .site-footer {
          display: none !important;
        }

        body * {
          visibility: hidden !important;
        }

        #print-invoice, #print-invoice * {
          visibility: visible !important;
        }

        #print-invoice {
          position: fixed !important;
          inset: 0 !important;
          width: 100% !important;
          min-height: 100% !important;
          margin: 0 !important;
          padding: 8mm !important;
          box-sizing: border-box !important;
          background: #fff !important;
          color: #111827 !important;
          transform: none !important;
        }

        @page {
          size: A4 portrait;
          margin: 0;
        }
      }
    `;
    document.head.appendChild(style);

    const t = setTimeout(() => window.print(), 700);

    return () => {
      clearTimeout(t);
      document.head.removeChild(style);
    };
  }, []);

  if (!order) {
    return <div className="catalog-message">الطلب غير موجود.</div>;
  }

  return (
    <div id="print-invoice" dir="rtl" style={pageStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src="/logo.png" alt="صيدلية النور" style={logoStyle} onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <div>
            <h1 style={shopTitle}>صيدلية النور</h1>
            <div style={shopSub}>Al-Nour Offers</div>
            <div style={smallText}>بجوار مجمع أهالي الخرمة الطبي العام - الخرمة</div>
          </div>
        </div>

        <div style={{ textAlign: "left" }}>
          <h2 style={invoiceTitle}>فاتورة</h2>
          <div style={strongLine}>رقم الطلب: {order.orderNo}</div>
          <div style={smallText}>
            التاريخ: {order.createdAt ? new Date(order.createdAt).toLocaleString("ar-SA") : "-"}
          </div>
          <div style={smallText}>
            الدفع: {order.paymentMethod === "cash" ? "الدفع عند الاستلام" : "بطاقة"}
          </div>
        </div>
      </div>

      <div style={infoGrid}>
        <div style={boxStyle}>
          <h3 style={boxTitle}>بيانات العميل</h3>
          <div style={lineStyle}>{order.address?.fullName || "-"}</div>
          <div style={lineStyle}>{order.address?.phone || "-"}</div>
        </div>

        <div style={boxStyle}>
          <h3 style={boxTitle}>عنوان التوصيل</h3>
          <div style={lineStyle}>{order.address?.city || "-"} - {order.address?.district || "-"}</div>
          <div style={lineStyle}>{order.address?.street || "-"}</div>
          <div style={lineStyle}>مبنى: {order.address?.buildingNo || "-"} | شقة: {order.address?.apartment || "-"}</div>
        </div>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={cellHead}>الصنف</th>
            <th style={cellHead}>الكمية</th>
            <th style={cellHead}>سعر الوحدة</th>
            <th style={cellHead}>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {(order.items || []).map((item) => (
            <tr key={item.productID || item.id}>
              <td style={cell}>{item.productName || item.name || "منتج"}</td>
              <td style={cellCenter}>{item.qty}</td>
              <td style={cellCenter}>{formatCurrency(item.price)}</td>
              <td style={cellCenter}>{formatCurrency(Number(item.price || 0) * Number(item.qty || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={totalBox}>
        <span>الإجمالي النهائي:</span>
        <strong>{formatCurrency(order.total)}</strong>
      </div>

      <div style={footerStyle}>
        <div>شكرًا لثقتكم في صيدلية النور</div>
        <div style={{ fontWeight: 800 }}>هيثم أسامة عبدالغفار | iPharmEGY</div>
      </div>
    </div>
  );
}

const pageStyle = {
  background: "#fff",
  color: "#111827",
  padding: "28px",
  maxWidth: "980px",
  minHeight: "1350px",
  margin: "0 auto",
  fontSize: 18,
  lineHeight: 1.7,
  boxSizing: "border-box",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  borderBottom: "3px solid #2563eb",
  paddingBottom: 18,
  marginBottom: 22,
};

const logoStyle = {
  width: 92,
  height: 92,
  objectFit: "contain",
  borderRadius: 16,
};

const shopTitle = {
  margin: 0,
  fontSize: 34,
  fontWeight: 900,
};

const shopSub = {
  fontSize: 18,
  color: "#2563eb",
  fontWeight: 800,
};

const invoiceTitle = {
  margin: 0,
  fontSize: 36,
  fontWeight: 900,
  color: "#2563eb",
};

const strongLine = {
  fontSize: 18,
  fontWeight: 900,
  marginTop: 8,
};

const smallText = {
  fontSize: 15,
  color: "#475569",
  marginTop: 4,
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 18,
  marginBottom: 24,
};

const boxStyle = {
  border: "2px solid #e5e7eb",
  borderRadius: 16,
  padding: 18,
  minHeight: 120,
};

const boxTitle = {
  margin: "0 0 10px",
  fontSize: 22,
  fontWeight: 900,
  color: "#0f172a",
};

const lineStyle = {
  fontSize: 18,
  marginBottom: 6,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 18,
  marginBottom: 24,
  fontSize: 18,
};

const cellHead = {
  border: "2px solid #cbd5e1",
  padding: 16,
  background: "#eff6ff",
  textAlign: "right",
  fontWeight: 900,
  fontSize: 19,
};

const cell = {
  border: "2px solid #e5e7eb",
  padding: 16,
  textAlign: "right",
  fontWeight: 700,
};

const cellCenter = {
  border: "2px solid #e5e7eb",
  padding: 16,
  textAlign: "center",
  fontWeight: 800,
};

const totalBox = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "3px solid #2563eb",
  borderRadius: 18,
  padding: "18px 22px",
  fontSize: 26,
  fontWeight: 900,
  marginTop: 20,
};

const footerStyle = {
  marginTop: 34,
  paddingTop: 18,
  borderTop: "2px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  fontSize: 17,
  color: "#334155",
};
