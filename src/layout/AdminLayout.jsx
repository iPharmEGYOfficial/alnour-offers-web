import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      <aside style={{
        width: 240,
        background: "#111827",
        color: "#fff",
        padding: 20
      }}>
        <h3>لوحة الإدارة</h3>

        <div style={{ marginTop: 20 }}>
          <p>📦 الطلبات</p>
          <p>🎯 البانرات</p>
        </div>
      </aside>

      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>

    </div>
  );
}