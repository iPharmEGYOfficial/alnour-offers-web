import { useEffect, useMemo, useState } from "react";
import productsData from "../services/mockProducts.json";

const STORAGE_KEY = "alnour_local_products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setProducts(saved ? JSON.parse(saved) : productsData);
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) =>
      [
        p.productName,
        p.name,
        p.barcode,
        p.brandName,
        p.categoryName,
        p.productID,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [products, search]);

  function updateProduct(productID, field, value) {
    setProducts((current) =>
      current.map((p) =>
        String(p.productID) === String(productID)
          ? { ...p, [field]: value }
          : p,
      ),
    );
  }

  function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products, null, 2));
    alert("تم حفظ المنتجات محليًا ✅");
  }

  function resetProducts() {
    if (!confirm("هل تريد الرجوع لملف mockProducts.json الأصلي؟")) return;
    localStorage.removeItem(STORAGE_KEY);
    setProducts(productsData);
  }

  return (
    <div style={{ padding: 24, direction: "rtl" }}>
      <h1>إدارة المنتجات المحلية</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث بالاسم / الباركود / الماركة"
          style={{ flex: 1, padding: 12 }}
        />

        <button onClick={saveProducts}>💾 حفظ</button>
        <button onClick={resetProducts}>↩️ استرجاع الأصل</button>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {filteredProducts.map((p) => (
          <div
            key={p.productID}
            style={{
              display: "grid",
              gridTemplateColumns: "90px 1fr 130px 120px 160px",
              gap: 12,
              alignItems: "center",
              padding: 14,
              border: "1px solid #ddd",
              borderRadius: 14,
              background: "#fff",
            }}
          >
            <img
              src={p.primaryImageUrl || p.imageUrl || "/no-image.svg"}
              alt={p.productName}
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 12,
                background: "#f3f4f6",
              }}
              onError={(e) => {
                e.currentTarget.src = "/no-image.svg";
              }}
            />

            <div>
              <input
                value={p.productName || ""}
                onChange={(e) =>
                  updateProduct(p.productID, "productName", e.target.value)
                }
                style={{ width: "100%", padding: 10, fontWeight: 700 }}
              />

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input
                  value={p.brandName || ""}
                  onChange={(e) =>
                    updateProduct(p.productID, "brandName", e.target.value)
                  }
                  placeholder="الماركة"
                  style={{ flex: 1, padding: 8 }}
                />

                <input
                  value={p.categoryName || ""}
                  onChange={(e) =>
                    updateProduct(p.productID, "categoryName", e.target.value)
                  }
                  placeholder="التصنيف"
                  style={{ flex: 1, padding: 8 }}
                />
              </div>
            </div>

            <input
              type="number"
              value={p.price ?? 0}
              onChange={(e) =>
                updateProduct(p.productID, "price", Number(e.target.value))
              }
              placeholder="السعر"
              style={{ padding: 10 }}
            />

            <input
              type="number"
              value={p.stockQty ?? 0}
              onChange={(e) =>
                updateProduct(p.productID, "stockQty", Number(e.target.value))
              }
              placeholder="المخزون"
              style={{ padding: 10 }}
            />

            <input
              value={p.barcode || ""}
              onChange={(e) =>
                updateProduct(p.productID, "barcode", e.target.value)
              }
              placeholder="الباركود"
              style={{ padding: 10 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
