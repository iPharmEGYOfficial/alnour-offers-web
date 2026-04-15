import { Navigate, Route, Routes } from "react-router-dom";
import useAuthStore from "../store/authStore";
import ProtectedRoute from "../components/common/ProtectedRoute";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import OffersPage from "../pages/OffersPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import InvoicePage from "../pages/InvoicePage";
import RateOrderPage from "../pages/RateOrderPage";
import RatingSuccessPage from "../pages/RatingSuccessPage";
import AccountPage from "../pages/AccountPage";
import AddressesPage from "../pages/AddressesPage";

import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminOrderDetailsPage from "../pages/AdminOrderDetailsPage";
import AdminBannersPage from "../pages/AdminBannersPage";
import InvoicePrintPage from "../pages/InvoicePrintPage";

export default function AppRouter() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {/* Public start */}
      <Route path="/" element={<HomePage />} />
      <Route
        path="/start"
        element={<Navigate to={isAuthenticated ? "/offers" : "/"} replace />}
      />
      <Route path="/login" element={<LoginPage />} />

      {/* Public shopping discovery */}
      <Route path="/offers" element={<OffersPage />} />
      <Route path="/product/:productId" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* Protected purchase completion */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success/:orderId"
        element={
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        }
      />

      {/* Protected customer area */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:orderId"
        element={
          <ProtectedRoute>
            <OrderDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:orderId/invoice"
        element={
          <ProtectedRoute>
            <InvoicePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:orderId/rate"
        element={
          <ProtectedRoute>
            <RateOrderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:orderId/rating-success"
        element={
          <ProtectedRoute>
            <RatingSuccessPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/account/addresses"
        element={
          <ProtectedRoute>
            <AddressesPage />
          </ProtectedRoute>
        }
      />

      {/* Operational pages */}
      <Route path="/print" element={<InvoicePrintPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/admin/orders/:orderId" element={<AdminOrderDetailsPage />} />
      <Route path="/admin/banners" element={<AdminBannersPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
