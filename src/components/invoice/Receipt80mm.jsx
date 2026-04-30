import { QRCodeSVG } from "qrcode.react";
import companyConfig from "../../config/companyConfig";
import formatCurrency from "../../utils/formatCurrency";

function getCountry(order) {
  return (
    order?.country ||
    order?.address?.country ||
    companyConfig.defaultCountry ||
    "SA"
  );
}

function getTaxConfig(country) {
  return companyConfig.tax?.[country] || companyConfig.tax?.SA;
}

function calcTotals(order) {
  const country = getCountry(order);
  const taxConfig = getTaxConfig(country);
  const total = Number(order?.total || 0);
  const rate = Number(taxConfig.rate || 0);

  const totalWithoutVat = rate > 0 ? total / (1 + rate) : total;
  const vatAmount = total - totalWithoutVat;

  return {
    country,
    taxConfig,
    total,
    totalWithoutVat,
    vatAmount,
  };
}

function getInvoiceUrl(order) {
  const orderNo = order?.orderNo || order?.id || "";
  return `${companyConfig.storeUrl}/invoice/${encodeURIComponent(orderNo)}`;
}

export default function Receipt80mm({ order }) {
  if (!order) {
    return (
      <div dir="rtl" style={receiptStyle}>
        <div style={centerBold}>الطلب غير موجود</div>
      </div>
    );
  }

  const { country, taxConfig, total, totalWithoutVat, vatAmount } =
    calcTotals(order);

  const invoiceNo = order.orderNo || order.id || "-";
  const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();

  const items = Array.isArray(order.items) ? order.items : [];
  const qrValue = getInvoiceUrl(order);

  return (
    <div id="receipt-80mm" dir="rtl" style={receiptStyle}>
      <style>
        {`
          @media print {
            html, body {
              width: 80mm !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }

            body * {
              visibility: hidden !important;
            }

            #receipt-80mm, #receipt-80mm * {
              visibility: visible !important;
            }

            #receipt-80mm {
              position: absolute !important;
              top: 0 !important;
              right: 0 !important;
              width: 72mm !important;
              margin: 0 !important;
              padding: 4mm !important;
              box-sizing: border-box !important;
            }

            @page {
              size: 80mm auto;
              margin: 0;
            }
          }
        `}
      </style>

      <div style={companyBox}>
        <img
          src={companyConfig.logoUrl}
          alt={companyConfig.legalNameAr}
          style={logoStyle}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <div style={companyNameAr}>{companyConfig.legalNameAr}</div>
        <div style={companyNameEn}>{companyConfig.legalNameEn}</div>

        <div style={smallLine}>س.ت: {companyConfig.commercialRegister}</div>
        <div style={smallLine}>الرقم الضريبي: {companyConfig.vatNumber}</div>
        <div style={smallLine}>{companyConfig.phonePrimary}</div>
        <div style={smallLine}>{companyConfig.phoneSecondary}</div>
      </div>

      <div style={dash} />

      <div style={titleStyle}>فاتورة ضريبية مبسطة</div>
      <div style={titleEn}>Simplified Tax Invoice</div>

      <div style={infoGrid}>
        <span>رقم الفاتورة</span>
        <strong>{invoiceNo}</strong>

        <span>التاريخ</span>
        <strong>{createdAt.toLocaleDateString("ar-SA")}</strong>

        <span>الوقت</span>
        <strong>{createdAt.toLocaleTimeString("ar-SA")}</strong>

        <span>الدولة</span>
        <strong>{taxConfig.countryNameAr}</strong>
      </div>

      <div style={dash} />

      <div style={sectionTitle}>بيانات العميل</div>
      <div style={lineText}>
        {order.address?.fullName || order.customerName || "عميل صيدلية النور"}
      </div>
      <div style={lineText}>
        {order.address?.phone || order.customerPhone || "-"}
      </div>

      <div style={dash} />

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thItem}>الصنف</th>
            <th style={thSmall}>ك</th>
            <th style={thSmall}>السعر</th>
            <th style={thSmall}>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const name = item.productName || item.name || "منتج";
            const qty = Number(item.qty || 1);
            const price = Number(item.price || 0);
            const lineTotal = qty * price;

            return (
              <tr key={item.productID || item.id || index}>
                <td style={tdItem}>{name}</td>
                <td style={tdSmall}>{qty}</td>
                <td style={tdSmall}>{formatCurrency(price)}</td>
                <td style={tdSmall}>{formatCurrency(lineTotal)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={dash} />

      <div style={totalsBox}>
        <Row
          label="الإجمالي بدون الضريبة"
          value={formatCurrency(totalWithoutVat)}
        />
        <Row
          label={`${taxConfig.label} ${Math.round(taxConfig.rate * 100)}%`}
          value={formatCurrency(vatAmount)}
        />
        <Row label="الإجمالي المستحق" value={formatCurrency(total)} strong />
      </div>

      <div style={dash} />

      <div style={paymentBox}>
        <Row
          label="طريقة الدفع"
          value={order.paymentInfo?.methodLabel || order.paymentMethod || "-"}
        />
        {order.paymentInfo?.cardNumberLast4 && (
          <Row
            label="بطاقة تنتهي بـ"
            value={order.paymentInfo.cardNumberLast4}
          />
        )}
        {order.paymentInfo?.phone && (
          <Row label="رقم التواصل" value={order.paymentInfo.phone} />
        )}
      </div>

      <div style={qrBox}>
        <QRCodeSVG value={qrValue} size={116} level="M" includeMargin />
        <div style={qrText}>امسح الكود لفتح المتجر / الفاتورة</div>
        <div style={urlText}>{companyConfig.storeUrl}</div>
      </div>

      <div style={dash} />

      <div style={footerText}>** شكراً لثقتكم **</div>
      <div style={footerSub}>iPharmEGY × Al-Noor</div>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div style={rowStyle}>
      <span>{label}</span>
      <strong style={strong ? grandTotal : undefined}>{value}</strong>
    </div>
  );
}

const receiptStyle = {
  width: "72mm",
  minHeight: "auto",
  margin: "0 auto",
  padding: "4mm",
  boxSizing: "border-box",
  background: "#fff",
  color: "#000",
  fontFamily: '"Simplified Arabic", "Arial", sans-serif',
  fontSize: "12px",
  lineHeight: 1.35,
};

const companyBox = {
  textAlign: "center",
  border: "1px solid #111",
  borderRadius: 6,
  padding: "6px 5px",
};

const logoStyle = {
  width: 46,
  height: 46,
  objectFit: "contain",
  marginBottom: 4,
};

const companyNameAr = {
  fontSize: 17,
  fontWeight: 900,
};

const companyNameEn = {
  fontFamily: "Times New Roman, serif",
  fontSize: 12,
  fontWeight: 700,
};

const smallLine = {
  fontSize: 11,
  fontWeight: 700,
  marginTop: 2,
};

const dash = {
  borderTop: "1px dashed #000",
  margin: "8px 0",
};

const titleStyle = {
  textAlign: "center",
  fontSize: 16,
  fontWeight: 900,
};

const titleEn = {
  textAlign: "center",
  fontFamily: "Times New Roman, serif",
  fontSize: 12,
  fontWeight: 700,
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "3px 8px",
  marginTop: 8,
  fontSize: 11,
};

const sectionTitle = {
  textAlign: "center",
  fontWeight: 900,
  fontSize: 13,
  marginBottom: 4,
};

const lineText = {
  textAlign: "center",
  fontSize: 11,
  fontWeight: 700,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 10,
};

const thItem = {
  border: "1px solid #000",
  padding: 3,
  textAlign: "right",
  width: "42%",
};

const thSmall = {
  border: "1px solid #000",
  padding: 3,
  textAlign: "center",
};

const tdItem = {
  border: "1px solid #000",
  padding: 3,
  textAlign: "right",
  fontWeight: 700,
  wordBreak: "break-word",
};

const tdSmall = {
  border: "1px solid #000",
  padding: 3,
  textAlign: "center",
  fontWeight: 700,
};

const totalsBox = {
  border: "1px solid #000",
  borderRadius: 5,
  padding: 5,
};

const paymentBox = {
  fontSize: 11,
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 8,
  marginBottom: 4,
  fontSize: 11,
  fontWeight: 700,
};

const grandTotal = {
  fontSize: 15,
  fontWeight: 900,
};

const qrBox = {
  textAlign: "center",
  marginTop: 8,
};

const qrText = {
  fontSize: 10,
  fontWeight: 800,
  marginTop: 4,
};

const urlText = {
  fontSize: 9,
  direction: "ltr",
  fontFamily: "Arial, sans-serif",
  wordBreak: "break-all",
};

const footerText = {
  textAlign: "center",
  fontSize: 14,
  fontWeight: 900,
};

const footerSub = {
  textAlign: "center",
  fontSize: 10,
  fontFamily: "Times New Roman, serif",
  fontWeight: 700,
};

const centerBold = {
  textAlign: "center",
  fontWeight: 900,
};
