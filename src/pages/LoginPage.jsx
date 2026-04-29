import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useAccountStore from "../store/accountStore";
import useCartStore from "../store/cartStore";
import { findCustomerByPhone } from "../services/customerService";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const setAccountCustomer = useAccountStore((s) => s.setCustomer);
  const importAddresses = useAccountStore((s) => s.importAddresses);
  const setCartCustomer = useCartStore((s) => s.setCustomer);

  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");

  const normalizedPhone = useMemo(
    () => phone.replace(/[^\d+]/g, "").trim(),
    [phone],
  );

  useEffect(() => {
    setError("");

    if (normalizedPhone.length < 8) {
      setCustomer(null);
      return;
    }

    const found = findCustomerByPhone(normalizedPhone);
    setCustomer(found);

    if (!found) {
      setError("رقم الجوال غير مسجل في بيانات العملاء المحلية");
    }
  }, [normalizedPhone]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!normalizedPhone) {
      alert("أدخل رقم الجوال");
      return;
    }

    if (!customer) {
      alert("هذا الرقم غير مسجل. أضفه أولاً في src/data/customers.json");
      return;
    }

    const user = login(customer);
    setAccountCustomer(user.id);
    setCartCustomer(user.id);

    if (Array.isArray(customer.addresses) && customer.addresses.length) {
      importAddresses(customer.addresses);
    }

    navigate("/", { replace: true, state: { welcome: customer.welcomeMessage || `أهلاً ${customer.name}` } });
  }

  return (
    <section className="catalog-section" dir="rtl">
      <div className="catalog-section__head">
        <div>
          <h2>تسجيل الدخول</h2>
          <p>ادخل رقم جوالك المسجل لإظهار بياناتك تلقائياً</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={cardStyle}>
        <label style={labelStyle}>رقم الجوال</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
          placeholder="مثال: 0535272372"
          inputMode="tel"
        />

        {customer && (
          <div style={successBox}>
            <div style={{ fontWeight: 900 }}>مرحباً، {customer.name}</div>
            <div>الدولة: {customer.country === "EG" ? "مصر" : "السعودية"}</div>
            {!!customer.city && <div>المدينة: {customer.city}</div>}
          </div>
        )}

        {error && <div style={errorBox}>{error}</div>}

        <button type="submit" style={primaryBtn} disabled={!customer}>
          دخول
        </button>

        <div style={{ marginTop: 14 }}>
          <Link to="/">العودة للرئيسية</Link>
        </div>
      </form>
    </section>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 20,
  maxWidth: 460,
  marginRight: "auto",
  boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
};

const labelStyle = {
  display: "block",
  margin: "12px 0 8px",
  fontWeight: 800,
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid #d1d5db",
  fontSize: 16,
  boxSizing: "border-box",
};

const primaryBtn = {
  width: "100%",
  marginTop: 16,
  padding: "13px 16px",
  borderRadius: 14,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const successBox = {
  marginTop: 14,
  padding: 14,
  borderRadius: 14,
  background: "#ecfdf5",
  color: "#047857",
  border: "1px solid #a7f3d0",
};

const errorBox = {
  marginTop: 14,
  padding: 14,
  borderRadius: 14,
  background: "#fef2f2",
  color: "#991b1b",
  border: "1px solid #fecaca",
  fontWeight: 800,
};
