import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddressForm from "../components/account/AddressForm";
import AddressCard from "../components/account/AddressCard";
import CheckoutStepper from "../components/checkout/CheckoutStepper";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import useAccountStore from "../store/accountStore";
import formatCurrency from "../utils/formatCurrency";
import orderService from "../services/orderService";
import {
  buildPaymentInfo,
  getPaymentMethods,
  normalizeCountry,
} from "../services/paymentService";

const steps = [
  { key: "cart", label: "السلة" },
  { key: "address", label: "العنوان" },
  { key: "country", label: "الدولة" },
  { key: "payment", label: "طريقة الدفع" },
  { key: "paymentDetails", label: "بيانات الدفع" },
  { key: "review", label: "المراجعة" },
  { key: "success", label: "تم الطلب" },
];

const initialPaymentDetails = {
  phone: "",
  transactionCode: "",
  bankName: "",
  transferReference: "",
  accountName: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  notes: "",
};

function digitsOnly(value = "") {
  return String(value).replace(/\D/g, "");
}

function formatCardNumber(value = "") {
  return digitsOnly(value)
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value = "") {
  const clean = digitsOnly(value).slice(0, 4);
  if (clean.length <= 2) return clean;
  return `${clean.slice(0, 2)}/${clean.slice(2)}`;
}

function maskPhone(country, phone = "") {
  const clean = digitsOnly(phone);
  if (!clean) return "-";
  if (country === "SA") return clean.startsWith("966") ? `+${clean}` : clean;
  return clean.startsWith("20") ? `+${clean}` : clean;
}

