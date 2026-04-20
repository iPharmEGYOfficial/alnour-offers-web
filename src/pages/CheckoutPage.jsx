import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useCartStore from "../store/cartStore";
import useAccountStore from "../store/accountStore";
import formatCurrency from "../utils/formatCurrency";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((x) => x.isDefault)?.id || addresses[0]?.id || "",
  );
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [creatingAddress, setCreatingAddress] = useState(
    addresses.length === 0,
  );

  const [addressForm, setAddressForm] = useState({
    label: "المنزل",
    fullName: "",
    phone: "",
    country: "Saudi Arabia",
    city: "",
    district: "",
    street: "",
    buildingNo: "",
    floor: "",
    apartment: "",
    notes: "",
    isDefault: true,
  });

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
      0,
    );
  }, [items]);

  const selectedAddress =
    addresses.find((x) => x.id === selectedAddressId) ||
    addresses.find((x) => x.isDefault) ||
    null;

  function handleAddressChange(e) {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSaveAddress() {
    if (
      !addressForm.fullName.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.city.trim()
    ) {
      alert("من فضلك أدخل الاسم ورقم الجوال والمدينة على الأقل");
      return;
    }

    addAddress(addressForm);

    setTimeout(() => {
      const raw = JSON.parse(localStorage.getItem("alnour_addresses") || "[]");
      const latest = raw[0];
      if (latest?.id) {
        setSelectedAddressId(latest.id);
      }
      setCreatingAddress(false);
    }, 50);
  }

  function handleConfirmOrder() {
    if (!items.length) {
      alert("السلة فارغة");
      return;
    }

    if (!selectedAddress && !creatingAddress) {
      alert("من فضلك اختر عنوانًا أولًا");
      return;
    }

    if (creatingAddress) {
      alert("احفظ العنوان أولًا قبل تأكيد الطلب");
      return;
    }

    const orderNo = `AN-${Date.now()}`;

    const payload = {
      orderNo,
      total,
      paymentMethod,
      address: selectedAddress,
      items,
    };

    clearCart();

    navigate("/order-success", {
      state: payload,
    });
  }

  if (!items.length) {
    return (
      <section className="catalog-section">
        <div className="catalog-section__head">
          <div>
            <h2>إتمام الطلب</h2>
            <p>لا يمكن إكمال الطلب بدون منتجات</p>
          </div>
        </div>

        <div className="catalog-message">
          السلة فارغة حاليًا.
          <div style={{ marginTop: 12 }}>
            <Link to="/offers">العودة إلى المنتجات</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>إتمام الطلب</h2>
          <p>راجع السلة ثم اختر العنوان وطريقة الدفع</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <h3 style={{ marginTop: 0 }}>المنتجات</h3>

          <div style={{ display: "grid", gap: 12 }}>
            {items.map((item) => (
              <div
                key={item.productID}
                style={{
                  border: "1px solid #eef2f7",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {item.productName || item.name || "منتج"}
                </div>
                <div style={{ color: "#64748b", marginTop: 6 }}>
                  الكمية: {item.qty}
                </div>
                <div style={{ color: "#64748b", marginTop: 6 }}>
                  سعر الوحدة: {formatCurrency(item.price)}
                </div>
                <div style={{ fontWeight: 700, marginTop: 6 }}>
                  الإجمالي الفرعي:{" "}
                  {formatCurrency(
                    Number(item.price || 0) * Number(item.qty || 0),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ marginTop: 0 }}>العنوان</h3>

            <button
              type="button"
              onClick={() => setCreatingAddress((v) => !v)}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              {creatingAddress ? "إلغاء" : "إضافة عنوان جديد"}
            </button>
          </div>

          {!creatingAddress && addresses.length > 0 ? (
            <div style={{ display: "grid", gap: 10 }}>
              {addresses.map((address) => (
                <label
                  key={address.id}
                  style={{
                    display: "block",
                    border:
                      selectedAddressId === address.id
                        ? "1px solid #2563eb"
                        : "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 12,
                    cursor: "pointer",
                    background:
                      selectedAddressId === address.id ? "#eff6ff" : "#fff",
                  }}
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={address.id}
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                    style={{ marginLeft: 8 }}
                  />
                  <strong>{address.label}</strong> - {address.fullName}
                  <div style={{ color: "#64748b", marginTop: 6 }}>
                    {address.city} - {address.district} - {address.street}
                  </div>
                  <div style={{ color: "#64748b", marginTop: 4 }}>
                    {address.phone}
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              <input
                name="label"
                value={addressForm.label}
                onChange={handleAddressChange}
                placeholder="اسم العنوان"
                style={inputStyle}
              />
              <input
                name="fullName"
                value={addressForm.fullName}
                onChange={handleAddressChange}
                placeholder="الاسم الكامل"
                style={inputStyle}
              />
              <input
                name="phone"
                value={addressForm.phone}
                onChange={handleAddressChange}
                placeholder="رقم الجوال"
                style={inputStyle}
              />
              <input
                name="city"
                value={addressForm.city}
                onChange={handleAddressChange}
                placeholder="المدينة"
                style={inputStyle}
              />
              <input
                name="district"
                value={addressForm.district}
                onChange={handleAddressChange}
                placeholder="الحي"
                style={inputStyle}
              />
              <input
                name="street"
                value={addressForm.street}
                onChange={handleAddressChange}
                placeholder="الشارع"
                style={inputStyle}
              />
              <input
                name="buildingNo"
                value={addressForm.buildingNo}
                onChange={handleAddressChange}
                placeholder="رقم المبنى"
                style={inputStyle}
              />
              <textarea
                name="notes"
                value={addressForm.notes}
                onChange={handleAddressChange}
                placeholder="ملاحظات إضافية"
                style={{ ...inputStyle, minHeight: 90 }}
              />

              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={addressForm.isDefault}
                  onChange={handleAddressChange}
                />
                تعيين كعنوان افتراضي
              </label>

              <button
                type="button"
                onClick={handleSaveAddress}
                style={primaryBtn}
              >
                حفظ العنوان
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <h3 style={{ marginTop: 0 }}>طريقة الدفع</h3>

          <div style={{ display: "grid", gap: 10 }}>
            <label style={radioCard(paymentMethod === "cash")}>
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                style={{ marginLeft: 8 }}
              />
              الدفع عند الاستلام
            </label>

            <label style={radioCard(paymentMethod === "card")}>
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                style={{ marginLeft: 8 }}
              />
              بطاقة مدى / فيزا
            </label>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 12 }}>
            الإجمالي: {formatCurrency(total)}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleConfirmOrder}
              style={primaryBtn}
            >
              تأكيد الطلب
            </button>

            <Link to="/cart" style={secondaryLink}>
              العودة إلى السلة
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  fontSize: 14,
  outline: "none",
};

const primaryBtn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryLink = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 700,
};

function radioCard(active) {
  return {
    display: "block",
    border: active ? "1px solid #2563eb" : "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 12,
    cursor: "pointer",
    background: active ? "#eff6ff" : "#fff",
  };
}
