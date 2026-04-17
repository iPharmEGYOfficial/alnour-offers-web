import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import {
  applyCoupon,
  applyPoints,
  confirmOrder,
  createPaymentSession
} from "../services/orderService";
import PaymentMethodSelector from "../components/checkout/PaymentMethodSelector";
import PaymentCountrySelector from "../components/checkout/PaymentCountrySelector";
import {
  CardGatewayPanel,
  TamaraPanel,
  FawryPanel,
  InstaPayManualPanel,
  CashOnDeliveryPanel
} from "../components/checkout/PaymentPanels";
import { getPaymentMethodsByCountry } from "../components/checkout/paymentConfig";

function buildCartItems(items) {
  return items.map((item) => ({
    productId: item.productID,
    qty: Number(item.qty)
  }));
}

function buildCheckoutSummaryFromCart(items) {
  const totalBeforeDiscount = items.reduce(
    (sum, item) => sum + (Number(item.originalPrice ?? item.price) * Number(item.qty)),
    0
  );

  const finalTotal = items.reduce(
    (sum, item) => sum + (Number(item.price) * Number(item.qty)),
    0
  );

  return {
    totalBeforeDiscount,
    offerDiscount: totalBeforeDiscount - finalTotal,
    couponDiscount: 0,
    pointsDiscount: 0,
    deliveryFee: 0,
    vatAmount: 0,
    finalTotal,
    usedPoints: 0,
    message: "OK"
  };
}

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [country, setCountry] = useState("SaudiArabia");
  const methods = useMemo(() => getPaymentMethodsByCountry(country), [country]);

  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");
  const [couponCode, setCouponCode] = useState("");
  const [requestedPoints, setRequestedPoints] = useState(0);

  const [summary, setSummary] = useState(buildCheckoutSummaryFromCart(items));
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [transferReference, setTransferReference] = useState("");

  const customerId = user?.customerID ?? 1;

  useEffect(() => {
    setSummary(buildCheckoutSummaryFromCart(items));
  }, [items]);

  useEffect(() => {
    setPaymentMethod("CashOnDelivery");
  }, [country]);

  const cartItems = useMemo(() => buildCartItems(items), [items]);

  const requiresCard = paymentMethod === "CardGateway";
  const isTamara = paymentMethod === "Tamara";
  const isFawry = paymentMethod === "Fawry";
  const isInstaPay = paymentMethod === "InstaPayManual";
  const isCash = paymentMethod === "CashOnDelivery";

  const currencyLabel = country === "Egypt" ? "EGP" : "SAR";

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      alert("Please enter a coupon code.");
      return;
    }

    try {
      setLoadingCoupon(true);

      const result = await applyCoupon({
        customerId,
        couponCode: couponCode.trim(),
        items: cartItems
      });

      setSummary((prev) => ({
        ...prev,
        ...result
      }));
    } catch (error) {
      console.error("applyCoupon error:", error);
      alert(error?.response?.data?.message || "Failed to apply coupon.");
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleApplyPoints = async () => {
    try {
      setLoadingPoints(true);

      const result = await applyPoints({
        customerId,
        requestedPoints: Number(requestedPoints || 0),
        couponCode: couponCode.trim() || null,
        items: cartItems
      });

      setSummary((prev) => ({
        ...prev,
        ...result
      }));
    } catch (error) {
      console.error("applyPoints error:", error);
      alert(error?.response?.data?.message || "Failed to apply points.");
    } finally {
      setLoadingPoints(false);
    }
  };

  const handleScanCard = () => {
    alert("Card scanning is a placeholder and should be connected to a real payment SDK later.");
  };

  const handleConfirm = async () => {
    if (!items || items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (requiresCard) {
      if (!cardNumber.trim() || !cardName.trim() || !expiry.trim() || !cvv.trim()) {
        alert("Please complete all card payment fields.");
        return;
      }
    }

    if (isInstaPay && !transferReference.trim()) {
      alert("Please enter the transfer reference number.");
      return;
    }

    try {
      setConfirming(true);

      const paymentSession = await createPaymentSession({
        country,
        paymentMethod,
        customerId,
        amount: Number(summary?.finalTotal || 0),
        currency: country === "Egypt" ? "EGP" : "SAR",
        transferReference: transferReference || null
      });

      const result = await confirmOrder({
        customerId,
        country,
        paymentMethod,
        paymentProviderSessionId: paymentSession?.providerSessionId || null,
        couponCode: couponCode.trim() || null,
        usedPoints: Number(summary?.usedPoints || 0),
        transferReference: transferReference || null,
        items: cartItems
      });

      const newOrderId =
        result?.orderId ??
        result?.orderID ??
        result?.id ??
        result?.data?.orderId;

      clearCart();

      if (!newOrderId) {
        alert("The order was submitted, but no order number was returned.");
        return;
      }

      navigate(`/order-success/${newOrderId}`);
    } catch (error) {
      console.error("confirmOrder error:", error);
      alert(error?.response?.data?.message || "Could not confirm the order.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="hero-card">
          <h2>Checkout</h2>
          <p className="subtle">Review your cart, select the payment method, and complete your order.</p>
        </div>

        {items.length === 0 ? (
          <div className="status-box" style={{ marginTop: "20px" }}>
            Your cart is empty.
          </div>
        ) : (
          <>
            <div className="hero-card" style={{ marginTop: "20px" }}>
              <h3 style={{ marginTop: 0 }}>Country / Region</h3>
              <PaymentCountrySelector country={country} onChange={setCountry} />
            </div>

            <div className="hero-card" style={{ marginTop: "20px" }}>
              <h3 style={{ marginTop: 0 }}>Order Items</h3>

              <div style={{ display: "grid", gap: "10px" }}>
                {items.map((item) => (
                  <div
                    key={item.productID}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      paddingBottom: "8px"
                    }}
                  >
                    <span>{item.productName} Ã— {item.qty}</span>
                    <span>{(Number(item.price) * Number(item.qty)).toFixed(2)} {currencyLabel}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-card" style={{ marginTop: "20px" }}>
              <h3 style={{ marginTop: 0 }}>Payment Method</h3>

              <PaymentMethodSelector
                methods={methods}
                selectedMethod={paymentMethod}
                onChange={setPaymentMethod}
              />

              <div style={{ marginTop: "18px" }}>
                {requiresCard && (
                  <CardGatewayPanel
                    cardNumber={cardNumber}
                    setCardNumber={setCardNumber}
                    cardName={cardName}
                    setCardName={setCardName}
                    expiry={expiry}
                    setExpiry={setExpiry}
                    cvv={cvv}
                    setCvv={setCvv}
                    onScan={handleScanCard}
                  />
                )}

                {isTamara && <TamaraPanel />}
                {isFawry && <FawryPanel />}
                {isInstaPay && (
                  <InstaPayManualPanel
                    transferReference={transferReference}
                    setTransferReference={setTransferReference}
                  />
                )}
                {isCash && <CashOnDeliveryPanel />}
              </div>
            </div>

            <div className="hero-card" style={{ marginTop: "20px" }}>
              <h3 style={{ marginTop: 0 }}>Discount Tools</h3>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    style={{
                      flex: 1,
                      minWidth: "220px",
                      height: "48px",
                      borderRadius: "12px",
                      border: "1px solid #d1d5db",
                      padding: "0 12px"
                    }}
                  />
                  <button className="secondary-btn" type="button" onClick={handleApplyCoupon} disabled={loadingCoupon}>
                    {loadingCoupon ? "Applying..." : "Apply Coupon"}
                  </button>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <input
                    type="number"
                    min="0"
                    value={requestedPoints}
                    onChange={(e) => setRequestedPoints(e.target.value)}
                    placeholder="Requested points"
                    style={{
                      flex: 1,
                      minWidth: "220px",
                      height: "48px",
                      borderRadius: "12px",
                      border: "1px solid #d1d5db",
                      padding: "0 12px"
                    }}
                  />
                  <button className="secondary-btn" type="button" onClick={handleApplyPoints} disabled={loadingPoints}>
                    {loadingPoints ? "Applying..." : "Apply Points"}
                  </button>
                </div>
              </div>
            </div>

            <div className="hero-card" style={{ marginTop: "20px" }}>
              <h3 style={{ marginTop: 0 }}>Checkout Summary</h3>

              <div style={{ display: "grid", gap: "8px" }}>
                <div><strong>Total before discounts:</strong> {Number(summary?.totalBeforeDiscount || 0).toFixed(2)} {currencyLabel}</div>
                <div><strong>Offer discount:</strong> {Number(summary?.offerDiscount || 0).toFixed(2)} {currencyLabel}</div>
                <div><strong>Coupon discount:</strong> {Number(summary?.couponDiscount || 0).toFixed(2)} {currencyLabel}</div>
                <div><strong>Points discount:</strong> {Number(summary?.pointsDiscount || 0).toFixed(2)} {currencyLabel}</div>
                <div><strong>Delivery fee:</strong> {Number(summary?.deliveryFee || 0).toFixed(2)} {currencyLabel}</div>
                <div><strong>VAT:</strong> {Number(summary?.vatAmount || 0).toFixed(2)} {currencyLabel}</div>
                <div><strong>Used points:</strong> {Number(summary?.usedPoints || 0)}</div>
                <div style={{ fontWeight: "700", fontSize: "20px", marginTop: "6px" }}>
                  Final total: {Number(summary?.finalTotal || 0).toFixed(2)} {currencyLabel}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
              <button className="secondary-btn" type="button" onClick={() => navigate("/cart")}>
                Back to Cart
              </button>

              <button className="primary-btn" type="button" onClick={handleConfirm} disabled={confirming}>
                {confirming ? "Confirming order..." : "Confirm Order"}
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

