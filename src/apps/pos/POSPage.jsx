import { useEffect, useState } from "react";
import productService from "../services/productService";
import BarcodeScanner from "../components/ui/BarcodeScanner";
import useCartStore from "../store/cartStore";
import { useToast } from "../components/ui/ToastProvider";

import useAuthStore from "../../store/authStore";

export default function POSPage() {
  const [showScanner, setShowScanner] = useState(true);
  const [search, setSearch] = useState("");

  const cart = useCartStore((s) => s.items);
  const addToCart = useCartStore((s) => s.addToCart);
  const increase = useCartStore((s) => s.increaseQty);
  const decrease = useCartStore((s) => s.decreaseQty);
  const clearCart = useCartStore((s) => s.clearCart);

  const { showToast } = useToast();

  // ?? Continuous Scan
  async function handleScan(code) {
    const res = await productService.searchProducts(code);
    const found = res.items || [];

    if (!found.length) {
      showToast("? ??? ?????", "error");
      return;
    }

    const product = found[0];

    addToCart(product);

    // ?? ???
    new Audio("/scan.mp3").play().catch(() => {});

    // ?? ??????
    navigator.vibrate?.(100);

    showToast(`? ${product.productName}`, "success");
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  function handlePrint() {
    window.print();
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* LEFT: SCANNER */}
      <div style={{ flex: 1, background: "#111", color: "#fff", padding: 10 }}>
        <h2>?? Scanner</h2>

        {showScanner && (
          <BarcodeScanner
            onScan={handleScan}
            continuous={true}
          />
        )}

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="?? ??? ????"
          style={{ width: "100%", marginTop: 10, padding: 10 }}
        />
      </div>

      {/* RIGHT: CART */}
      <div style={{ flex: 1, padding: 20, background: "#f8fafc" }}>
        <h2>?? ?????</h2>

        <div style={{ maxHeight: "60vh", overflow: "auto" }}>
          {cart.map((item) => (
            <div key={item.productID} style={{
              background: "#fff",
              marginBottom: 10,
              padding: 10,
              borderRadius: 10
            }}>
              <strong>{item.productName}</strong>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{item.price} ?</span>

                <div>
                  <button onClick={() => decrease(item.productID)}>-</button>
                  <span style={{ margin: "0 10px" }}>{item.qty}</span>
                  <button onClick={() => increase(item.productID)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr />

        <h3>?? ????????: {total} ?</h3>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handlePrint}>?? ?????</button>
          <button onClick={clearCart}>??? ???</button>
        </div>
      </div>

    </div>
  );
}
const isAuth = useAuthStore.getState().isAuthenticated;
if (!isAuth) {
  window.location.href = "/login";
}
