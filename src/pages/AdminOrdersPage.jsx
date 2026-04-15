import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import AdminStatusSelector from "../components/admin/AdminStatusSelector";
import { getAdminOrders, updateAdminOrderStatus } from "../services/orderService";
import { getStatusLabel } from "../config/adminOrderStatuses";

function normalizeAdminOrder(item, index) {
  return {
    orderId: item.orderId ?? item.orderID ?? item.id ?? index + 1,
    customerName: item.customerName ?? item.fullName ?? "Unknown Customer",
    phone: item.phone ?? item.phoneNumber ?? "-",
    total: Number(item.finalTotal ?? item.total ?? 0),
    paymentMethod: item.paymentMethod ?? "CashOnDelivery",
    status: item.status ?? "Pending",
    createdAt: item.createdAt ?? new Date().toISOString()
  };
}

export default function AdminOrdersPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const result = await getAdminOrders();
    const normalized = Array.isArray(result)
      ? result.map(normalizeAdminOrder)
      : [];
    setItems(normalized);
  }

  async function handleStatusChange(orderId, status) {
    await updateAdminOrderStatus(orderId, status);
    setItems((prev) =>
      prev.map((item) =>
        item.orderId === orderId ? { ...item, status } : item
      )
    );
  }

  const filtered = useMemo(() => {
    if (!filter.trim()) return items;
    const q = filter.trim().toLowerCase();

    return items.filter((item) =>
      String(item.orderId).toLowerCase().includes(q) ||
      String(item.customerName).toLowerCase().includes(q) ||
      String(item.phone).toLowerCase().includes(q) ||
      String(item.status).toLowerCase().includes(q)
    );
  }, [items, filter]);

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="hero-card">
          <h2>Admin Orders</h2>
          <p className="subtle">Monitor incoming orders, update statuses, and contact customers quickly.</p>
        </div>

        <div className="hero-card" style={{ marginTop: "20px" }}>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by order number, customer, phone, or status"
            className="admin-search-input"
          />
        </div>

        <div className="hero-card" style={{ marginTop: "20px" }}>
          {filtered.length === 0 ? (
            <div className="status-box">No orders available for the current filter.</div>
          ) : (
            <div className="admin-orders-table-wrap">
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Update Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.orderId}>
                      <td>#{item.orderId}</td>
                      <td>{item.customerName}</td>
                      <td>{item.phone}</td>
                      <td>{item.total.toFixed(2)}</td>
                      <td>{item.paymentMethod}</td>
                      <td>
                        <span className="admin-status-pill">
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td>
                        <AdminStatusSelector
                          compact
                          value={item.status}
                          onChange={(status) => handleStatusChange(item.orderId, status)}
                        />
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <Link className="secondary-btn" to={`/admin/orders/${item.orderId}`}>
                            Details
                          </Link>
                          <a
                            className="secondary-btn"
                            href={`https://wa.me/966500000000?text=${encodeURIComponent(`Your order #${item.orderId} is being reviewed.`)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
