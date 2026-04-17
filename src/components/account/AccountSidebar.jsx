import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/account", label: "حسابي" },
  { to: "/account/addresses", label: "عناويني" },
  { to: "/orders", label: "طلباتي" },
  { to: "/offers", label: "المنتجات" }
];

export default function AccountSidebar() {
  const location = useLocation();

  return (
    <aside className="account-sidebar">
      <h3>حسابي</h3>

      <div className="account-sidebar__links">
        {links.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={
              location.pathname === item.to
                ? "account-side-link active"
                : "account-side-link"
            }
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}

