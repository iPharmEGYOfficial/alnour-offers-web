import { Link, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import SocialBar from "../components/common/SocialBar";

export default function OrderSuccessPage() {
  const { orderId } = useParams();

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="hero-card" style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "32px" }}>Order Created Successfully</h1>
          <p className="subtle">Thank you. Your order has been received successfully.</p>

          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.7)"
            }}
          >
            <h2>Order Number</h2>
            <h1 style={{ fontSize: "40px", margin: "10px 0" }}>#{orderId}</h1>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "20px"
            }}
          >
            <Link className="primary-btn" to={`/orders/${orderId}`}>
              View Order
            </Link>

            <Link className="secondary-btn" to={`/orders/${orderId}/invoice`}>
              Open Invoice
            </Link>

            <Link className="secondary-btn" to="/offers">
              Back to Offers
            </Link>
          </div>
        </div>

        <section className="home-section">
          <div className="section-head">
            <div>
              <h2>Share your order experience</h2>
              <p>Invite friends or follow our pharmacy channels for more updates and future offers.</p>
            </div>
          </div>

          <SocialBar title="Share this order with your contacts" compact />
        </section>
      </main>

      <Footer />
    </div>
  );
}
