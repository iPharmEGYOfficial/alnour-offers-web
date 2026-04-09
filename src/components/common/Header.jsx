import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import RuntimeBadge from "./RuntimeBadge";

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
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand-box">
          <img src="/alnoor-logo.png" alt="Al-Nour" className="brand-logo" />
          <div className="brand-copy">
            <strong>Al-Nour Offers</strong>
            <span>Medical & Home Health Storefront</span>
          </div>
        </Link>

        <nav className="main-nav">
          <Link className={isActive("/") ? "nav-link active" : "nav-link"} to="/">????????</Link>
          <Link className={isActive("/offers") ? "nav-link active" : "nav-link"} to="/offers">????????</Link>
          <Link className={isActive("/cart") ? "nav-link active" : "nav-link"} to="/cart">
            ?????
            <span className="cart-badge">{cartCount}</span>
          </Link>
          <Link className={isActive("/orders") ? "nav-link active" : "nav-link"} to="/orders">??????</Link>
          <Link className={isActive("/account") ? "nav-link active" : "nav-link"} to="/account">?????</Link>
        </nav>

        <div className="header-actions">
          <RuntimeBadge />
          {isAuthenticated ? (
            <>
              <div className="user-chip">
                <span></span>
                <small>{user?.fullName || user?.customerName || "????"}</small>
              </div>
              <button className="secondary-btn" onClick={onLogout}>????</button>
            </>
          ) : (
            <Link className="primary-btn" to="/login">????</Link>
          )}
        </div>
      </div>
    </header>
  );
}
