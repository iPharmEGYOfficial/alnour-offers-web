import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CustomerRouter from "./router/customerRouter";
import PosRouter from "./router/posRouter";

function detectMode() {
  if (window.location.pathname.startsWith("/pos")) {
    return "pos";
  }
  return "customer";
}

const mode = detectMode();

const routes =
  mode === "pos"
    ? PosRouter()
    : CustomerRouter();

const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
