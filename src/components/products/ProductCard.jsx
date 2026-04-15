import "./product-card.css";

export default function ProductCard({ product, onAddToCart }) {
  const price = Number(product.price ?? 0);
  const original = Number(product.originalPrice ?? price);
  const stock = Number(product.stockQty ?? 0);

  const hasDiscount = original > price && price > 0;

  const discount = hasDiscount
    ? Math.round(((original - price) / original) * 100)
    : 0;

  const isOutOfStock = stock <= 0;

  return (
    <div className={`product-card ${isOutOfStock ? "out" : ""}`}>
      
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="discount-badge">-{discount}%</div>
      )}

      {/* Out of Stock */}
      {isOutOfStock && (
        <div className="stock-badge">Out of Stock</div>
      )}

      {/* Image */}
      <div className="image-wrapper">
        <img
          src={product.primaryImageUrl || "/no-image.svg"}
          alt={product.productName}
          className="product-image"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="product-body">
        {/* Name */}
        <div className="product-name" title={product.productName}>
          {product.productName}
        </div>

        {/* Brand */}
        <div className="product-brand">
          {product.brandName || "Generic"}
        </div>

        {/* Rating */}
        <div className="product-rating">
          {"★".repeat(Math.round(product.averageRating || 0))}
          {"☆".repeat(5 - Math.round(product.averageRating || 0))}
          <span className="reviews">
            ({product.reviewsCount || 0})
          </span>
        </div>

        {/* Price */}
        <div className="product-price">
          {price > 0 ? (
            <>
              <span className="current">{price} SAR</span>
              {hasDiscount && (
                <span className="old">{original} SAR</span>
              )}
            </>
          ) : (
            <span className="no-price">Price on request</span>
          )}
        </div>

        {/* Action */}
        <button
          className="add-btn"
          disabled={isOutOfStock}
          onClick={() => onAddToCart?.(product)}
        >
          {isOutOfStock ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}