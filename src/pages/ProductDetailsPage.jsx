import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useCartStore from "../store/cartStore";
import productService from "../services/productService";
import formatCurrency from "../utils/formatCurrency";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const item = await productService.getProductById(id);
        if (!mounted) return;

        setProduct(item || null);
        setActiveImage(
          item?.frontImage ||
            item?.primaryImageUrl ||
            item?.imageUrl ||
            "/no-image.svg",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [];

    const items = [
      product.frontImage,
      product.primaryImageUrl,
      product.imageUrl,
      ...(Array.isArray(product.gallery) ? product.gallery : []),
      product.barcodeImage,
      product.barcodeImageUrl,
    ].filter(Boolean);

    return [...new Set(items)];
  }, [product]);

  function handleAdd() {
    if (!product) return;

    addToCart({ ...product, qty: 1 });
    navigate("/cart");
  }

  if (loading) return <div className="catalog-message">⏳ جاري التحميل...</div>;
  if (!product)
    return <div className="catalog-message">❌ المنتج غير موجود</div>;

  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || price);

  const hasDiscount = originalPrice > price && price > 0;
  const hasOffer = Boolean(product.hasOffer || product.offerId);

  return (
    <section className="catalog-section">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 420px) 1fr",
          gap: 20,
        }}
      >
        {/* 🖼 الصور */}
        <div style={imageCardStyle}>
          <img
            src={activeImage}
            alt={product.productName}
            style={{
              maxWidth: "100%",
              maxHeight: 360,
              objectFit: "contain",
              cursor: "zoom-in",
            }}
            onClick={() => setShowFullscreen(true)}
          />

          {/* 🔥 Thumbnails */}
          {!!gallery.length && (
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              {gallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  style={{
                    border:
                      activeImage === img
                        ? "2px solid #2563eb"
                        : "1px solid #ddd",
                    borderRadius: 10,
                    padding: 4,
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={img}
                    width="60"
                    height="60"
                    style={{ objectFit: "contain" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 📦 البيانات */}
        <div style={detailsCardStyle}>
          {hasOffer && <div style={offerBadgeStyle}>🔥 عرض متاح</div>}

          <h2>{product.productName}</h2>

          <div>🏷 الماركة: {product.brandName || "-"}</div>
          <div>📦 القسم: {product.categoryName || "-"}</div>
          <div>🔢 الباركود: {product.barcode || "غير متوفر"}</div>

          <div style={{ fontSize: 22, fontWeight: 900 }}>
            {formatCurrency(price)}
          </div>

          {hasDiscount && (
            <div style={{ textDecoration: "line-through", color: "#999" }}>
              {formatCurrency(originalPrice)}
            </div>
          )}

          <div>
            📊 الحالة:
            {Number(product.stockQty ?? 0) > 0 ? " متوفر ✅" : " غير متوفر ❌"}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleAdd} style={primaryBtn}>
              🛒 أضف للسلة
            </button>

            <Link to="/offers" style={secondaryLink}>
              رجوع
            </Link>
          </div>
        </div>
      </div>

      {/* 🔥 Fullscreen Image */}
      {showFullscreen && (
        <div
          onClick={() => setShowFullscreen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={activeImage}
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}
    </section>
  );
}

const imageCardStyle = {
  background: "#fff",
  borderRadius: 16,
  padding: 20,
  textAlign: "center",
};

const detailsCardStyle = {
  background: "#fff",
  borderRadius: 16,
  padding: 20,
  display: "grid",
  gap: 10,
};

const offerBadgeStyle = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "6px 12px",
  borderRadius: 999,
  fontWeight: 900,
};

const primaryBtn = {
  padding: "10px 14px",
  borderRadius: 10,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const secondaryLink = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ccc",
  textDecoration: "none",
};
