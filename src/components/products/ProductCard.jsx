import { Link } from "react-router-dom";
import useCartStore from "../../store/cartStore";

function renderStars(value) {
  const rounded = Math.round(Number(value || 0));
  return "".repeat(rounded) + "".repeat(5 - rounded);
}

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const productID = product?.productID ?? product?.id ?? product?.barcode;
  const productName = product?.productName ?? product?.name ?? "????";
  const price = Number(product?.price ?? 0);
  const originalPrice = Number(product?.originalPrice ?? product?.price ?? 0);
  const stockQty = Number(product?.stockQty ?? product?.stock ?? 0);
  const imageUrl =
    product?.imageUrl ||
    product?.primaryImageUrl ||
    product?.image ||
    "/no-image.svg";

  const averageRating = Number(product?.averageRating ?? 0);
  const reviewsCount = Number(product?.reviewsCount ?? 0);

  const discount = Math.max(0, originalPrice - price);
  const discountPercent =
    originalPrice > 0 ? Math.round((discount / originalPrice) * 100) : 0;

  const handleAdd = () => {
    addToCart({
      productID,
      productName,
      price,
      originalPrice,
      stockQty,
      barcode: product?.barcode || ""
    });
  };

  return (
    <div className="product-card product-card--enhanced">
      <Link to={`/product/${productID}`} className="product-image-link">
        <div className="product-image">
          <img src={imageUrl} alt={productName} />
        </div>
      </Link>

      <div className="product-card__body">
        <Link to={`/product/${productID}`} className="product-title-link">
          <h3>{productName}</h3>
        </Link>

        <p className="product-desc">
          {product?.barcode ? `Barcode: ${product.barcode}` : "???? ??? / ???"}
        </p>

        <div className="product-rating-row">
          <span className="rating-stars">{renderStars(averageRating)}</span>
          <span className="rating-meta">
            {averageRating > 0 ? averageRating.toFixed(1) : "????"}  {reviewsCount} ??????
          </span>
        </div>

        <div className="stock-row">
          <span>???????:</span>
          <span>{stockQty}</span>
        </div>

        <div className="price-row">
          <span className="price-current">{price.toFixed(2)} ?.?</span>

          {originalPrice > price && (
            <>
              <span className="price-old">{originalPrice.toFixed(2)} ?.?</span>
              <span className="discount-badge small">-{discountPercent}%</span>
            </>
          )}
        </div>

        <div className="product-card__actions">
          <button
            className="primary-btn"
            onClick={handleAdd}
            disabled={stockQty <= 0}
          >
            {stockQty > 0 ? "????? ?????" : "??? ?????"}
          </button>

          <Link className="secondary-btn" to={`/product/${productID}`}>
            ????????
          </Link>
        </div>
      </div>
    </div>
  );
}
