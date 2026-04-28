import { useEffect, useState } from "react";

export default function AdminDataTubePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8787/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  function updateField(index, key, value) {
    const updated = [...products];
    updated[index][key] = value;
    setProducts(updated);
  }

  function addProduct() {
    setProducts([
      ...products,
      {
        id: Date.now(),
        name: "منتج جديد",
        price: 0,
        image: "",
      },
    ]);
  }

  function saveAll() {
    fetch("http://localhost:8787/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(products),
    }).then(() => alert("تم الحفظ ✔"));
  }

  return (
    <div style={{ padding: 20 }} dir="rtl">
      <h2>📦 Data Tube - إدارة المنتجات</h2>

      <button onClick={addProduct}>➕ إضافة منتج</button>
      <button onClick={saveAll} style={{ marginRight: 10 }}>
        💾 حفظ
      </button>

      <div style={{ marginTop: 20 }}>
        {products.map((p, i) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
            }}
          >
            <input
              value={p.name}
              onChange={(e) => updateField(i, "name", e.target.value)}
              placeholder="اسم المنتج"
            />

            <input
              value={p.price}
              onChange={(e) => updateField(i, "price", e.target.value)}
              placeholder="السعر"
            />

            <input
              value={p.image}
              onChange={(e) => updateField(i, "image", e.target.value)}
              placeholder="الصورة"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
