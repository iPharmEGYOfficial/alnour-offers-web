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
    customerName: item.customerName ?? item.fullName ?? "????",
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
          <h2>???? ????? ???????</h2>
          <p className="subtle">???? ??????? + ????? ?????? + ????? ?????? ????????</p>
        </div>

        <div className="hero-card" style={{ marginTop: "20px" }}>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="???? ???? ????? ?? ??? ?????? ?? ?????? ?? ??????"
            className="admin-search-input"
          />
        </div>

        <div className="hero-card" style={{ marginTop: "20px" }}>
          {filtered.length === 0 ? (
            <div className="status-box">?? ???? ????? ????? ?? ???? ???????</div>
          ) : (
            <div className="admin-orders-table-wrap">
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>??? ?????</th>
                    <th>??????</th>
                    <th>??????</th>
                    <th>????????</th>
                    <th>?????</th>
                    <th>??????</th>
                    <th>????? ??????</th>
                    <th>???????</th>
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
                            ????????
                          </Link>
                          <a
                            className="secondary-btn"
                            href={`https://wa.me/966500000000?text=${encodeURIComponent(`??????? ????? ???? ??? ${item.orderId}`)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            ??????
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
