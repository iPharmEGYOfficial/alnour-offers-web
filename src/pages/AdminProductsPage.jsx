import { useEffect, useState } from "react";
import productService from "../services/productService";

const categories = [
  "أجهزة طبية",
  "أجهزة قياس ومتابعة",
  "مستلزمات طبية",
  "العناية الشخصية",
  "العناية بالشعر",
  "العناية بالبشرة",
  "إسعافات أولية",
  "الأم والطفل",
  "العلاج الطبيعي والتدليك",
  "مستلزمات الحجامة",
  "أدوية",
];

export default function AdminProductsPage() {
  const [market, setMarket] = useState("SA");
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    productName: "",
    price: "",
    stockQty: "",
    imageUrl: "",
    barcode: "",
    brandName: "",
    categoryName: "",
  });

  const pageBg =
    market === "SA"
      ? "linear-gradient(135deg, #006c35 0%, #006c35 40%, #ffffff 40%, #ffffff 60%, #006c35 60%, #006c35 100%)"
      : "linear-gradient(180deg, #ce1126 0%, #ce1126 33%, #ffffff 33%, #ffffff 66%, #000000 66%, #000000 100%)";

  useEffect(() => {
    loadProducts();
  }, [market]);

  function loadProducts() {
    const data = productService.getLocalAdminProducts(market);
    setProducts(data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        imageUrl: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      id: editingId || `${market}-${Date.now()}`,
      price: Number(form.price),
      stockQty: Number(form.stockQty),
      market,
      source: "local",
    };

    productService.upsertLocalAdminProduct(payload, market);

    resetForm();
    loadProducts();
  }

  function handleEdit(p) {
    setForm({
      productName: p.productName || "",
      price: p.price || "",
      stockQty: p.stockQty || "",
      imageUrl: p.imageUrl || "",
      barcode: p.barcode || "",
      brandName: p.brandName || "",
      categoryName: p.categoryName || "",
    });

    setEditingId(p.rawId || p.id);
  }

  function handleDelete(id) {
    if (!confirm("هل تريد حذف المنتج؟")) return;

    productService.deleteLocalAdminProduct(id, market);
    loadProducts();
  }

  function resetForm() {
    setForm({
      productName: "",
      price: "",
      stockQty: "",
      imageUrl: "",
      barcode: "",
      brandName: "",
      categoryName: "",
    });
    setEditingId(null);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background: pageBg,
        backgroundAttachment: "fixed",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.94)",
          borderRadius: 22,
          padding: 22,
          boxShadow: "0 12px 35px rgba(0,0,0,0.22)",
        }}
      >
        <h2 style={{ marginBottom: 12 }}>
          🎛️ إدارة المنتجات — {market === "SA" ? "السعودية 🇸🇦" : "مصر 🇪🇬"}
        </h2>

        <select
          value={market}
          onChange={(e) => {
            setMarket(e.target.value);
            resetForm();
          }}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            fontWeight: 800,
            marginBottom: 18,
          }}
        >
          <option value="SA">🇸🇦 واجهة السعودية</option>
          <option value="EG">🇪🇬 واجهة مصر</option>
        </select>

        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: 20,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 10,
          }}
        >
          <input
            name="productName"
            placeholder="اسم المنتج"
            value={form.productName}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="السعر"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            name="stockQty"
            type="number"
            placeholder="الكمية"
            value={form.stockQty}
            onChange={handleChange}
            required
          />
          <input
            name="barcode"
            placeholder="الباركود"
            value={form.barcode}
            onChange={handleChange}
          />
          <input
            name="brandName"
            placeholder="الماركة"
            value={form.brandName}
            onChange={handleChange}
          />

          <select
            name="categoryName"
            value={form.categoryName}
            onChange={handleChange}
          >
            <option value="">اختر التصنيف</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input type="file" accept="image/*" onChange={handleImageUpload} />

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit">{editingId ? "✏ تحديث" : "➕ إضافة"}</button>
            {editingId && (
              <button type="button" onClick={resetForm}>
                ❌ إلغاء
              </button>
            )}
          </div>
        </form>

        {form.imageUrl && <img src={form.imageUrl} width="90" alt="preview" />}

        <table border="1" width="100%">
          <thead>
            <tr>
              <th>الصورة</th>
              <th>الاسم</th>
              <th>التصنيف</th>
              <th>الماركة</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>تحكم</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.imageUrl || "/no-image.svg"} width="50" alt="" />
                </td>
                <td>{p.productName}</td>
                <td>{p.categoryName}</td>
                <td>{p.brandName}</td>
                <td>{p.price}</td>
                <td>{p.stockQty}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>✏</button>
                  <button onClick={() => handleDelete(p.rawId || p.id)}>
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
