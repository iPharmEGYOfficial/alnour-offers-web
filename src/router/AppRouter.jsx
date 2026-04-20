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
import InvoicePage from "../pages/InvoicePage";
import InvoicePrintPage from "../pages/InvoicePrintPage";
import RateOrderPage from "../pages/RateOrderPage";
import RatingSuccessPage from "../pages/RatingSuccessPage";

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
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetailsPage />} />
          <Route path="/admin/banners" element={<AdminBannersPage />} />
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
