import TaxQrBlock from "./TaxQrBlock";
import "../styles/receipt.css";

function money(v) {
  const n = Number(v ?? 0);
  return n.toFixed(2);
}

export default function Receipt({ data }) {
  const items = Array.isArray(data?.items) ? data.items : [];
  const company = data?.company || {};
  const address = data?.address || {};
  const summary = data?.summary || {};

  return (
    <div className="receipt" dir="rtl">
      <div className="receipt-header no-break">
        {company.logoUrl ? (
          <img src={company.logoUrl} alt="logo" className="receipt-logo" />
        ) : null}

        <h1 className="receipt-title-ar">{company.arabicName || "صيدلية النور"}</h1>
        <div className="receipt-title-en">{company.englishName || "Al-Nour Offers"}</div>
        {company.subtitle ? <div className="receipt-subtitle">{company.subtitle}</div> : null}
      </div>

      <hr className="receipt-divider" />

      <div className="receipt-meta no-break">
        <p><span className="receipt-label">رقم الفاتورة:</span> {data?.invoiceNo ?? "-"}</p>
        <p><span className="receipt-label">التاريخ:</span> {data?.dateText ?? data?.date ?? "-"}</p>
        <p><span className="receipt-label">الحالة:</span> {data?.statusText ?? "-"}</p>
        <p><span className="receipt-label">طريقة الدفع:</span> {data?.paymentMethodText ?? "-"}</p>
      </div>

      <hr className="receipt-divider" />

      <div className="receipt-grid-2 no-break">
        <div className="receipt-card">
          <div className="receipt-section-title">بيانات المنشأة</div>
          <p><span className="receipt-label">اسم المنشأة:</span> {company.englishName || company.arabicName || "-"}</p>
          <p><span className="receipt-label">الرقم الضريبي:</span> {company.vatNo || "-"}</p>
          <p><span className="receipt-label">السجل التجاري:</span> {company.crNo || "-"}</p>
          <p><span className="receipt-label">الهاتف:</span> {company.phone || "-"}</p>
          <p><span className="receipt-label">البريد الإلكتروني:</span> {company.email || "-"}</p>
        </div>

        <div className="receipt-card">
          <div className="receipt-section-title">العنوان</div>
          <p>{address.country || "-"}</p>
          <p>{address.cityDistrict || "-"}</p>
          <p>{address.street || "-"}</p>
          <p><span className="receipt-label">رقم المبنى:</span> {address.buildingNo || "-"}</p>
          <p><span className="receipt-label">الرقم الفرعي:</span> {address.secondaryNo || "-"}</p>
          <p><span className="receipt-label">الرمز البريدي:</span> {address.postalCode || "-"}</p>
        </div>
      </div>

      <hr className="receipt-divider" />

      <div className="receipt-block no-break">
        <div className="receipt-section-title">معلومات الطلب</div>

        <div className="receipt-summary-row">
          <span className="receipt-label">الإجمالي قبل الخصم:</span>
          <span>{money(summary.subtotal)} ر.س</span>
        </div>

        <div className="receipt-summary-row">
          <span className="receipt-label">خصم العروض:</span>
          <span>{money(summary.offerDiscount)} ر.س</span>
        </div>

        <div className="receipt-summary-row">
          <span className="receipt-label">خصم الكوبون:</span>
          <span>{money(summary.couponDiscount)} ر.س</span>
        </div>

        <div className="receipt-summary-row">
          <span className="receipt-label">خصم النقاط:</span>
          <span>{money(summary.pointsDiscount)} ر.س</span>
        </div>

        <div className="receipt-summary-row">
          <span className="receipt-label">النقاط المستخدمة:</span>
          <span>{summary.usedPoints ?? 0}</span>
        </div>
      </div>

      <hr className="receipt-divider" />

      <div className="receipt-block no-break">
        <div className="receipt-section-title">أصناف الفاتورة</div>

        <table className="receipt-items-table">
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الكمية</th>
              <th>سعر الوحدة</th>
              <th>الخصم</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id ?? i}>
                <td>
                  <div className="receipt-item-name">{item.name ?? "-"}</div>
                </td>
                <td>{item.qty ?? 0}</td>
                <td>{money(item.unitPrice)} ر.س</td>
                <td>{money(item.discount)} ر.س</td>
                <td>{money(item.total)} ر.س</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="receipt-total-box no-break">
        <div className="receipt-summary-row receipt-grand-total">
          <span>الإجمالي النهائي:</span>
          <span>{money(summary.finalTotal ?? data?.total)} ر.س</span>
        </div>
      </div>

      <TaxQrBlock data={data?.qr} caption="امسح الرمز للتحقق الضريبي" />

      <div className="receipt-footer no-break">
        <div className="receipt-thanks">شكرا لتسوقكم من صيدلية النور</div>
        <div className="receipt-note">نتمنى لكم دوام الصحة والعافية</div>
      </div>
    </div>
  );
}