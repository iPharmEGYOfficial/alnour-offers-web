import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/AdminLayout";
import AuthLayout from "../layout/AuthLayout";

import ProtectedRoute from "../components/common/ProtectedRoute";

// Pages
import HomePage from "../pages/HomePage";
import OffersPage from "../pages/OffersPage";
import CartPage from "../pages/CartPage";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";

import AccountPage from "../pages/AccountPage";
import AddressesPage from "../pages/AddressesPage";

import LoginPage from "../pages/LoginPage";

import ProductDetailsPage from "../pages/ProductDetailsPage";

import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminOrderDetailsPage from "../pages/AdminOrderDetailsPage";
import AdminBannersPage from "../pages/AdminBannersPage";

// ---------------------------------------------------------

export default function AppRouter() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* ================= AUTH ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* ================= PROTECTED USER ================= */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>

          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />

          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/addresses" element={<AddressesPage />} />

        </Route>

        {/* ================= ADMIN ================= */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>

          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetailsPage />} />
          <Route path="/admin/banners" element={<AdminBannersPage />} />

        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<MainLayout><h2 style={{padding:20}}>الصفحة غير موجودة</h2></MainLayout>} />

      </Routes>

    </BrowserRouter>
  );
}