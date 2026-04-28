import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useAccountStore from "../store/accountStore";

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const addresses = useAccountStore((state) => state.addresses);

  const defaultAddress =
    addresses.find((x) => x.isDefault) || addresses[0] || null;

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>حسابي</h2>
          <p>بيانات المستخدم والعنوان الافتراضي والروابط السريعة</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>بيانات المستخدم</h3>
          <div style={rowStyle}>
            <strong>الاسم:</strong> {user?.name || "مستخدم"}
          </div>
          <div style={rowStyle}>
            <strong>الهاتف:</strong> {user?.phone || "-"}
          </div>
          <div style={rowStyle}>
            <strong>المعرف:</strong> {user?.id || user?.customerID || "-"}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>العنوان الافتراضي</h3>

          {defaultAddress ? (
            <>
              <div style={rowStyle}>
                <strong>الاسم:</strong> {defaultAddress.fullName}
              </div>
              <div style={rowStyle}>
                <strong>الجوال:</strong> {defaultAddress.phone}
              </div>
              <div style={rowStyle}>
                <strong>المدينة:</strong> {defaultAddress.city}
              </div>
              <div style={rowStyle}>
                <strong>الحي:</strong> {defaultAddress.district || "-"}
              </div>
              <div style={rowStyle}>
                <strong>الشارع:</strong> {defaultAddress.street || "-"}
              </div>
            </>
          ) : (
            <div className="catalog-message">لا يوجد عنوان افتراضي حاليًا.</div>
          )}
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>روابط سريعة</h3>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/account/addresses" style={secondaryLink}>
              إدارة العناوين
            </Link>

            <Link to="/orders" style={secondaryLink}>
              طلباتي
            </Link>

            <Link to="/offers" style={secondaryLink}>
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 16,
};

const rowStyle = {
  marginBottom: 10,
  color: "#334155",
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









