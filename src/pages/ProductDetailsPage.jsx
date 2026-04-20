import { Link, useNavigate, useParams } from "react-router-dom";
import useCartStore from "../store/cartStore";
import productService from "../services/productService";
import formatCurrency from "../utils/formatCurrency";
import { useEffect, useState } from "react";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const item = await productService.getProductById(id);
        if (!mounted) return;
        setProduct(item);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  function handleAdd() {
    if (!product) return;
    addToCart({ ...product, qty: 1 });
    navigate("/cart");
  }

  if (loading) {
    return <div className="catalog-message">جارٍ تحميل تفاصيل المنتج...</div>;
  }

  if (!product) {
    return <div className="catalog-message">المنتج غير موجود.</div>;
  }

  const image = product.primaryImageUrl || product.imageUrl || "/no-image.svg";

  return (
    <section className="catalog-section">
      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 420px) 1fr", gap: 20 }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img
            src={image}
            alt={product.productName || product.name || "منتج"}
            style={{ maxWidth: "100%", maxHeight: 360, objectFit: "contain" }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/no-image.svg";
            }}
          />
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 20,
            display: "grid",
            gap: 12
          }}
        >
          <h2 style={{ margin: 0 }}>{product.productName || product.name || "منتج"}</h2>
          <div style={{ color: "#64748b" }}>الماركة: {product.brandName || product.brand || "-"}</div>
          <div style={{ color: "#64748b" }}>القسم: {product.categoryName || product.category || "-"}</div>
          <div style={{ color: "#64748b" }}>
            الباركود: {product.barcode || "غير متوفر"}
          </div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>
            {formatCurrency(product.price)}
          </div>
          <div style={{ color: "#475569", lineHeight: 1.8 }}>
            {product.description || "لا يوجد وصف إضافي لهذا المنتج حاليًا."}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <button onClick={handleAdd} style={primaryBtn}>
              أضف للسلة
            </button>

            <Link to="/offers" style={secondaryLink}>
              العودة للمنتجات
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const primaryBtn = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer"
};

const secondaryLink = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 700
};
