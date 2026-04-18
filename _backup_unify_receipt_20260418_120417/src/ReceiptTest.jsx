import Receipt from './components/Receipt';
import { generateZatcaQR } from './utils/zatcaQr';

export default function ReceiptTest() {

  const invoice = {
    invoiceNo: '12345',
    date: new Date().toISOString(),
    items: [
      { name: 'Panadol', qty: 2, price: 10, total: 20 },
      { name: 'Vitamin C', qty: 1, price: 15, total: 15 }
    ],
    total: 35
  };

  invoice.qr = generateZatcaQR({
    seller: 'فاتورة? فاتورة',
    vat: '1234567890',
    timestamp: invoice.date,
    total: invoice.total,
    vatTotal: 5
  });

  return (
    <div>
      <button onClick={() => window.print()}>
        فاتورة
      </button>

      <Receipt data={invoice} />
    </div>
  );
}

