import HomePage from "../apps/customer/HomePage";
import OffersPage from "../apps/customer/OffersPage";

export default function CustomerRouter() {
  return [
    { path: "/", element: <HomePage /> },
    { path: "/offers", element: <OffersPage /> }
  ];
}
