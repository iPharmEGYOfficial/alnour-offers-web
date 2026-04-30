import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/AdminLayout";
import AuthLayout from "../layout/AuthLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import customerRoutes from "./customerRouter";

import OrdersPage from "../pages/OrdersPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import AccountPage from "../pages/AccountPage";
import AddressesPage from "../pages/AddressesPage";
import LoginPage from "../pages/LoginPage";

import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminOrderDetailsPage from "../pages/AdminOrderDetailsPage";
import AdminBannersPage from "../pages/AdminBannersPage";
import AdminDataTubePage from "../pages/AdminDataTubePage";
import AdminProductsPage from "../pages/AdminProductsPage";

import InvoicePage from "../pages/InvoicePage";
import InvoicePrintPage from "../pages/InvoicePrintPage";
import RateOrderPage from "../pages/RateOrderPage";
import RatingSuccessPage from "../pages/RatingSuccessPage";

function AdminComingSoon({ title, desc }) {
  return (
    <section dir="rtl" style={{ padding: 24 }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 10px 28px rgba(15,23,42,0.08)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <p style={{ color: "#64748b", fontWeight: 700 }}>{desc}</p>
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 14,
            background: "#f8fafc",
            color: "#334155",
            fontWeight: 700,
          }}
        >
          هذه الصفحة سيتم بناؤها في المرحلة التالية ضمن لوحة الإدارة الكاملة.
        </div>
      </div>
    </section>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {customerRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/addresses" element={<AddressesPage />} />
          <Route path="/invoice/:id" element={<InvoicePage />} />
          <Route path="/invoice-print/:id" element={<InvoicePrintPage />} />
          <Route path="/rate-order/:id" element={<RateOrderPage />} />
          <Route path="/rating-success" element={<RatingSuccessPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDataTubePage />} />
          <Route path="/admin/data-tube" element={<AdminDataTubePage />} />

          <Route path="/admin/products" element={<AdminProductsPage />} />

          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetailsPage />} />

          <Route path="/admin/banners" element={<AdminBannersPage />} />

          <Route
            path="/admin/customers"
            element={
              <AdminComingSoon
                title="👥 العملاء"
                desc="إدارة العملاء وربطهم لاحقًا ببيانات الشامل والفواتير القديمة."
              />
            }
          />

          <Route
            path="/admin/customer-history"
            element={
              <AdminComingSoon
                title="🧾 تاريخ العميل"
                desc="عرض فواتير ومشتريات العميل السابقة داخل التطبيق."
              />
            }
          />

          <Route
            path="/admin/live"
            element={
              <AdminComingSoon
                title="🔗 الشامل Live"
                desc="عرض منتجات وأسعار وأرصدة الشامل من قاعدة البيانات."
              />
            }
          />

          <Route
            path="/admin/settings"
            element={
              <AdminComingSoon
                title="⚙️ الإعدادات"
                desc="إعدادات الأسواق والربط وطرق الدفع والواجهة."
              />
            }
          />
        </Route>

        <Route
          path="*"
          element={
            <MainLayout>
              <div style={{ padding: 20 }}>الصفحة غير موجودة</div>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
