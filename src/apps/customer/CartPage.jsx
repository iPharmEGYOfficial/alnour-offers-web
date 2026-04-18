import useCartStore from "../../store/cartStore";
import formatCurrency from "../../utils/formatCurrency";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);
  const clearCart = useCartStore((s) => s.clearCart);

  const total = items.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.qty || 0);
  }, 0);

  if (!items.length) {
    return <div className="catalog-message">السلة فارغة حاليًا.</div>;
  }

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>سلة المشتريات</h2>
          <p>راجع المنتجات قبل إتمام الطلب</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {items.map((item) => (
          <div
            key={item.productID}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "14px"
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              {item.productName || item.name || "منتج"}
            </div>

            <div style={{ color: "#64748b", marginBottom: 10 }}>
              السعر: {formatCurrency(item.price)}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="secondary-btn" onClick={() => decreaseQty(item.productID)}>
                -
              </button>

              <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>
                {item.qty}
              </span>

              <button className="secondary-btn" onClick={() => increaseQty(item.productID)}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 14
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 12 }}>
          الإجمالي: {formatCurrency(total)}
        </div>

        <button className="secondary-btn danger" onClick={clearCart}>
          مسح السلة
        </button>
      </div>
    </section>
  );
}