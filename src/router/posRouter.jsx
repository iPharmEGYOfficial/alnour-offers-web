import POSPage from "../apps/pos/POSPage";

export default function PosRouter() {
  return [
    { path: "/pos", element: <POSPage /> }
  ];
}
