import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>حسابي</h2>
          <p>بيانات المستخدم الحالية داخل وضع التطوير</p>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 16,
          display: "grid",
          gap: 10
        }}
      >
        <div><strong>الاسم:</strong> {user?.name || "مستخدم"}</div>
        <div><strong>الهاتف:</strong> {user?.phone || "-"}</div>
        <div><strong>المعرف:</strong> {user?.id || user?.customerID || "-"}</div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <Link to="/account/addresses" style={secondaryLink}>إدارة العناوين</Link>
          <Link to="/orders" style={secondaryLink}>طلباتي</Link>
        </div>
      </div>
    </section>
  );
}

const secondaryLink = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 700
};