function getPaymentExperience(paymentMethod, country) {
  const isSA = country === "SA";

  const map = {
    cash: {
      icon: "💵",
      title: "الدفع عند الاستلام",
      desc: "سيتم تأكيد الطلب عبر الجوال قبل التوصيل.",
      badge: "دفع آمن عند التسليم",
    },
    mada: {
      icon: "💳",
      title: "مدى",
      desc: "تجربة إدخال بطاقة آمنة محليًا. الربط البنكي الحقيقي يتم لاحقًا عبر بوابة دفع.",
      badge: "Saudi Cards",
    },
    visa_master: {
      icon: "💳",
      title: "Visa / MasterCard",
      desc: "لا يتم حفظ رقم البطاقة أو CVV. يتم الاحتفاظ فقط بآخر 4 أرقام لأغراض المراجعة.",
      badge: "Card Payment",
    },
    meeza: {
      icon: "💳",
      title: "ميزة",
      desc: "تجربة دفع محلية للسوق المصري، والربط الحقيقي يكون لاحقًا عبر بوابة دفع مصرية.",
      badge: "Egypt Cards",
    },
    fawry: {
      icon: "🏪",
      title: "فوري",
      desc: "أدخل رقم الموبايل، وسيتم تسجيل كود العملية عند الدفع.",
      badge: "Fawry Egypt",
    },
    vodafone_cash: {
      icon: "📱",
      title: "Vodafone Cash",
      desc: "أدخل رقم المحفظة وكود العملية بعد التحويل.",
      badge: "Wallet",
    },
    stc_pay: {
      icon: "📱",
      title: "STC Pay",
      desc: "أدخل رقم الجوال المرتبط بالمحفظة لإكمال الطلب.",
      badge: "Saudi Wallet",
    },
    bank_transfer: {
      icon: "🏦",
      title: "تحويل بنكي",
      desc: isSA
        ? "أدخل اسم البنك ورقم مرجع التحويل بعد إتمام التحويل."
        : "أدخل اسم البنك ورقم مرجع التحويل أو الإيداع.",
      badge: "Bank Transfer",
    },
  };

  return (
    map[paymentMethod] || {
      icon: "✅",
      title: "بيانات الدفع",
      desc: "استكمل البيانات المطلوبة لطريقة الدفع المختارة.",
      badge: "Payment",
    }
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);
  const updateAddress = useAccountStore((s) => s.updateAddress);
  const deleteAddress = useAccountStore((s) => s.deleteAddress);
  const setDefaultAddress = useAccountStore((s) => s.setDefaultAddress);

  const [step, setStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((x) => x.isDefault)?.id || addresses[0]?.id || "",
  );
  const [creatingAddress, setCreatingAddress] = useState(
    addresses.length === 0,
  );
  const [editingAddress, setEditingAddress] = useState(null);
  const [country, setCountry] = useState(
    normalizeCountry(addresses[0]?.country || user?.country || "SA"),
  );
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentDetails, setPaymentDetails] = useState(initialPaymentDetails);
  const [paymentErrors, setPaymentErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedAddressId && addresses.length) {
      const next = addresses.find((x) => x.isDefault) || addresses[0];
      setSelectedAddressId(next.id);
      setCountry(normalizeCountry(next.country || country));
    }
  }, [addresses, selectedAddressId, country]);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
        0,
      ),
    [items],
  );

  const selectedAddress =
    addresses.find((x) => x.id === selectedAddressId) ||
    addresses.find((x) => x.isDefault) ||
    addresses[0] ||
    null;

  const paymentMethods = useMemo(() => getPaymentMethods(country), [country]);

  const selectedPaymentMethod = paymentMethods.find(
    (x) => x.id === paymentMethod,
  );

  function handleSaveAddress(data) {
    const nextCountry = normalizeCountry(data.country || country);

    if (editingAddress) {
      updateAddress(editingAddress.id, { ...data, country: nextCountry });
      setSelectedAddressId(editingAddress.id);
      setEditingAddress(null);
    } else {
      const saved = addAddress({ ...data, country: nextCountry });
      if (saved?.id) setSelectedAddressId(saved.id);
    }

    setCountry(nextCountry);
    setCreatingAddress(false);
  }

  function startAddAddress() {
    setEditingAddress(null);
    setCreatingAddress(true);
  }

  function startEditAddress(address) {
    setEditingAddress(address);
    setCreatingAddress(true);
  }

  function cancelAddressForm() {
    setEditingAddress(null);
    setCreatingAddress(false);
  }

  function handleDeleteAddress(id) {
    deleteAddress(id);

    const remaining = addresses.filter((x) => x.id !== id);
    if (selectedAddressId === id) {
      const next = remaining.find((x) => x.isDefault) || remaining[0] || null;
      setSelectedAddressId(next?.id || "");
      if (next?.country) setCountry(normalizeCountry(next.country));
    }

    if (editingAddress?.id === id) {
      setEditingAddress(null);
      setCreatingAddress(false);
    }

    if (!remaining.length) setCreatingAddress(true);
  }

  function handleSelectAddress(address) {
    setSelectedAddressId(address.id);
    setCountry(normalizeCountry(address.country || country));
  }

  function handlePaymentDetailsChange(e) {
    const { name, value } = e.target;

    let nextValue = value;

    if (name === "cardNumber") nextValue = formatCardNumber(value);
    if (name === "expiry") nextValue = formatExpiry(value);
    if (name === "cvv") nextValue = digitsOnly(value).slice(0, 4);
    if (name === "phone") nextValue = digitsOnly(value).slice(0, 15);

    setPaymentDetails((prev) => ({ ...prev, [name]: nextValue }));
    setPaymentErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validatePaymentDetails() {
    const errors = {};
    const phone = digitsOnly(paymentDetails.phone);
    const cardNumber = digitsOnly(paymentDetails.cardNumber);

    if (paymentMethod === "cash") {
      if (phone.length < 8) {
        errors.phone = "رقم الجوال مطلوب لتأكيد الطلب عند الاستلام";
      }
    }

    if (["mada", "visa_master", "meeza"].includes(paymentMethod)) {
      if (!paymentDetails.cardName.trim()) {
        errors.cardName = "اسم حامل البطاقة مطلوب";
      }

      if (cardNumber.length < 14) {
        errors.cardNumber = "رقم البطاقة غير مكتمل";
      }

      if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiry)) {
        errors.expiry = "صيغة التاريخ يجب أن تكون MM/YY";
      }

      if (digitsOnly(paymentDetails.cvv).length < 3) {
        errors.cvv = "CVV غير صحيح";
      }
    }

    if (["fawry", "stc_pay", "vodafone_cash"].includes(paymentMethod)) {
      if (phone.length < 8) {
        errors.phone = "رقم الموبايل أو المحفظة مطلوب";
      }
    }

    if (paymentMethod === "bank_transfer") {
      if (!paymentDetails.bankName.trim()) errors.bankName = "اسم البنك مطلوب";
      if (!paymentDetails.transferReference.trim()) {
        errors.transferReference = "رقم مرجع التحويل مطلوب";
      }
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function canGoNext() {
    if (step === 0) return items.length > 0;
    if (step === 1) return Boolean(selectedAddress) && !creatingAddress;
    if (step === 2) return Boolean(country);
    if (step === 3) return Boolean(paymentMethod);
    if (step === 4) return validatePaymentDetails();
    return true;
  }

  function nextStep() {
    if (!canGoNext()) {
      if (step === 0) alert("السلة فارغة");
      if (step === 1) alert("اختر أو أضف عنوان التوصيل أولاً");
      if (step === 2) alert("اختر الدولة");
      if (step === 3) alert("اختر طريقة الدفع");
      return;
    }

    setStep((value) => Math.min(value + 1, steps.length - 2));
  }

  function prevStep() {
    setStep((value) => Math.max(value - 1, 0));
  }

  async function handleConfirmOrder() {
    if (!items.length) return alert("السلة فارغة");
    if (!selectedAddress) return alert("من فضلك اختر عنوان التوصيل");
    if (!validatePaymentDetails()) return;

    try {
      setSubmitting(true);

      const paymentInfo = buildPaymentInfo({
        country,
        methodId: paymentMethod,
        cardForm: {
          cardName: paymentDetails.cardName,
          cardNumber: paymentDetails.cardNumber,
          expiry: paymentDetails.expiry,
          cvv: paymentDetails.cvv,
        },
      });

      const safePaymentInfo = {
        ...paymentInfo,
        methodId: paymentMethod,
        methodLabel: selectedPaymentMethod?.label || paymentMethod,
        phone: maskPhone(country, paymentDetails.phone),
        transactionCode: paymentDetails.transactionCode,
        bankName: paymentDetails.bankName,
        transferReference: paymentDetails.transferReference,
        accountName: paymentDetails.accountName,
        notes: paymentDetails.notes,
        cardHolderName: paymentDetails.cardName,
        cardNumberLast4: paymentDetails.cardNumber
          ? digitsOnly(paymentDetails.cardNumber).slice(-4)
          : "",
        cardNumber: undefined,
        cvv: undefined,
      };

      const res = await orderService.confirmOrder({
        country,
        total,
        paymentMethod,
        paymentInfo: safePaymentInfo,
        address: { ...selectedAddress, country },
        items,
      });

      clearCart();
      setStep(6);

      navigate("/order-success", {
        replace: true,
        state: {
          orderNo: res.order.orderNo,
          total,
          paymentMethod,
          paymentInfo: safePaymentInfo,
          address: { ...selectedAddress, country },
          items,
        },
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (!items.length) {
    return (
      <section className="catalog-section" dir="rtl">
        <CheckoutStepper steps={steps} currentStep={0} />
        <div className="catalog-message">
          لا توجد منتجات في السلة.
          <div style={{ marginTop: 12 }}>
            <Link to="/offers">تصفح المنتجات</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="catalog-section" dir="rtl">
      <div className="catalog-section__head">
        <div>
          <h2>إتمام الطلب</h2>
          <p>تدفق دفع منظم ومهيأ لاحقًا للربط مع بوابة دفع حقيقية</p>
        </div>
      </div>

      <CheckoutStepper steps={steps} currentStep={step} />

      <div style={{ display: "grid", gap: 16 }}>
        {step === 0 && (
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>السلة</h3>

            <div style={{ display: "grid", gap: 12 }}>
              {items.map((item) => (
                <div key={item.productID || item.id} style={innerCardStyle}>
                  <div style={{ fontWeight: 900 }}>
                    {item.productName || item.name || "منتج"}
                  </div>
                  <div style={muted}>الكمية: {item.qty}</div>
                  <div style={muted}>
                    سعر الوحدة: {formatCurrency(item.price)}
                  </div>
                  <div style={{ fontWeight: 900, marginTop: 6 }}>
                    الإجمالي الفرعي:{" "}
                    {formatCurrency(
                      Number(item.price || 0) * Number(item.qty || 0),
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={totalBox}>الإجمالي: {formatCurrency(total)}</div>
          </div>
        )}

        {step === 1 && (
          <div style={cardStyle}>
            <div style={sectionHead}>
              <h3 style={{ margin: 0 }}>العنوان</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Link to="/account/addresses" style={secondaryLink}>
                  إدارة العناوين
                </Link>
                <button
                  type="button"
                  onClick={startAddAddress}
                  style={secondaryBtn}
                >
                  + إضافة عنوان جديد
                </button>
              </div>
            </div>

            {creatingAddress && (
              <div style={formBox}>
                <h4 style={{ marginTop: 0 }}>
                  {editingAddress ? "تعديل العنوان" : "إضافة عنوان جديد"}
                </h4>
                <AddressForm
                  initialValues={editingAddress || undefined}
                  onSave={handleSaveAddress}
                  onCancel={cancelAddressForm}
                />
              </div>
            )}

            {addresses.length ? (
              <div style={{ display: "grid", gap: 12 }}>
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    item={address}
                    selectable
                    selected={selectedAddressId === address.id}
                    onSelect={handleSelectAddress}
                    onEdit={startEditAddress}
                    onDelete={handleDeleteAddress}
                    onSetDefault={(id) => {
                      setDefaultAddress(id);
                      setSelectedAddressId(id);
                    }}
                  />
                ))}
              </div>
            ) : (
              !creatingAddress && (
                <div className="catalog-message">لا يوجد عنوان محفوظ.</div>
              )
            )}
          </div>
        )}

        {step === 2 && (
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>الدولة</h3>
            <p style={muted}>
              تم اختيار الدولة تلقائيًا من العنوان. اختيار الدولة يحدد العملة
              ووسائل الدفع والضريبة لاحقًا.
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <label style={radioCard(country === "SA")}>
                <input
                  type="radio"
                  name="country"
                  checked={country === "SA"}
                  onChange={() => {
                    setCountry("SA");
                    setPaymentMethod("cash");
                    setPaymentDetails(initialPaymentDetails);
                  }}
                  style={{ marginLeft: 8 }}
                />
                🇸🇦 السعودية
              </label>

              <label style={radioCard(country === "EG")}>
                <input
                  type="radio"
                  name="country"
                  checked={country === "EG"}
                  onChange={() => {
                    setCountry("EG");
                    setPaymentMethod("cash");
                    setPaymentDetails(initialPaymentDetails);
                  }}
                  style={{ marginLeft: 8 }}
                />
                🇪🇬 مصر
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>طريقة الدفع</h3>
            <p style={muted}>اختر طريقة الدفع المناسبة لبلدك.</p>

            <div style={{ display: "grid", gap: 10 }}>
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  style={radioCard(paymentMethod === method.id)}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method.id}
                    onChange={() => {
                      setPaymentMethod(method.id);
                      setPaymentDetails(initialPaymentDetails);
                      setPaymentErrors({});
                    }}
                    style={{ marginLeft: 8 }}
                  />
                  <strong>{method.label}</strong>
                  <div style={muted}>{method.description}</div>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={cardStyle}>
            <PaymentDetailsFields
              paymentMethod={paymentMethod}
              country={country}
              paymentDetails={paymentDetails}
              paymentErrors={paymentErrors}
              onChange={handlePaymentDetailsChange}
            />
          </div>
        )}

        {step === 5 && (
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>مراجعة الطلب</h3>

            <div style={reviewGrid}>
              <ReviewItem
                title="العميل"
                lines={[
                  user?.name || selectedAddress?.fullName || "-",
                  user?.phone || selectedAddress?.phone || "-",
                ]}
              />

              <ReviewItem
                title="العنوان"
                lines={[
                  `${selectedAddress?.city || "-"} - ${selectedAddress?.district || "-"}`,
                  selectedAddress?.street || "-",
                ]}
              />

              <ReviewItem
                title="الدولة"
                lines={[country === "EG" ? "مصر" : "السعودية"]}
              />

              <ReviewItem
                title="الدفع"
                lines={[
                  selectedPaymentMethod?.label || paymentMethod,
                  paymentDetails.phone
                    ? `رقم التواصل: ${maskPhone(country, paymentDetails.phone)}`
                    : "",
                  paymentDetails.cardNumber
                    ? `بطاقة تنتهي بـ ${digitsOnly(paymentDetails.cardNumber).slice(-4)}`
                    : "",
                  paymentDetails.transferReference
                    ? `مرجع التحويل: ${paymentDetails.transferReference}`
                    : "",
                ].filter(Boolean)}
              />
            </div>

            <div style={totalBox}>الإجمالي: {formatCurrency(total)}</div>
          </div>
        )}

        <div style={footerBar}>
          <button
            type="button"
            onClick={prevStep}
            style={secondaryBtn}
            disabled={step === 0}
          >
            السابق
          </button>

          <div style={{ flex: 1 }} />

          {step < 5 ? (
            <button type="button" onClick={nextStep} style={primaryBtn}>
              التالي
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmOrder}
              style={primaryBtn}
              disabled={submitting}
            >
              {submitting ? "جاري تأكيد الطلب..." : "تأكيد الطلب"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function PaymentDetailsFields({
  paymentMethod,
  country,
  paymentDetails,
  paymentErrors,
  onChange,
}) {
  const exp = getPaymentExperience(paymentMethod, country);

  return (
    <div style={paymentBox}>
      <div style={paymentHeader}>
        <div style={paymentIcon}>{exp.icon}</div>
        <div>
          <div style={paymentBadge}>{exp.badge}</div>
          <h3 style={{ margin: "4px 0 0" }}>{exp.title}</h3>
          <p style={muted}>{exp.desc}</p>
        </div>
      </div>

      {paymentMethod === "cash" && (
        <div style={paymentGrid}>
          <Field
            label="رقم الجوال للتأكيد"
            name="phone"
            value={paymentDetails.phone}
            error={paymentErrors.phone}
            onChange={onChange}
            inputMode="numeric"
          />
          <Field
            label="ملاحظات للمندوب"
            name="notes"
            value={paymentDetails.notes}
            onChange={onChange}
            placeholder="مثال: الاتصال قبل الوصول، توصيل للمكتب..."
          />
        </div>
      )}

      {["mada", "visa_master", "meeza"].includes(paymentMethod) && (
        <div style={paymentGrid}>
          <div style={cardPreview}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                {paymentMethod === "mada"
                  ? "MADA"
                  : paymentMethod === "meeza"
                    ? "MEEZA"
                    : "VISA / MASTER"}
              </span>
              <span>●●●</span>
            </div>
            <div style={{ fontSize: 20, letterSpacing: 2 }}>
              {paymentDetails.cardNumber || "•••• •••• •••• ••••"}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <span>{paymentDetails.cardName || "CARD HOLDER"}</span>
              <span>{paymentDetails.expiry || "MM/YY"}</span>
            </div>
          </div>

          <Field
            label="اسم حامل البطاقة"
            name="cardName"
            value={paymentDetails.cardName}
            error={paymentErrors.cardName}
            onChange={onChange}
          />
          <Field
            label="رقم البطاقة"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            error={paymentErrors.cardNumber}
            onChange={onChange}
            inputMode="numeric"
            maxLength={23}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <Field
              label="تاريخ الانتهاء"
              name="expiry"
              value={paymentDetails.expiry}
              error={paymentErrors.expiry}
              onChange={onChange}
              placeholder="MM/YY"
              maxLength={5}
            />
            <Field
              label="CVV"
              name="cvv"
              value={paymentDetails.cvv}
              error={paymentErrors.cvv}
              onChange={onChange}
              inputMode="numeric"
              maxLength={4}
            />
          </div>
          <div style={secureNote}>
            🔒 لا يتم حفظ رقم البطاقة أو CVV. يتم حفظ آخر 4 أرقام فقط للفاتورة
            والمراجعة.
          </div>
        </div>
      )}

      {["fawry", "stc_pay", "vodafone_cash"].includes(paymentMethod) && (
        <div style={paymentGrid}>
          <Field
            label={
              country === "SA"
                ? "رقم الجوال المرتبط بالمحفظة"
                : "رقم الموبايل / المحفظة"
            }
            name="phone"
            value={paymentDetails.phone}
            error={paymentErrors.phone}
            onChange={onChange}
            inputMode="numeric"
          />
          <Field
            label="كود العملية أو المرجع"
            name="transactionCode"
            value={paymentDetails.transactionCode}
            onChange={onChange}
            placeholder="اختياري الآن، وسيكون إلزاميًا عند الربط الحقيقي"
          />
          <div style={walletHint}>
            سيتم تسجيل الطلب الآن، وعند الربط الحقيقي سيتم إرسال طلب الدفع أو
            التحقق من العملية عبر الـ API.
          </div>
        </div>
      )}

      {paymentMethod === "bank_transfer" && (
        <div style={paymentGrid}>
          <Field
            label="اسم البنك"
            name="bankName"
            value={paymentDetails.bankName}
            error={paymentErrors.bankName}
            onChange={onChange}
          />
          <Field
            label="اسم صاحب الحساب"
            name="accountName"
            value={paymentDetails.accountName}
            onChange={onChange}
          />
          <Field
            label="رقم مرجع التحويل"
            name="transferReference"
            value={paymentDetails.transferReference}
            error={paymentErrors.transferReference}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
}

function Field({ label, name, value, error, onChange, ...props }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontWeight: 900 }}>{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
        {...props}
      />
      {error && (
        <span style={{ color: "#b91c1c", fontWeight: 800 }}>{error}</span>
      )}
    </label>
  );
}

function ReviewItem({ title, lines }) {
  return (
    <div style={reviewItem}>
      <strong>{title}</strong>
      {lines.map((line, idx) => (
        <div key={idx} style={muted}>
          {line}
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
};

const innerCardStyle = {
  border: "1px solid #eef2f7",
  borderRadius: 14,
  padding: 14,
};

const muted = { color: "#64748b", marginTop: 6 };

const sectionHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 14,
};

const footerBar = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  padding: 14,
  borderRadius: 18,
  background: "#fff",
  border: "1px solid #e5e7eb",
  position: "sticky",
  bottom: 12,
  zIndex: 10,
};

const formBox = {
  marginBottom: 16,
  padding: 14,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const primaryBtn = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryLink = {
  ...secondaryBtn,
  display: "inline-block",
  textDecoration: "none",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  fontSize: 15,
  boxSizing: "border-box",
};

const paymentBox = {
  padding: 16,
  borderRadius: 18,
  border: "1px solid #dbeafe",
  background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  display: "grid",
  gap: 14,
};

const paymentHeader = {
  display: "flex",
  gap: 14,
  alignItems: "flex-start",
  borderBottom: "1px solid #e5e7eb",
  paddingBottom: 14,
};

const paymentIcon = {
  width: 54,
  height: 54,
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  background: "#eff6ff",
  fontSize: 28,
};

const paymentBadge = {
  width: "fit-content",
  padding: "4px 10px",
  borderRadius: 999,
  background: "#dbeafe",
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 900,
};

const paymentGrid = {
  display: "grid",
  gap: 12,
};

const cardPreview = {
  background: "linear-gradient(135deg,#0f172a,#2563eb)",
  color: "#fff",
  borderRadius: 18,
  padding: 18,
  minHeight: 120,
  display: "grid",
  gap: 18,
  fontWeight: 900,
  boxShadow: "0 12px 30px rgba(37,99,235,0.24)",
};

const secureNote = {
  padding: 12,
  borderRadius: 12,
  background: "#ecfdf5",
  color: "#047857",
  fontWeight: 900,
};

const walletHint = {
  padding: 12,
  borderRadius: 12,
  background: "#fff7ed",
  color: "#9a3412",
  fontWeight: 800,
};

function radioCard(active) {
  return {
    display: "block",
    border: active ? "2px solid #2563eb" : "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 14,
    cursor: "pointer",
    background: active ? "#eff6ff" : "#fff",
  };
}

const reviewGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const reviewItem = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const totalBox = {
  marginTop: 16,
  padding: 16,
  borderRadius: 16,
  border: "2px solid #2563eb",
  fontWeight: 900,
  fontSize: 22,
};
