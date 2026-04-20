import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import formatCurrency from "../../utils/formatCurrency";

export default function CartPage() {
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items);
  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);
  const clearCart = useCartStore((s) => s.clearCart);

  const total = items.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.qty || 0);
  }, 0);

  if (!items.length) {
    return (
      <section className="catalog-section">
        <div className="catalog-section__head">
          <div>
            <h2>سلة المشتريات</h2>
            <p>السلة فارغة حاليًا</p>
          </div>
        </div>

        <div className="catalog-message" style={{ marginBottom: 16 }}>
          لم تقم بإضافة أي منتجات بعد.
        </div>

        <Link
          to="/offers"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: "10px",
            background: "#2563eb",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          تصفح المنتجات
        </Link>
      </section>
    );
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
        {items.map((item) => {
          const lineTotal = Number(item.price || 0) * Number(item.qty || 0);
          const image =
            item.primaryImageUrl || item.imageUrl || "/no-image.svg";

          return (
            <div
              key={item.productID}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "14px",
                display: "grid",
                gridTemplateColumns: "100px 1fr",
                gap: "14px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={image}
                  alt={item.productName || item.name || "منتج"}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/no-image.svg";
                  }}
                />
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>
                  {item.productName || item.name || "منتج"}
                </div>

                <div style={{ color: "#64748b", marginBottom: 8 }}>
                  سعر الوحدة: {formatCurrency(item.price)}
                </div>

                <div
                  style={{
                    color: "#0f172a",
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  الإجمالي الفرعي: {formatCurrency(lineTotal)}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    className="secondary-btn"
                    onClick={() => decreaseQty(item.productID)}
                  >
                    -
                  </button>

                  <span
                    style={{
                      minWidth: 24,
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    {item.qty}
                  </span>

                  <button
                    className="secondary-btn"
                    onClick={() => increaseQty(item.productID)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 14,
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 12 }}>
          الإجمالي: {formatCurrency(total)}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="primary-btn" onClick={() => navigate("/checkout")}>
            إتمام الطلب
          </button>

          <Link
            to="/offers"
            className="secondary-btn"
            style={{ textDecoration: "none" }}
          >
            متابعة التسوق
          </Link>

          <button className="secondary-btn danger" onClick={clearCart}>
            مسح السلة
          </button>
        </div>
      </div>
    </section>
  );
}

