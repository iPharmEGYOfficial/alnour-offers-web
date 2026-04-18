import useCartStore from "../../store/cartStore";

export default function ProductCard({ product, onAddToCart }) {
  const addItem = useCartStore((s) => s.addItem);

  const name = product.productName || "منتج";
  const image = product.primaryImageUrl || product.image || "/no-image.svg";

  const price = product.displayFinalPrice || "السعر عند الطلب";
  const old = product.displayOriginalPrice;
  const hasDiscount = product.hasDiscount;
  const discount = product.discountPercent || 0;

  const isOut = Number(product.stockQty ?? 0) <= 0;

  const handleAdd = () => {
    const payload = { ...product, qty: 1 };
    if (onAddToCart) onAddToCart(payload);
    else addItem(payload);
  };

  return (
    <div className={`product-card ${isOut ? "out" : ""}`}>
      {hasDiscount && <div className="discount-badge">-{discount}%</div>}
      {isOut && <div className="stock-badge">غير متوفر</div>}

      <div className="image-wrapper">
        <img src={image} alt={name} className="product-image" loading="lazy" />
      </div>

      <div className="product-body">
        <div className="product-name" title={name}>{name}</div>

        <div className="product-brand">
          {product.brandName || product.brand || "Generic"}
        </div>

        <div className="product-price">
          <span className="current">{price}</span>
          {old && <span className="old">~{old}~</span>}
        </div>

        <button
          className="add-btn"
          disabled={isOut}
          onClick={handleAdd}
        >
          {isOut ? "غير متاح" : "أضف للسلة"}
        </button>
      </div>
    </div>
  );
}