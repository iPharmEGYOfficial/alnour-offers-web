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
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 20px !important;
          background: #fff !important;
        }
        @page {
          size: A4;
          margin: 12mm;
        }
      }
    `;
    document.head.appendChild(style);

    const t = setTimeout(() => window.print(), 500);

    return () => {
      clearTimeout(t);
      document.head.removeChild(style);
    };
  }, []);

  if (!order) {
    return <div className="catalog-message">بيانات الطباعة غير موجودة.</div>;
  }

  return (
    <div id="print-invoice" style={{ background: "#fff", color: "#111827", padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 30 }}>فاتورة</h1>
          <div style={{ color: "#64748b", marginTop: 8 }}>صيدلية النور | Al-Nour Offers</div>
        </div>

        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: 800 }}>رقم الطلب: {order.orderNo}</div>
          <div style={{ color: "#64748b", marginTop: 6 }}>
            التاريخ: {order.createdAt ? new Date(order.createdAt).toLocaleString("ar-SA") : "-"}
          </div>
          <div style={{ color: "#64748b", marginTop: 6 }}>
            الدفع: {order.paymentMethod === "cash" ? "الدفع عند الاستلام" : "بطاقة"}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={boxStyle}>
          <div style={boxTitle}>بيانات العميل</div>
          <div>{order.address?.fullName}</div>
          <div style={{ marginTop: 6 }}>{order.address?.phone}</div>
        </div>

        <div style={boxStyle}>
          <div style={boxTitle}>عنوان التوصيل</div>
          <div>{order.address?.city || "-"}</div>
          <div style={{ marginTop: 6 }}>
            {order.address?.district || "-"} - {order.address?.street || "-"}
          </div>
          <div style={{ marginTop: 6 }}>
            مبنى: {order.address?.buildingNo || "-"} | شقة: {order.address?.apartment || "-"}
          </div>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
        <thead>
          <tr>
            <th style={cellHead}>المنتج</th>
            <th style={cellHead}>الكمية</th>
            <th style={cellHead}>سعر الوحدة</th>
            <th style={cellHead}>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {(order.items || []).map((item) => (
            <tr key={item.productID}>
              <td style={cell}>{item.productName || item.name || "منتج"}</td>
              <td style={cell}>{item.qty}</td>
              <td style={cell}>{formatCurrency(item.price)}</td>
              <td style={cell}>{formatCurrency(Number(item.price || 0) * Number(item.qty || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <div style={{ color: "#64748b" }}>شكرًا لثقتكم في صيدلية النور</div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>
          الإجمالي النهائي: {formatCurrency(order.total)}
        </div>
      </div>
    </div>
  );
}

const boxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14
};

const boxTitle = {
  fontWeight: 800,
  marginBottom: 10
};

const cellHead = {
  border: "1px solid #d1d5db",
  padding: 12,
  background: "#f8fafc",
  textAlign: "right",
  fontWeight: 800
};

const cell = {
  border: "1px solid #e5e7eb",
  padding: 12,
  textAlign: "right"
};
