import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/account", label: "??????" },
  { to: "/account/addresses", label: "????????" },
  { to: "/orders", label: "??????" },
  { to: "/offers", label: "????????" }
];

export default function AccountSidebar() {
  const location = useLocation();

  return (
    <aside className="account-sidebar">
      <h3>?????</h3>

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
