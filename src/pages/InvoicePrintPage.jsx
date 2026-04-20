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
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, []);

  if (!order) {
    return <div className="catalog-message">بيانات الطباعة غير موجودة.</div>;
  }

  return (
    <div style={{ padding: 24, background: "#fff", color: "#000" }}>
      <h1 style={{ marginTop: 0 }}>فاتورة - صيدلية النور</h1>
      <div>رقم الطلب: {order.orderNo}</div>
      <div>العميل: {order.address?.fullName}</div>
      <div>الجوال: {order.address?.phone}</div>
      <div style={{ marginBottom: 16 }}>
        التاريخ:{" "}
        {order.createdAt
          ? new Date(order.createdAt).toLocaleString("ar-SA")
          : "-"}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={cell}>المنتج</th>
            <th style={cell}>الكمية</th>
            <th style={cell}>السعر</th>
            <th style={cell}>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {(order.items || []).map((item) => (
            <tr key={item.productID}>
              <td style={cell}>{item.productName || item.name || "منتج"}</td>
              <td style={cell}>{item.qty}</td>
              <td style={cell}>{formatCurrency(item.price)}</td>
              <td style={cell}>
                {formatCurrency(
                  Number(item.price || 0) * Number(item.qty || 0),
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 20 }}>
        الإجمالي النهائي: {formatCurrency(order.total)}
      </h3>
    </div>
  );
}

const cell = {
  border: "1px solid #000",
  padding: 8,
  textAlign: "right",
};
