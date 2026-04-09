import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import AccountSidebar from "../components/account/AccountSidebar";
import AddressForm from "../components/account/AddressForm";
import AddressCard from "../components/account/AddressCard";
import useAccountStore from "../store/accountStore";

export default function AddressesPage() {
  const addresses = useAccountStore((state) => state.addresses);
  const addAddress = useAccountStore((state) => state.addAddress);
  const deleteAddress = useAccountStore((state) => state.deleteAddress);
  const setDefaultAddress = useAccountStore((state) => state.setDefaultAddress);

  return (
    <div className="page">
      <Header />

      <main className="container account-layout">
        <AccountSidebar />

        <section className="account-main">
          <div className="hero-card">
            <h2>???????? ????????</h2>
            <p className="subtle">
              ??? ?????? ????? ???? ????? ??????? ?????? ?????? ????? ???????? ?Delivery Zones.
            </p>
          </div>

          <div className="hero-card" style={{ marginTop: "20px" }}>
            <h3 style={{ marginTop: 0 }}>????? ????? ????</h3>
            <AddressForm onSave={addAddress} />
          </div>

          <div className="home-section">
            <div className="section-head">
              <div>
                <h2>???????? ???????</h2>
                <p>????? ????? ????? ???????? ?? ????? ?????????? ????? ???????? ??????</p>
              </div>
            </div>

            {addresses.length === 0 ? (
              <div className="status-box">?? ???? ?????? ?????? ??? ????</div>
            ) : (
              <div className="address-grid">
                {addresses.map((item) => (
                  <AddressCard
                    key={item.id}
                    item={item}
                    onDelete={deleteAddress}
                    onSetDefault={setDefaultAddress}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
