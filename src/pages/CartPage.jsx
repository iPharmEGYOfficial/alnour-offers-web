import Header from "../components/common/Header";
import useCartStore from "../store/cartStore";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0);

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="hero-card">
          <h2>السلة</h2>
          <p className="subtle">راجع منتجاتك قبل الانتقال إلى الدفع</p>
        </div>

        {items.length === 0 ? (
          <div className="status-box" style={{ marginTop: "20px" }}>
            السلة فارغة
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
              {items.map((item) => (
                <div
                  key={item.productID}
                  className="hero-card"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.6fr 1fr auto",
                    gap: "16px",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0 }}>{item.productName}</h3>
                    <p className="subtle" style={{ marginTop: "8px", marginBottom: "8px" }}>
                      السعر: {Number(item.price).toFixed(2)} ر.س
                    </p>
                    <p className="subtle" style={{ margin: 0 }}>
                      الإجمالي: {(Number(item.price) * Number(item.qty)).toFixed(2)} ر.س
                    </p>
                  </div>

                  <div style={{ fontWeight: "700" }}>
                    المخزون: {Number(item.stockQty || 0)}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button className="secondary-btn" onClick={() => decreaseQty(item.productID)}>-</button>
                    <div style={{ minWidth: "32px", textAlign: "center", fontWeight: "700" }}>{item.qty}</div>
                    <button
                      className="primary-btn"
                      onClick={() => increaseQty(item.productID)}
                      disabled={Number(item.qty) >= Number(item.stockQty)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hero-card" style={{ marginTop: "24px" }}>
              <h3 style={{ marginTop: 0 }}>الإجمالي الكلي: {total.toFixed(2)} ر.س</h3>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
                <button className="primary-btn" onClick={() => navigate("/checkout")}>
                  متابعة الدفع
                </button>

                <button className="secondary-btn" onClick={clearCart}>
                  مسح السلة
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
