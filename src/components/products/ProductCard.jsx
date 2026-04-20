import "./product-card.css";
import useCartStore from "../../store/cartStore";
import formatCurrency from "../../utils/formatCurrency";

export default function ProductCard({ product, onAddToCart }) {
  const addToCart = useCartStore((state) => state.addToCart);

  // 🧠 ID
  const id =
    product.productID || product.id || product.barcode || crypto.randomUUID();

  // 🧠 بيانات أساسية
  const name = product.productName || product.name || "منتج";
  const image =
    product.primaryImageUrl || product.imageUrl || "/assets/no-image.png"; // 🔥 fix مهم

  const brand = product.brandName || product.brand || "بدون ماركة";
  const category = product.categoryName || product.category || "أجهزة طبية";
  const barcode = product.barcode || "";

  // 🧠 stock
  const stockQty = Number(product.stockQty ?? product.stock ?? 0);
  const isAvailable = stockQty > 0;

  // 🧠 الأسعار (fix مهم)
  const price = Number(product.price ?? 0);
  const original = Number(product.originalPrice ?? price);

  // 🧠 الخصم
  const hasDiscount = original > price && price > 0;
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
      return;
    }

    addToCart(payload);
  }

  return (
    <article className={`product-card ${!isAvailable ? "out" : ""}`}>
      {/* 🔥 Badge الخصم */}
      {hasDiscount && <div className="discount-badge">🔥 {discount}% خصم</div>}

      {/* 🖼️ الصورة */}
      <div className="image-wrapper">
        <img
          src={image}
          alt={name}
          className="product-image"
          loading="lazy"
          onError={(e) => (e.target.src = "/assets/no-image.png")} // 🔥 حماية
        />

        <div className={`stock-badge ${isAvailable ? "in" : "out"}`}>
          {isAvailable ? "متوفر" : "غير متوفر"}
        </div>
      </div>

      {/* 🧾 البيانات */}
      <div className="product-body">
        {/* 🏷️ ميتا */}
        <div className="product-meta-top">
          <span className="product-category">{category}</span>
          <span className="product-brand">{brand}</span>
        </div>

        {/* 📛 الاسم */}
        <h3 className="product-name" title={name}>
          {name}
        </h3>

        {/* 🔢 باركود */}
        <div className="product-barcode">
          {barcode ? `الباركود: ${barcode}` : "باركود غير متوفر"}
        </div>

        {/* 💰 السعر */}
        <div className="product-price">
          {price > 0 ? (
            <>
              <span className="current">💰 {formatCurrency(price)}</span>

              {hasDiscount && (
                <span className="old">{formatCurrency(original)}</span>
              )}
            </>
          ) : (
            <span className="no-price">السعر عند الطلب</span>
          )}
        </div>

        {/* 🛒 زر */}
        <button className="add-btn" onClick={handleAdd} disabled={!isAvailable}>
          {isAvailable ? "🛒 أضف للسلة" : "❌ غير متاح"}
        </button>
      </div>
    </article>
  );
}
