import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { getOrderDetails } from "../services/orderService";
import { generateZatcaQR } from "../utils/zatcaQr";
import "../styles/invoice-print-pro.css";

export default function InvoicePage() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    load();
  }, [orderId]);

  const load = async () => {
    try {
      const res = await getOrderDetails(orderId);

      const order = res.order;
      const items = res.items;

      const qr = generateZatcaQR({
        seller: "صيدلية النور",
        vat: "311263307300003",
        timestamp: new Date(order.orderDate).toISOString(),
        total: order.finalTotal,
        vatTotal: order.finalTotal * 0.15
      });

      setData({ order, items, qr });

      setTimeout(() => window.print(), 700);

    } catch (e) {
      console.error(e);
    }
  };

  if (!data) return <div>جارٍ تحميل الفاتورة...</div>;

  const { order, items, qr } = data;

  return (
    <div className="invoice-print-area">
      <div className="invoice-sheet">

        {/* HEADER */}
        <div className="invoice-head">
          <div className="invoice-title">صيدلية النور</div>
          <div className="invoice-subtitle">Al-Noor Medical Company</div>
        </div>

        {/* META */}
        <div className="invoice-meta">
          <div>رقم الفاتورة: {order.orderID}</div>
          <div>{new Date(order.orderDate).toLocaleString("ar-SA")}</div>
        </div>

        {/* COMPANY */}
        <div className="invoice-section">
          <div className="invoice-card">
            <b>بيانات المنشأة</b>
            <div>الرقم الضريبي: 311263307300003</div>
            <div>السجل التجاري: 7036852742</div>
          </div>

          <div className="invoice-card">
            <b>العنوان</b>
            <div>المملكة العربية السعودية</div>
            <div>الخبر</div>
          </div>
        </div>

        {/* ITEMS */}
        <div className="invoice-section">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>الصنف</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.orderItemID}>
                  <td>{i.displayName || i.productName}</td>
                  <td>{i.qty}</td>
                  <td>{i.unitPrice}</td>
                  <td>{i.finalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTAL */}
        <div className="invoice-final-total">
          الإجمالي: {order.finalTotal} ر.س
        </div>

        {/* QR */}
        <div className="qr-box">
          <QRCodeSVG value={qr} size={140} />
        </div>

        {/* FOOTER */}
        <div className="invoice-footer">
          شكراً لزيارتكم 
        </div>

      </div>
    </div>
  );
}
