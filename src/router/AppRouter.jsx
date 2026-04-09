import AdminOrderDetailsPage from "../pages/AdminOrderDetailsPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminBannersPage from "../pages/AdminBannersPage";
import InvoicePrintPage from "../pages/InvoicePrintPage";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import OffersPage from "../pages/OffersPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import RateOrderPage from "../pages/RateOrderPage";
import RatingSuccessPage from "../pages/RatingSuccessPage";
import InvoicePage from "../pages/InvoicePage";
import HomePage from "../pages/HomePage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import AccountPage from "../pages/AccountPage";
import AddressesPage from "../pages/AddressesPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import useAuthStore from "../store/authStore";

export default function AppRouter() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/start"
        element={<Navigate to={isAuthenticated ? "/offers" : "/login"} replace />}
      />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/offers"
        element={
          <ProtectedRoute>
            <OffersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product/:productId"
        element={
          <ProtectedRoute>
            <ProductDetailsPage />
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

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

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
        path="/order-success/:orderId"
        element={
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        }
      />

      <Route path="/print" element={<InvoicePrintPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/admin/orders/:orderId" element={<AdminOrderDetailsPage />} />
      <Route path="/admin/banners" element={<AdminBannersPage />} />
    </Routes>
  );
}
