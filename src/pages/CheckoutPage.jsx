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
  { key: "payment", label: "الدفع" },
  { key: "review", label: "المراجعة" },
  { key: "success", label: "تم الطلب" },
];

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
  const [creatingAddress, setCreatingAddress] = useState(addresses.length === 0);
  const [editingAddress, setEditingAddress] = useState(null);
  const [country, setCountry] = useState(
    normalizeCountry(addresses[0]?.country || user?.country || "SA"),
  );
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardForm, setCardForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
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

  function handleSaveAddress(data) {
    if (editingAddress) {
      updateAddress(editingAddress.id, { ...data, country: data.country || country });
      setSelectedAddressId(editingAddress.id);
      setEditingAddress(null);
    } else {
      const saved = addAddress({ ...data, country: data.country || country });
      if (saved?.id) setSelectedAddressId(saved.id);
    }

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

    if (!remaining.length) {
      setCreatingAddress(true);
    }
  }

  function handleSelectAddress(address) {
    setSelectedAddressId(address.id);
    setCountry(normalizeCountry(address.country || country));
  }

  function canGoNext() {
    if (step === 0) return items.length > 0;
    if (step === 1) return Boolean(selectedAddress) && !creatingAddress;
    if (step === 2) return Boolean(country);
    if (step === 3) return Boolean(paymentMethod);
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

  function handleCardChange(e) {
    const { name, value } = e.target;
    setCardForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleConfirmOrder() {
    if (!items.length) {
      alert("السلة فارغة");
      return;
    }

    if (!selectedAddress) {
      alert("من فضلك اختر عنوان التوصيل");
      return;
    }

    try {
      setSubmitting(true);

      const paymentInfo = buildPaymentInfo({
        country,
        methodId: paymentMethod,
        cardForm,
      });

      const res = await orderService.confirmOrder({
        country,
        total,
        paymentMethod,
        paymentInfo,
        address: { ...selectedAddress, country },
        items,
      });

      clearCart();
      setStep(5);

      navigate("/order-success", {
        replace: true,
        state: {
          orderNo: res.order.orderNo,
          total,
          paymentMethod,
          paymentInfo,
          address: selectedAddress,
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
          <p>خطوات منظمة لإتمام الشراء بدون استخدام زر الرجوع في المتصفح</p>
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
                  <div style={muted}>سعر الوحدة: {formatCurrency(item.price)}</div>
                  <div style={{ fontWeight: 900, marginTop: 6 }}>
                    الإجمالي الفرعي:{" "}
                    {formatCurrency(Number(item.price || 0) * Number(item.qty || 0))}
                  </div>
                </div>
              ))}
            </div>
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
                <button type="button" onClick={startAddAddress} style={secondaryBtn}>
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
            <p style={muted}>اختيار الدولة يحدد وسائل الدفع المناسبة للسوق المحلي.</p>

            <div style={{ display: "grid", gap: 10 }}>
              <label style={radioCard(country === "SA")}>
                <input
                  type="radio"
                  name="country"
                  checked={country === "SA"}
                  onChange={() => {
                    setCountry("SA");
                    setPaymentMethod("cash");
                  }}
                  style={{ marginLeft: 8 }}
                />
                السعودية
              </label>

              <label style={radioCard(country === "EG")}>
                <input
                  type="radio"
                  name="country"
                  checked={country === "EG"}
                  onChange={() => {
                    setCountry("EG");
                    setPaymentMethod("cash");
                  }}
                  style={{ marginLeft: 8 }}
                />
                مصر
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>طريقة الدفع</h3>

            <div style={{ display: "grid", gap: 10 }}>
              {paymentMethods.map((method) => (
                <label key={method.id} style={radioCard(paymentMethod === method.id)}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    style={{ marginLeft: 8 }}
                  />
                  <strong>{method.label}</strong>
                  <div style={muted}>{method.description}</div>
                </label>
              ))}

              {["mada", "visa_master", "meeza"].includes(paymentMethod) && (
                <div style={cardPaymentBox}>
                  <h4 style={{ margin: 0 }}>بيانات البطاقة - تجربة محلية</h4>
                  <input
                    name="cardName"
                    value={cardForm.cardName}
                    onChange={handleCardChange}
                    placeholder="اسم حامل البطاقة"
                    style={inputStyle}
                  />
                  <input
                    name="cardNumber"
                    value={cardForm.cardNumber}
                    onChange={handleCardChange}
                    placeholder="رقم البطاقة"
                    inputMode="numeric"
                    maxLength={19}
                    style={inputStyle}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input
                      name="expiry"
                      value={cardForm.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      style={inputStyle}
                    />
                    <input
                      name="cvv"
                      value={cardForm.cvv}
                      onChange={handleCardChange}
                      placeholder="CVV"
                      inputMode="numeric"
                      maxLength={4}
                      style={inputStyle}
                    />
                  </div>
                  <div style={muted}>لا يتم إرسال أو حفظ بيانات البطاقة. هذه تجربة محلية فقط.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>مراجعة الطلب</h3>
            <div style={reviewGrid}>
              <div>
                <strong>العميل</strong>
                <div style={muted}>{user?.name || selectedAddress?.fullName || "-"}</div>
                <div style={muted}>{user?.phone || selectedAddress?.phone || "-"}</div>
              </div>
              <div>
                <strong>العنوان</strong>
                <div style={muted}>
                  {selectedAddress?.city || "-"} - {selectedAddress?.district || "-"} -{" "}
                  {selectedAddress?.street || "-"}
                </div>
              </div>
              <div>
                <strong>الدولة</strong>
                <div style={muted}>{country === "EG" ? "مصر" : "السعودية"}</div>
              </div>
              <div>
                <strong>الدفع</strong>
                <div style={muted}>
                  {paymentMethods.find((x) => x.id === paymentMethod)?.label || paymentMethod}
                </div>
              </div>
            </div>

            <div style={totalBox}>الإجمالي: {formatCurrency(total)}</div>
          </div>
        )}

        <div style={footerBar}>
          <button type="button" onClick={prevStep} style={secondaryBtn} disabled={step === 0}>
            السابق
          </button>

          <div style={{ flex: 1 }} />

          {step < 4 ? (
            <button type="button" onClick={nextStep} style={primaryBtn}>
              التالي
            </button>
          ) : (
            <button type="button" onClick={handleConfirmOrder} style={primaryBtn} disabled={submitting}>
              {submitting ? "جاري تأكيد الطلب..." : "تأكيد الطلب"}
            </button>
          )}
        </div>
      </div>
    </section>
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

const muted = {
  color: "#64748b",
  marginTop: 6,
};

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

const cardPaymentBox = {
  marginTop: 12,
  padding: 14,
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  background: "#eff6ff",
  display: "grid",
  gap: 10,
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

const totalBox = {
  marginTop: 16,
  padding: 16,
  borderRadius: 16,
  border: "2px solid #2563eb",
  fontWeight: 900,
  fontSize: 22,
};
