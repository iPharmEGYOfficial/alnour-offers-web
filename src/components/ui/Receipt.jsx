import TaxQrBlock from "./TaxQrBlock";
import "../../styles/receipt.css";
import formatCurrency from "../../utils/formatCurrency";

export default function Receipt({ data }) {
  const items = data?.items || [];
  const summary = data?.summary || {};

  return (
    <div className="receipt" dir="rtl">

      <h2 style={{ textAlign: "center" }}>صيدلية النور</h2>

      <div>
        <p>رقم الفاتورة: {data.invoiceNo}</p>
        <p>التاريخ: {data.dateText}</p>
      </div>

      <hr />

      <table className="receipt-table">
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>الإجمالي</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{formatCurrency(item.unitPrice)}</td>
              <td>{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <div className="receipt-total-box">
        الإجمالي: {formatCurrency(summary.finalTotal || data.total)}
      </div>

      <TaxQrBlock data={data.qr} />

      <p className="receipt-footer">
        شكراً لتسوقكم من صيدلية النور 🌹
      </p>
    </div>
  );
}
