import { Link } from "react-router-dom";

const cards = [
  {
    title: "إدارة المنتجات",
    desc: "منتجات السعودية ومصر، الصور، الباركود، التصنيفات",
    icon: "📦",
    path: "/admin/products",
  },
  {
    title: "العملاء",
    desc: "بيانات العملاء وربطها لاحقًا ببيانات الشامل",
    icon: "👥",
    path: "/admin/customers",
  },
  {
    title: "تاريخ العميل",
    desc: "فواتير ومشتريات العميل السابقة لعرضها داخل التطبيق",
    icon: "🧾",
    path: "/admin/customer-history",
  },
  {
    title: "الطلبات",
    desc: "متابعة طلبات التطبيق وحالتها",
    icon: "🛒",
    path: "/admin/orders",
  },
  {
    title: "الشامل Live",
    desc: "المنتجات والأسعار والأرصدة من قاعدة الشامل",
    icon: "🔗",
    path: "/admin/live",
  },
  {
    title: "الإعدادات",
    desc: "إعدادات الربط، الأسواق، طرق الدفع، والواجهة",
    icon: "⚙️",
    path: "/admin/settings",
  },
];

export default function AdminDataTubePage() {
  return (
    <section
      dir="rtl"
      style={{
        minHeight: "100vh",
        padding: 24,
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #065f46 100%)",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.96)",
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 18px 45px rgba(0,0,0,0.28)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>🎛️ لوحة تحكم النور</h1>

        <p style={{ color: "#64748b", fontWeight: 700 }}>
          مركز إدارة المنتجات والعملاء والطلبات والربط مع الشامل
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          {cards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              style={{
                textDecoration: "none",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 18,
                padding: 18,
                color: "#0f172a",
                boxShadow: "0 8px 22px rgba(15,23,42,0.08)",
              }}
            >
              <div style={{ fontSize: 34 }}>{card.icon}</div>
              <h3 style={{ marginBottom: 6 }}>{card.title}</h3>
              <p style={{ color: "#64748b", margin: 0, lineHeight: 1.7 }}>
                {card.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
