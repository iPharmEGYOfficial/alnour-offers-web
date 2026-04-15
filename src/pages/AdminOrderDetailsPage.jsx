import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import AdminStatusSelector from "../components/admin/AdminStatusSelector";
import { getOrderDetails, updateAdminOrderStatus } from "../services/orderService";
import { getStatusLabel } from "../config/adminOrderStatuses";

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    loadData();
  }, [orderId]);

  async function loadData() {
    const result = await getOrderDetails(orderId);
    setData(result || null);
    setStatus(result?.status || "Pending");
  }

  async function handleStatusChange(nextStatus) {
    setStatus(nextStatus);
    await updateAdminOrderStatus(orderId, nextStatus);
  }

  const items = data?.items || data?.orderItems || [];

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="hero-card">
          <h2>Admin Order Details #{orderId}</h2>
          <p className="subtle">Review customer details, items, payment method, and current status.</p>
        </div>

        <div className="admin-order-layout">
          <section className="hero-card">
            <h3 style={{ marginTop: 0 }}>Order Information</h3>

            <div className="admin-meta-grid">
              <div className="admin-meta-card">
                <span>Customer</span>
                <strong>{data?.customerName || "Unknown Customer"}</strong>
              </div>
              <div className="admin-meta-card">
                <span>Phone</span>
                <strong>{data?.phone || "-"}</strong>
              </div>
              <div className="admin-meta-card">
                <span>Payment</span>
                <strong>{data?.paymentMethod || "-"}</strong>
              </div>
              <div className="admin-meta-card">
                <span>Current Status</span>
                <strong>{getStatusLabel(status)}</strong>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <AdminStatusSelector value={status} onChange={handleStatusChange} />
            </div>

            <div className="admin-row-actions" style={{ marginTop: "20px" }}>
              <a
                className="secondary-btn"
                href={`https://wa.me/966500000000?text=${encodeURIComponent(`Your order #${orderId} status is now ${getStatusLabel(status)}.`)}`}
                target="_blank"
                rel="noreferrer"
              >
                Notify Customer
              </a>

              <Link className="secondary-btn" to={`/orders/${orderId}/invoice`}>
                Open Invoice
              </Link>
            </div>
          </section>

          <section className="hero-card">
            <h3 style={{ marginTop: 0 }}>Order Items</h3>

            {items.length === 0 ? (
              <div className="status-box">No order items available.</div>
            ) : (
              <div style={{ display: "grid", gap: "10px" }}>
                {items.map((item, index) => (
                  <div key={index} className="admin-item-row">
                    <div>
                      <strong>{item.productName || item.name || "Unnamed Product"}</strong>
                      <p className="subtle">{item.barcode || ""}</p>
                    </div>
                    <div>
                      <strong>x {item.qty || item.quantity || 0}</strong>
                    </div>
                    <div>
                      <strong>{Number(item.price || item.unitPrice || 0).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
