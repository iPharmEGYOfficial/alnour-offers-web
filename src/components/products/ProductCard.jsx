import "./product-card.css";
import useCartStore from "../../store/cartStore";

function renderStars(value) {
  const rounded = Math.round(Number(value || 0));
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

export default function ProductCard({ product, onAddToCart }) {
  const cartState = useCartStore();
  const addToCart = cartState.addToCart || cartState.addItem;

  const name = product.productName || product.name || "منتج";
  const image = product.primaryImageUrl || product.imageUrl || product.image || "/no-image.svg";

  const price = Number(product.price ?? 0);
  const original = Number(product.originalPrice ?? price);

  const displayPrice = product.displayFinalPrice || product.displayPrice || `${price} ⃁`;
  const displayOriginalPrice = product.displayOriginalPrice || `${original} ⃁`;

  const incomingStock = Number(product.stockQty ?? product.stock ?? 1);
  const stock = incomingStock > 0 ? incomingStock : 1;

  const hasDiscount = Boolean(product.hasDiscount) || (original > price && price > 0);
  const discount = Number(product.discountPercent ?? (hasDiscount ? Math.round(((original - price) / original) * 100) : 0));
  const isOutOfStock = false;

  const handleAdd = () => {
    const payload = {
      ...product,
      productID: product.productID || product.id || product.barcode || name,
      productName: name,
      stockQty: stock,
      price,
      originalPrice: original,
      primaryImageUrl: image,
      imageUrl: image,
      qty: 1
    };

    if (typeof onAddToCart === "function") {
      onAddToCart(payload);
      return;
    }

    if (typeof addToCart === "function") {
      addToCart(payload);
    }
  };

  return (
    <div className={`product-card ${isOutOfStock ? "out" : ""}`}>
      {hasDiscount && (
        <div className="discount-badge">-{discount}%</div>
      )}

      <div className="image-wrapper">
        <img
          src={image}
          alt={name}
          className="product-image"
          loading="lazy"
        />
      </div>

      <div className="product-body">
        <div className="product-name" title={name}>
          {name}
        </div>

        <div className="product-brand">
          {product.brandName || product.brand || "علامة عامة"}
        </div>

        <div className="product-rating">
          {renderStars(product.averageRating || 0)}
          <span className="reviews">({product.reviewsCount || 0})</span>
        </div>

        <div className="product-price">
          {product.hasVisiblePrice !== false && price > 0 ? (
            <>
              {hasDiscount && <span className="old">{displayOriginalPrice}</span>}
              <span className="current">{displayPrice}</span>
            </>
          ) : (
            <span className="no-price">السعر عند الطلب</span>
          )}
        </div>

        <button className="add-btn" onClick={handleAdd}>
          أضف إلى السلة
        </button>
      </div>
    </div>
  );
}