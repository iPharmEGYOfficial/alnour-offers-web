import "../styles/invoice.css";
import { useMemo } from "react";
import Receipt from "../components/Receipt";
import { generateZatcaQR } from "../utils/zatcaQr";


function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function formatDateText(dateValue) {
  const d = dateValue ? new Date(dateValue) : new Date();
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ar-SA");
}

function buildDemoData() {
  const nowIso = new Date().toISOString();
  const finalTotal = 81.70;
  const vatTotal = 10.66;

  const data = {
    invoiceNo: getQueryParam("invoiceNo") || "14",
    dateText: formatDateText(nowIso),
    statusText: "Confirmed",
    paymentMethodText: "CashOnDelivery",
    total: finalTotal,
    company: {
      arabicName: "صيدلية النور",
      englishName: "Al-Noor Medical Company",
      subtitle: "",
      vatNo: "311263307300003",
      crNo: "7036852742",
      phone: "+966 59 891 9668",
      email: "alnoorparma@gmail.com",
      logoUrl: ""
    },
    address: {
      country: "المملكة العربية السعودية",
      cityDistrict: "الخبرة - حي النزهة",
      street: "طريق الملك فهد",
      buildingNo: "4273",
      secondaryNo: "7966",
      postalCode: "29353"
    },
    summary: {
      subtotal: 81.70,
      offerDiscount: 0,
      couponDiscount: 0,
      pointsDiscount: 0,
      usedPoints: 0,
      finalTotal: 81.70
    },
    items: [
      {
        id: 1,
        name: "EZECHOL 10MG 30TAB",
        qty: 1,
        unitPrice: 81.70,
        discount: 0,
        total: 81.70
      }
    ]
  };

  data.qr = generateZatcaQR({
    seller: data.company.arabicName,
    vat: data.company.vatNo,
    timestamp: nowIso,
    total: finalTotal,
    vatTotal
  });

  return data;
}

export default function InvoicePrintPage() {
  const data = useMemo(() => buildDemoData(), []);

  return (
    <div className="print-page">
      <div className="print-actions-wrap print-hide">
        <button onClick={() => window.print()}>طباعة الفاتورة</button>
        <button className="secondary" onClick={() => window.history.back()}>
          رجوع
        </button>
      </div>

      <Receipt data={data} />
    </div>
  );
}


