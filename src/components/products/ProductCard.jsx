import "./product-card.css";
import useCartStore from "../../store/cartStore";
import formatCurrency from "../../utils/formatCurrency";

export default function ProductCard({ product, onAddToCart }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const name = product.productName || "منتج";
  const image = product.primaryImageUrl || "/no-image.svg";

  const price = Number(product.price || 0);
  const original = Number(product.originalPrice || price);

  const hasDiscount = original > price && price > 0;
  const discount = hasDiscount
    ? Math.round(((original - price) / original) * 100)
    : 0;

  const handleAdd = () => {
    const payload = {
      ...product,
      qty: 1
    };

    if (onAddToCart) {
      onAddToCart(payload);
    } else {
      addToCart(payload);
    }
  };

  return (
    <div className="product-card">
      {hasDiscount && (
        <div className="discount-badge">-{discount}%</div>
      )}

      <div className="image-wrapper">
        <img src={image} alt={name} className="product-image" />
      </div>

      <div className="product-body">
        <div className="product-name">{name}</div>

        <div className="product-price">
          {price > 0 ? (
            <>
              <span className="current">
                {formatCurrency(price)}
              </span>

              {hasDiscount && (
                <span className="old">
                  {formatCurrency(original)}
                </span>
              )}
            </>
          ) : (
            <span className="no-price">السعر عند الطلب</span>
          )}
        </div>

        <button className="add-btn" onClick={handleAdd}>
          أضف للسلة
        </button>
      </div>
    </div>
  );
}