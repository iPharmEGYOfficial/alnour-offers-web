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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const item = await productService.getProductById(id);
        if (!mounted) return;
        setProduct(item || null);
        setActiveImage(item?.primaryImageUrl || item?.imageUrl || "/no-image.svg");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const items = [product.primaryImageUrl, product.imageUrl, ...(Array.isArray(product.gallery) ? product.gallery : []), product.barcodeImageUrl].filter(Boolean);
    return [...new Set(items)];
  }, [product]);

  function handleAdd() {
    if (!product) return;
    addToCart({ ...product, qty: 1 });
    navigate("/cart");
  }

  if (loading) return <div className="catalog-message">جارٍ تحميل تفاصيل المنتج...</div>;
  if (!product) return <div className="catalog-message">المنتج غير موجود.</div>;

  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || price);
  const hasDiscount = originalPrice > price && price > 0;
  const hasOffer = Boolean(product.hasOffer || product.offerId || product.offer);

  return (
    <section className="catalog-section">
      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 420px) 1fr", gap: 20 }}>
        <div style={imageCardStyle}>
          <img src={activeImage || "/no-image.svg"} alt={product.productName || product.name || "منتج"} style={{ maxWidth: "100%", maxHeight: 360, objectFit: "contain" }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/no-image.svg"; }} />
          {!!gallery.length && <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 16 }}>
            {gallery.map((img, index) => <button key={`${img}-${index}`} type="button" onClick={() => setActiveImage(img)} style={{ border: activeImage === img ? "2px solid #2563eb" : "1px solid #d1d5db", borderRadius: 10, padding: 4, background: "#fff", cursor: "pointer" }}><img src={img} alt={`preview-${index}`} style={{ width: 56, height: 56, objectFit: "contain", display: "block" }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/no-image.svg"; }} /></button>)}
          </div>}
        </div>

        <div style={detailsCardStyle}>
          {hasOffer && <div style={offerBadgeStyle}>🔥 {product.offerName || "عرض متاح على هذا المنتج"}</div>}
          <h2 style={{ margin: 0 }}>{product.productName || product.name || "منتج"}</h2>
          <div style={{ color: "#64748b" }}>الماركة: {product.brandName || product.brand || "-"}</div>
          <div style={{ color: "#64748b" }}>القسم: {product.categoryName || product.category || "-"}</div>
          <div style={{ color: "#64748b" }}>الباركود: {product.barcode || "غير متوفر"}</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>{formatCurrency(price)}</div>
          {hasDiscount && <div style={{ color: "#94a3b8", textDecoration: "line-through" }}>{formatCurrency(originalPrice)}</div>}
          <div style={{ color: "#475569", lineHeight: 1.8 }}>{product.description || "لا يوجد وصف إضافي لهذا المنتج حاليًا."}</div>
          <div style={{ color: "#0f172a", fontWeight: 700 }}>حالة التوفر: {Number(product.stockQty ?? product.stock ?? 0) > 0 ? "متوفر" : "غير متوفر"}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <button onClick={handleAdd} style={primaryBtn} disabled={Number(product.stockQty ?? product.stock ?? 0) <= 0}>أضف للسلة</button>
            <Link to="/offers" style={secondaryLink}>العودة للمنتجات</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const imageCardStyle = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" };
const detailsCardStyle = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, display: "grid", gap: 12 };
const offerBadgeStyle = { width: "fit-content", background: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: 999, padding: "6px 12px", fontWeight: 900 };
const primaryBtn = { padding: "10px 14px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" };
const secondaryLink = { display: "inline-block", padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", background: "#fff", color: "#111827", textDecoration: "none", fontWeight: 700 };
