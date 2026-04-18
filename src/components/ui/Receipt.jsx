import TaxQrBlock from "./TaxQrBlock";
import "../styles/receipt.css";

function money(v) {
  const n = Number(v ?? 0);
  return n.toFixed(2);
}

export default function Receipt({ data }) {
  const items = data?.items || [];

  return (
    <div className="receipt" dir="rtl">

      <div className="receipt-header no-break">
        <h1>صيدلية النور | Pharmacy</h1>
        <p>الخرمة - حي النزهة - شارع الملك فهد</p>
        <p>VAT: 311263307300003</p>
        <p>CR: 7036852742</p>
        <p>هاتف: 0598919668</p>
      </div>

      <hr />

      <div className="receipt-meta no-break">
        <p>رقم الفاتورة: {data.invoiceNo}</p>
        <p>التاريخ: {data.dateText}</p>
        <p>الحالة: {data.statusText}</p>
      </div>

      <hr />

      <table className="receipt-table no-break">
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>الإجمالي</th>
          </tr>
        </thead>

        <tbody>
          {items.map((i, idx) => (
            <tr key={idx}>
              <td>{i.name}</td>
              <td>{i.qty}</td>
              <td>{money(i.unitPrice)} ⃁</td>
              <td>{money(i.total)} ⃁</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <div className="receipt-total-box">
        <strong>الإجمالي: {money(data.total)} ⃁</strong>
      </div>

      <TaxQrBlock data={data.qr} />

      <div className="receipt-footer">
        شكراً لتسوقكم من صيدلية النور 🌹
      </div>

    </div>
  );
}