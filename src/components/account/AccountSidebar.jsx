import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/account", label: "حسابي", hint: "البيانات الشخصية والإعدادات" },
  { to: "/account/addresses", label: "عناويني", hint: "عناوين التوصيل والاستلام" },
  { to: "/orders", label: "طلباتي", hint: "متابعة الطلبات السابقة والحالية" },
  { to: "/offers", label: "المنتجات", hint: "استعراض منتجات وعروض الصيدلية" }
];

export default function AccountSidebar() {
  const location = useLocation();

  return (
    <aside className="account-sidebar">
      <div className="account-sidebar__head">
        <h3>حسابي</h3>
        <p className="subtle">إدارة الملف الشخصي والطلبات والعناوين</p>
      </div>

      <div className="account-sidebar__links">
        {links.map((item) => {
          const active =
            location.pathname === item.to ||
            (item.to !== "/account" && location.pathname.startsWith(item.to));

          return (
            <Link
              key={item.to}
              to={item.to}
              className={active ? "account-side-link active" : "account-side-link"}
              title={item.hint}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}