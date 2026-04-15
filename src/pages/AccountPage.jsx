import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import AccountSidebar from "../components/account/AccountSidebar";
import useAuthStore from "../store/authStore";
import useAccountStore from "../store/accountStore";

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const addresses = useAccountStore((state) => state.addresses);

  return (
    <div className="page">
      <Header />

      <main className="container account-layout">
        <AccountSidebar />

        <section className="account-main">
          <div className="hero-card">
            <h2>My Account</h2>
            <p className="subtle">Manage your basic profile details, addresses, and account preferences.</p>
          </div>

          <div className="account-summary-grid">
            <div className="account-summary-card">
              <h3>Customer Name</h3>
              <p>{user?.fullName || user?.customerName || "Guest"}</p>
            </div>

            <div className="account-summary-card">
              <h3>Phone Number</h3>
              <p>{user?.phoneNumber || user?.phone || "-"}</p>
            </div>

            <div className="account-summary-card">
              <h3>Saved Addresses</h3>
              <p>{addresses.length}</p>
            </div>

            <div className="account-summary-card">
              <h3>Account Status</h3>
              <p>Your account is active and ready for ordering.</p>
            </div>
          </div>

          <div className="hero-card" style={{ marginTop: "20px" }}>
            <h3 style={{ marginTop: 0 }}>What you can do here</h3>
            <div className="future-grid">
              <div className="future-card">
                <h3>Addresses and Delivery</h3>
                <p>Save multiple delivery addresses for future orders.</p>
              </div>
              <div className="future-card">
                <h3>Profile Updates</h3>
                <p>Keep your personal details up to date.</p>
              </div>
              <div className="future-card">
                <h3>Order History</h3>
                <p>Review previous orders and track current ones.</p>
              </div>
              <div className="future-card">
                <h3>Rewards</h3>
                <p>View available points and loyalty benefits.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
