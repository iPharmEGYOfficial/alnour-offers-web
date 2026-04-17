import "./product-card.css";
import useCartStore from "../../store/cartStore";

export default function ProductCard({ product, onAddToCart }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const name = product.productName || product.name || "Unnamed Product";
  const image = product.primaryImageUrl || product.imageUrl || product.image || "/no-image.svg";
  const price = Number(product.price ?? 0);
  const original = Number(product.originalPrice ?? price);

  const incomingStock = Number(product.stockQty ?? product.stock ?? 1);
  const stock = incomingStock > 0 ? incomingStock : 1;

  const hasDiscount = original > price && price > 0;
  const discount = hasDiscount ? Math.round(((original - price) / original) * 100) : 0;
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
      imageUrl: image
    };

    if (typeof onAddToCart === "function") {
      onAddToCart(payload);
      return;
    }

    addToCart(payload);
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
          {product.brandName || product.brand || "Generic"}
        </div>

        <div className="product-rating">
          {"".repeat(Math.round(product.averageRating || 0))}
          {"".repeat(5 - Math.round(product.averageRating || 0))}
          <span className="reviews">({product.reviewsCount || 0})</span>
        </div>

        <div className="product-price">
          {price > 0 ? (
            <>
              <span className="current">{price} SAR</span>
              {hasDiscount && <span className="old">{original} SAR</span>}
            </>
          ) : (
            <span className="no-price">Price on request</span>
          )}
        </div>

        <button
          className="add-btn"
          onClick={handleAdd}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}