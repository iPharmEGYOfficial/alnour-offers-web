import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + Number(item.qty || 0), 0)
  );

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "12px 16px",
          flexWrap: "wrap"
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            color: "#111827"
          }}
        >
          <img
            src="/alnoor-logo.png"
            alt="صيدلية النور"
            style={{
              width: "48px",
              height: "48px",
              objectFit: "contain",
              borderRadius: "12px",
              background: "#f8fafc"
            }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: "18px" }}>صيدلية النور</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Al-Nour Offers
            </div>
          </div>
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap"
          }}
        >
          <Link to="/" style={navStyle(isActive("/"))}>الرئيسية</Link>
          <Link to="/offers" style={navStyle(isActive("/offers"))}>المنتجات</Link>
          <Link to="/cart" style={navStyle(isActive("/cart"))}>
            السلة
            <span
              style={{
                marginInlineStart: "8px",
                background: "#2563eb",
                color: "#fff",
                borderRadius: "999px",
                padding: "2px 8px",
                fontSize: "12px",
                fontWeight: 700
              }}
            >
              {cartCount}
            </span>
          </Link>
          <Link to="/orders" style={navStyle(isActive("/orders"))}>طلباتي</Link>
          <Link to="/account" style={navStyle(isActive("/account"))}>حسابي</Link>
        </nav>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap"
          }}
        >
          {isAuthenticated ? (
            <>
              <div
                style={{
                  background: "#f3f4f6",
                  borderRadius: "999px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  color: "#111827"
                }}
              >
                {user?.fullName || user?.customerName || "مستخدم"}
              </div>

              <button
                onClick={onLogout}
                style={buttonStyle("#ffffff", "#dc2626", "#fecaca")}
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                ...buttonStyle("#2563eb", "#ffffff", "#2563eb"),
                textDecoration: "none"
              }}
            >
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function navStyle(active) {
  return {
    textDecoration: "none",
    color: active ? "#2563eb" : "#111827",
    fontWeight: active ? 800 : 600,
    background: active ? "#eff6ff" : "transparent",
    borderRadius: "10px",
    padding: "8px 12px",
    transition: "0.2s ease"
  };
}

function buttonStyle(bg, color, borderColor) {
  return {
    background: bg,
    color: color,
    border: `1px solid ${borderColor}`,
    borderRadius: "10px",
    padding: "9px 14px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer"
  };
}