import { Link, useNavigate } from "react-router-dom";
import "./product-card.css";
import useCartStore from "../../store/cartStore";
import formatCurrency from "../../utils/formatCurrency";

export default function ProductCard({ product, onAddToCart }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const navigate = useNavigate();

  // 🧠 تعريف البيانات بشكل آمن
  const id =
    product.productID ||
    product.productId ||
    product.id ||
    crypto.randomUUID();

  const name = product.productName || product.name || "منتج";
  const image =
    product.primaryImageUrl || product.imageUrl || "/no-image.svg";
  const brand = product.brandName || product.brand || "بدون ماركة";
  const category =
    product.categoryName || product.category || "أجهزة طبية";

  const barcode = product.barcode || "";

  // 🔥 FIX: قراءة المخزون صح
  const stockQty =
    parseFloat(product.stockQty ?? product.stock ?? 0) || 0;

  const isAvailable = stockQty >= 1;

  // 🔥 FIX: قراءة السعر صح
  const price = parseFloat(product.price ?? 0) || 0;
  const original = parseFloat(product.originalPrice ?? price) || price;

  const hasDiscount = original > price && price > 0;
  const hasOffer = Boolean(
    product.hasOffer || product.offerId || product.offer
  );

  const discount = hasDiscount
    ? Math.round(((original - price) / original) * 100)
    : 0;

  // 🛒 إضافة للسلة
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
      navigate("/cart");
      return;
    }

    addToCart(payload);
    navigate("/cart");
  }

  return (
    <article className={`product-card ${!isAvailable ? "out" : ""}`}>
      {/* 🔥 Badge */}
      {hasDiscount && (
        <div className="discount-badge">🔥 {discount}% خصم</div>
      )}
      {!hasDiscount && hasOffer && (
        <div className="discount-badge">🔥 عرض</div>
      )}

      {/* 🖼 الصورة */}
      <div className="image-wrapper">
        <Link to={`/product/${id}`}>
          <img
            src={image}
            alt={name}
            className="product-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/no-image.svg";
            }}
          />
        </Link>

        {/* 🟢 الحالة */}
        <div className={`stock-badge ${isAvailable ? "in" : "out"}`}>
          {isAvailable ? "متوفر" : "غير متوفر"}
        </div>
      </div>

      {/* 📦 البيانات */}
      <div className="product-body">
        <div className="product-meta-top">
          <span className="product-category">{category}</span>
          <span className="product-brand">{brand}</span>
        </div>

        <h3 className="product-name" title={name}>
          <Link to={`/product/${id}`} className="product-name-link">
            {name}
          </Link>
        </h3>

        {/* 🧾 باركود */}
        <div className="product-barcode">
          {barcode ? `الباركود: ${barcode}` : "باركود غير متوفر"}
        </div>

        {/* 🔥 عرض */}
        {hasOffer && product.offerName && (
          <div
            style={{
              color: "#dc2626",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {product.offerName}
          </div>
        )}

        {/* 💰 السعر */}
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
            <span className="no-price">
              السعر عند الطلب
            </span>
          )}
        </div>

        {/* 🛒 زر */}
        <button
          className="add-btn"
          onClick={handleAdd}
          disabled={!isAvailable}
        >
          {isAvailable ? "🛒 أضف للسلة" : "❌ غير متاح"}
        </button>
      </div>
    </article>
  );
}