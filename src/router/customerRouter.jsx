import HomePage from "../apps/customer/HomePage";
import OffersPage from "../apps/customer/OffersPage";
import CartPage from "../apps/customer/CartPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";

const customerRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/offers", element: <OffersPage /> },
  { path: "/product/:id", element: <ProductDetailsPage /> },
  { path: "/cart", element: <CartPage /> },
];

export default customerRoutes;










