export function CardGatewayPanel({
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  expiry,
  setExpiry,
  cvv,
  setCvv,
  onScan
}) {
  return (
    <div className="payment-panel-box">
      <div className="payment-panel-head">
        <h4>بيانات البطاقة</h4>
        <button type="button" className="secondary-btn" onClick={onScan}>
          مسح البطاقة
        </button>
      </div>

      <div className="payment-input-grid">
        <input
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="رقم البطاقة"
        />

        <input
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="اسم حامل البطاقة"
        />

        <input
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          placeholder="MM/YY"
        />

        <input
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="CVV"
        />
      </div>

      <p className="subtle">
        يجب إرسال بيانات البطاقة إلى مزود دفع آمن يدعم Tokenization و3D Secure.
      </p>
    </div>
  );
}

export function TamaraPanel() {
  return (
    <div className="payment-panel-box">
      <h4>تمارا</h4>
      <p className="subtle">
        سيتم إنشاء جلسة دفع عبر Tamara Checkout Session عند ربط الخدمة الفعلية.
      </p>
    </div>
  );
}

export function FawryPanel() {
  return (
    <div className="payment-panel-box">
      <h4>فوري</h4>
      <p className="subtle">
        سيتم إنشاء جلسة دفع وإظهار كود السداد عند الربط الفعلي.
      </p>
    </div>
  );
}

export function InstaPayManualPanel({
  transferReference,
  setTransferReference
}) {
  return (
    <div className="payment-panel-box">
      <h4>إنستا باي (تحويل يدوي)</h4>
      <p className="subtle">
        بعد التحويل اليدوي يرجى إدخال مرجع العملية ليتم مراجعته من قبل الإدارة.
      </p>

      <input
        value={transferReference}
        onChange={(e) => setTransferReference(e.target.value)}
        placeholder="مرجع العملية / رقم التحويل"
      />
    </div>
  );
}

export function CashOnDeliveryPanel() {
  return (
    <div className="payment-panel-box">
      <h4>الدفع عند الاستلام</h4>
      <p className="subtle">
        سيتم إنشاء الطلب أولًا ثم مراجعته وتأكيده من الإدارة.
      </p>
    </div>
  );
}