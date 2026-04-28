import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [phone, setPhone] = useState("05xxxxxxxx");
  const [name, setName] = useState("عميل صيدلية النور");

  function handleSubmit(e) {
    e.preventDefault();

    if (!phone.trim()) {
      alert("أدخل رقم الجوال");
      return;
    }

    login({ phone, name });
    navigate("/", { replace: true });
  }

  return (
    <section className="catalog-section" dir="rtl">
      <div className="catalog-section__head">
        <div>
          <h2>تسجيل الدخول</h2>
          <p>دخول محلي للتجربة بدون API أو Bridge</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={cardStyle}>
        <label style={labelStyle}>الاسم</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          placeholder="اسم العميل"
        />

        <label style={labelStyle}>رقم الجوال</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
          placeholder="05xxxxxxxx"
        />

        <button type="submit" style={primaryBtn}>
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
  borderRadius: 14,
  padding: 18,
  maxWidth: 420,
  marginRight: "auto",
};

const labelStyle = {
  display: "block",
  margin: "12px 0 8px",
  fontWeight: 700,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  fontSize: 15,
};

const primaryBtn = {
  width: "100%",
  marginTop: 16,
  padding: "12px 14px",
  borderRadius: 12,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};
