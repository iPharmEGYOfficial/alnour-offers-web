import "./product-card.css";
import useCartStore from "../../store/cartStore";
import formatCurrency from "../../utils/formatCurrency";

export default function ProductCard({ product, onAddToCart }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const id =
    product.productID || product.id || product.barcode || crypto.randomUUID();
  const name = product.productName || product.name || "منتج";
  const image = product.primaryImageUrl || product.imageUrl || "/no-image.svg";

  const brand = product.brandName || product.brand || "بدون ماركة";
  const category = product.categoryName || product.category || "أجهزة طبية";
  const barcode = product.barcode || "";
  const stockQty = Number(product.stockQty ?? product.stock ?? 0);

  const price = Number(product.price || 0);
  const original = Number(product.originalPrice || price);

  const hasDiscount = original > price && price > 0;
  const discount = hasDiscount
    ? Math.round(((original - price) / original) * 100)
    : 0;

  const isAvailable = stockQty > 0;

  function handleAdd() {
    if (!isAvailable) return;

    const payload = {
      ...product,
      productID: id,
      id,
      productName: name,
      primaryImageUrl: image,
      imageUrl: image,
      brandName: brand,
      categoryName: category,
      stockQty,
      qty: 1,
    };

    if (typeof onAddToCart === "function") {
      onAddToCart(payload);
      return;
    }

    addToCart(payload);
  }

  return (
    <article className={`product-card ${!isAvailable ? "out" : ""}`}>
      {hasDiscount && <div className="discount-badge">خصم {discount}%</div>}

      <div className="image-wrapper">
        <img src={image} alt={name} className="product-image" loading="lazy" />

        <div className={`stock-badge ${isAvailable ? "in" : "out"}`}>
          {isAvailable ? "متوفر" : "غير متوفر"}
        </div>
      </div>

      <div className="product-body">
        <div className="product-meta-top">
          <span className="product-category">{category}</span>
          <span className="product-brand">{brand}</span>
        </div>

        <h3 className="product-name" title={name}>
          {name}
        </h3>

        <div className="product-barcode">
          {barcode ? `الباركود: ${barcode}` : "باركود غير متوفر"}
        </div>

        <div className="product-price">
          {price > 0 ? (
            <>
              <span className="current">{formatCurrency(price)}</span>
              {hasDiscount && (
                <span className="old">{formatCurrency(original)}</span>
              )}
            </>
          ) : (
            <span className="no-price">السعر عند الطلب</span>
          )}
        </div>

        <button className="add-btn" onClick={handleAdd} disabled={!isAvailable}>
          {isAvailable ? "أضف للسلة" : "غير متاح حالياً"}
        </button>
      </div>
    </article>
  );
}
