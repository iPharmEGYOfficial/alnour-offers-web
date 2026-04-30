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
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [form, setForm] = useState({
    productName: "",
    price: "",
    stockQty: "",
    frontImage: "",
    barcodeImage: "",
    barcode: "",
    brandName: "",
    categoryName: "",
  });

  const pageBg =
    market === "SA"
      ? "linear-gradient(135deg,#006c35 0%,#006c35 40%,#fff 40%,#fff 60%,#006c35 60%)"
      : "linear-gradient(180deg,#ce1126 0%,#ce1126 33%,#fff 33%,#fff 66%,#000 66%)";

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

  function handleImageUpload(e, type) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        [type]: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.productName || !form.price) {
      alert("❌ الاسم والسعر إجباري");
      return;
    }

    const payload = {
      ...form,
      imageUrl: form.frontImage,
      price: Number(form.price),
      stockQty: Number(form.stockQty),
      id: editingId || `${market}-${Date.now()}`,
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
      frontImage: p.imageUrl || "",
      barcodeImage: p.barcodeImage || "",
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
      frontImage: "",
      barcodeImage: "",
      barcode: "",
      brandName: "",
      categoryName: "",
    });
    setEditingId(null);
  }

  const filteredProducts = products.filter((p) => {
    return (
      (!search ||
        p.productName?.toLowerCase().includes(search.toLowerCase())) &&
      (!filterCategory || p.categoryName === filterCategory)
    );
  });

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: pageBg }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h2>🎛️ إدارة المنتجات — {market}</h2>

        {/* اختيار الدولة */}
        <select
          value={market}
          onChange={(e) => {
            setMarket(e.target.value);
            resetForm();
          }}
        >
          <option value="SA">🇸🇦 السعودية</option>
          <option value="EG">🇪🇬 مصر</option>
        </select>

        {/* البحث + الفلترة */}
        <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
          <input
            placeholder="🔍 بحث"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">كل التصنيفات</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* الفورم */}
        <form onSubmit={handleSubmit} style={{ marginTop: 15 }}>
          <input
            name="productName"
            placeholder="اسم المنتج"
            value={form.productName}
            onChange={handleChange}
          />
          <input
            name="price"
            type="number"
            placeholder="السعر"
            value={form.price}
            onChange={handleChange}
          />
          <input
            name="stockQty"
            type="number"
            placeholder="الكمية"
            value={form.stockQty}
            onChange={handleChange}
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
            <option value="">التصنيف</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <div>
            <label>📷 صورة المنتج</label>
            <input
              type="file"
              onChange={(e) => handleImageUpload(e, "frontImage")}
            />
          </div>

          <div>
            <label>🔳 صورة الباركود</label>
            <input
              type="file"
              onChange={(e) => handleImageUpload(e, "barcodeImage")}
            />
          </div>

          <button type="submit">{editingId ? "✏ تحديث" : "➕ إضافة"}</button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              ❌ إلغاء
            </button>
          )}
        </form>

        {/* عرض المنتجات */}
        <table border="1" width="100%" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>صورة</th>
              <th>الاسم</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>تحكم</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td>
                  <img src={p.imageUrl || "/no-image.svg"} width="50" alt="" />
                </td>
                <td>{p.productName}</td>
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
