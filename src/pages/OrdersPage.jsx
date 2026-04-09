import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import useAuthStore from "../store/authStore";
import { getCustomerOrders } from "../services/orderService";

export default function OrdersPage() {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getCustomerOrders(user.customerID);
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="hero-card">
          <h2>طلباتي</h2>
          <p className="subtle">استعرض كل الطلبات السابقة الخاصة بك</p>
        </div>

        {loading ? (
          <div className="status-box">جارٍ تحميل الطلبات...</div>
        ) : orders.length === 0 ? (
          <div className="status-box">لا توجد طلبات حتى الآن</div>
        ) : (
          <div className="products-grid">
            {orders.map((order) => (
              <div className="product-card" key={order.orderID}>
                <div className="product-image"></div>

                <h3>طلب رقم #{order.orderID}</h3>

                <p className="product-desc">
                  التاريخ: {new Date(order.orderDate).toLocaleString("ar-EG")}
                </p>

                <div className="stock-row">
                  <span>الحالة:</span>
                  <span>{order.status}</span>
                </div>

                <div className="stock-row">
                  <span>طريقة الدفع:</span>
                  <span>{order.paymentMethod || ""}</span>
                </div>

                <div className="stock-row">
                  <span>خصم الكوبون:</span>
                  <span>{order.couponDiscount} ر.س</span>
                </div>

                <div className="stock-row">
                  <span>خصم النقاط:</span>
                  <span>{order.pointsDiscount} ر.س</span>
                </div>

                <div className="price-row">
                  <span className="price-current">الإجمالي: {order.finalTotal} ر.س</span>
                </div>

                <div style={{ marginTop: "14px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <Link to={`/orders/${order.orderID}`} className="primary-btn">
                    التفاصيل
                  </Link>
                  <Link to={`/orders/${order.orderID}/rate`} className="secondary-btn">
                    التقييم
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}