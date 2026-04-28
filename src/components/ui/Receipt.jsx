import TaxQrBlock from "./TaxQrBlock";
import "../../styles/receipt.css";
import formatCurrency from "../../utils/formatCurrency";

export default function Receipt({ data }) {
  const items = data?.items || [];
  const summary = data?.summary || {};

  return (
    <div className="receipt" dir="rtl">

      <h2 style={{ textAlign: "center" }}>ØµÙŠØ¯Ù„ÙŠØ© Ø§Ù„Ù†ÙˆØ±</h2>

      <div>
        <p>Ø±Ù‚Ù… Ø§Ù„ÙØ§ØªÙˆØ±Ø©: {data.invoiceNo}</p>
        <p>Ø§Ù„ØªØ§Ø±ÙŠØ®: {data.dateText}</p>
      </div>

      <hr />

      <table className="receipt-table">
        <thead>
          <tr>
            <th>Ø§Ù„ØµÙ†Ù</th>
            <th>Ø§Ù„ÙƒÙ…ÙŠØ©</th>
            <th>Ø§Ù„Ø³Ø¹Ø±</th>
            <th>Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ</th>
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
        Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ: {formatCurrency(summary.finalTotal || data.total)}
      </div>

      <TaxQrBlock data={data.qr} />

      <p className="receipt-footer">
        Ø´ÙƒØ±Ø§Ù‹ Ù„ØªØ³ÙˆÙ‚ÙƒÙ… Ù…Ù† ØµÙŠØ¯Ù„ÙŠØ© Ø§Ù„Ù†ÙˆØ± ðŸŒ¹
      </p>
    </div>
  );
}










