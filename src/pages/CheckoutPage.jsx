import { useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AddressForm from "../components/account/AddressForm";
import useCartStore from "../store/cartStore";
import useAccountStore from "../store/accountStore";
import formatCurrency from "../utils/formatCurrency";
import Tesseract from "tesseract.js";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((x) => x.isDefault)?.id || addresses[0]?.id || ""
  );
  const [creatingAddress, setCreatingAddress] = useState(addresses.length === 0);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardForm, setCardForm] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [scannerStream, setScannerStream] = useState(null);
  const [scannerError, setScannerError] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const videoRef = useRef(null);

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
      0
    );
  }, [items]);

  const selectedAddress =
    addresses.find((x) => x.id === selectedAddressId) ||
    addresses.find((x) => x.isDefault) ||
    addresses[0] ||
    null;

  function handleSaveAddress(data) {
    addAddress(data);

    setTimeout(() => {
      const raw = JSON.parse(localStorage.getItem("alnour_addresses") || "[]");
      const latest = raw[0];
      if (latest?.id) setSelectedAddressId(latest.id);
      setCreatingAddress(false);
    }, 50);
  }

  function handleCardChange(e) {
    const { name, value } = e.target;
    setCardForm((prev) => ({ ...prev, [name]: value }));
  }

  function isValidCard() {
    return (
      cardForm.cardName.trim() &&
      cardForm.cardNumber.replace(/\s/g, "").length >= 12 &&
      cardForm.expiry.trim().length >= 4 &&
      cardForm.cvv.trim().length >= 3
    );
  }

  async function openCardScanner() {
    setShowScanner(true);
    setScannerError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setScannerError("الكاميرا غير مدعومة في هذا المتصفح");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      setScannerStream(stream);

      setTimeout(() => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      }, 100);
    } catch {
      setScannerError("تعذر تشغيل الكاميرا. اسمح للمتصفح باستخدام الكاميرا.");
    }
  }

  function closeCardScanner() {
    if (scannerStream) {
      scannerStream.getTracks().forEach((track) => track.stop());
    }

    setScannerStream(null);
    setShowScanner(false);
  }

  async function captureMockCard() {
    const video = videoRef.current;

    if (!video) {
      setScannerError("الكاميرا غير جاهزة بعد");
      return;
    }

    try {
      setOcrLoading(true);
      setScannerError("");

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/png");

      const result = await Tesseract.recognize(imageData, "eng", {
        logger: () => {}
      });

      const text = result?.data?.text || "";
      const digits = text.replace(/\D/g, "");

      const possibleCard =
        digits.match(/\d{16}/)?.[0] ||
        digits.match(/\d{15}/)?.[0] ||
        digits.match(/\d{14}/)?.[0] ||
        "";

      if (!possibleCard) {
        setScannerError("لم أتمكن من قراءة رقم البطاقة. قرّب البطاقة واجعل الأرقام واضحة ثم أعد المحاولة.");
        return;
      }

      const formatted = possibleCard.replace(/(.{4})/g, "$1 ").trim();

      setCardForm((prev) => ({
        ...prev,
        cardNumber: formatted,
        expiry: prev.expiry || "",
        cvv: prev.cvv || "",
      }));

      closeCardScanner();
    } catch {
      setScannerError("حدث خطأ أثناء قراءة البطاقة بالكاميرا.");
    } finally {
      setOcrLoading(false);
    }
  }

  function simulateCardPayment() {
    return new Promise((resolve) => {
      setPaymentStatus("processing");
      setPaymentMessage("جاري الاتصال بالبنك ومعالجة العملية...");

      setTimeout(() => {
        const cleanNumber = cardForm.cardNumber.replace(/\s/g, "");
        const failed = cleanNumber.endsWith("0000");

        if (failed) {
          setPaymentStatus("failed");
          setPaymentMessage("تم رفض العملية. جرّب بطاقة أخرى أو اختر الدفع عند الاستلام.");
          resolve(false);
        } else {
          setPaymentStatus("success");
          setPaymentMessage(`تمت الموافقة على الدفع. البطاقة المنتهية بـ ${cleanNumber.slice(-4)}`);
          resolve(true);
        }
      }, 1800);
    });
  }

  async function handleConfirmOrder() {
    if (!items.length) {
      alert("السلة فارغة");
      return;
    }

    if (!selectedAddress && !creatingAddress) {
      alert("من فضلك اختر أو أضف عنوان التوصيل");
      return;
    }

    if (creatingAddress) {
      alert("احفظ العنوان أولاً قبل تأكيد الطلب");
      return;
    }

    if (paymentMethod === "card") {
      if (!isValidCard()) {
        alert("من فضلك أدخل بيانات البطاقة بشكل صحيح");
        return;
      }

      const paid = await simulateCardPayment();
      if (!paid) return;
    }

    const orderNo = `AN-${Date.now()}`;

    clearCart();

    navigate("/order-success", {
      state: {
        orderNo,
        total,
        paymentMethod,
        paymentInfo:
          paymentMethod === "card"
            ? {
                status: "paid",
                provider: "Local Mock Gateway",
                cardLast4: cardForm.cardNumber.replace(/\s/g, "").slice(-4),
              }
            : {
                status: "cash_on_delivery",
                provider: "COD",
              },
        address: selectedAddress,
        items,
      },
    });
  }

  if (!items.length) {
    return (
      <section className="catalog-section" dir="rtl">
        <div className="catalog-section__head">
          <div>
            <h2>إتمام الطلب</h2>
            <p>السلة فارغة حالياً</p>
          </div>
        </div>

        <div className="catalog-message">
          لا توجد منتجات في السلة.
          <div style={{ marginTop: 12 }}>
            <Link to="/offers">تصفح المنتجات</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="catalog-section" dir="rtl">
      <div className="catalog-section__head">
        <div>
          <h2>إتمام الطلب</h2>
          <p>راجع المنتجات واختر عنوان التوصيل وطريقة الدفع</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>المنتجات</h3>

          <div style={{ display: "grid", gap: 12 }}>
            {items.map((item) => (
              <div key={item.productID || item.id} style={innerCardStyle}>
                <div style={{ fontWeight: 800 }}>
                  {item.productName || item.name || "منتج"}
                </div>
                <div style={muted}>الكمية: {item.qty}</div>
                <div style={muted}>سعر الوحدة: {formatCurrency(item.price)}</div>
                <div style={{ fontWeight: 900, marginTop: 6 }}>
                  الإجمالي الفرعي:{" "}
                  {formatCurrency(Number(item.price || 0) * Number(item.qty || 0))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionHead}>
            <h3 style={{ margin: 0 }}>العنوان</h3>

            <button
              type="button"
              onClick={() => setCreatingAddress((v) => !v)}
              style={secondaryBtn}
            >
              {creatingAddress ? "إلغاء" : "إضافة عنوان جديد بالخريطة"}
            </button>
          </div>

          {creatingAddress ? (
            <AddressForm
              onSave={handleSaveAddress}
              onCancel={() => setCreatingAddress(false)}
            />
          ) : addresses.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {addresses.map((address) => (
                <label
                  key={address.id}
                  style={{
                    display: "block",
                    border:
                      selectedAddressId === address.id
                        ? "2px solid #2563eb"
                        : "1px solid #e5e7eb",
                    borderRadius: 14,
                    padding: 14,
                    cursor: "pointer",
                    background:
                      selectedAddressId === address.id ? "#eff6ff" : "#fff",
                  }}
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                    style={{ marginLeft: 8 }}
                  />

                  <strong>{address.label || "عنوان"}</strong> -{" "}
                  {address.fullName || "-"}
                  <div style={muted}>
                    {address.city || "-"} - {address.district || "-"} -{" "}
                    {address.street || "-"}
                  </div>
                  <div style={muted}>{address.phone || "-"}</div>
                </label>
              ))}
            </div>
          ) : (
            <div className="catalog-message">
              لا يوجد عنوان محفوظ. اضغط إضافة عنوان جديد بالخريطة.
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>طريقة الدفع</h3>

          <div style={{ display: "grid", gap: 10 }}>
            <label style={radioCard(paymentMethod === "cash")}>
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                style={{ marginLeft: 8 }}
              />
              الدفع عند الاستلام
            </label>

            <label style={radioCard(paymentMethod === "card")}>
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                style={{ marginLeft: 8 }}
              />
              بطاقة مدى / فيزا
            </label>

            {paymentMethod === "card" && (
              <div style={cardPaymentBox}>
                <h4 style={{ margin: 0 }}>بيانات البطاقة - تجربة محلية</h4>

                <button type="button" onClick={openCardScanner} style={scanBtn}>
                  📷 Scan البطاقة
                </button>

                <input
                  name="cardName"
                  value={cardForm.cardName}
                  onChange={handleCardChange}
                  placeholder="اسم حامل البطاقة"
                  style={inputStyle}
                />

                <input
                  name="cardNumber"
                  value={cardForm.cardNumber}
                  onChange={handleCardChange}
                  placeholder="رقم البطاقة"
                  inputMode="numeric"
                  maxLength={19}
                  style={inputStyle}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <input
                    name="expiry"
                    value={cardForm.expiry}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    style={inputStyle}
                  />

                  <input
                    name="cvv"
                    value={cardForm.cvv}
                    onChange={handleCardChange}
                    placeholder="CVV"
                    inputMode="numeric"
                    maxLength={4}
                    style={inputStyle}
                  />
                </div>

                <div style={{ color: "#64748b", fontSize: 13 }}>
                  هذه واجهة دفع تجريبية محلية فقط ولا يتم إرسال أو حفظ بيانات البطاقة.
                </div>

                {paymentStatus !== "idle" && (
                  <div style={paymentStatusBox(paymentStatus)}>
                    {paymentStatus === "processing"
                      ? "⏳ "
                      : paymentStatus === "success"
                      ? "✅ "
                      : "❌ "}
                    {paymentMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 12 }}>
            الإجمالي: {formatCurrency(total)}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleConfirmOrder}
              style={primaryBtn}
              disabled={paymentStatus === "processing"}
            >
              {paymentStatus === "processing" ? "جاري الدفع..." : "تأكيد الطلب"}
            </button>

            <Link to="/cart" style={secondaryLink}>
              العودة إلى السلة
            </Link>
          </div>
        </div>
      </div>

      {showScanner && (
        <div style={scannerOverlay}>
          <div style={scannerModal}>
            <h3>📷 مسح البطاقة</h3>

            <div style={videoBox}>
              <video ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={scanFrame} />
              <div style={scanText}>ضع البطاقة داخل الإطار</div>
            </div>

            {scannerError && <div style={scannerErrorStyle}>{scannerError}</div>}

            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button type="button" onClick={captureMockCard} style={captureBtn} disabled={ocrLoading}>
                {ocrLoading ? "جاري قراءة البطاقة..." : "قراءة البطاقة OCR"}
              </button>

              <button type="button" onClick={closeCardScanner} style={cancelBtn}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 18,
};

const innerCardStyle = {
  border: "1px solid #eef2f7",
  borderRadius: 14,
  padding: 14,
};

const muted = {
  color: "#64748b",
  marginTop: 6,
};

const sectionHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 14,
};

const primaryBtn = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryLink = {
  display: "inline-block",
  padding: "12px 18px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 800,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  fontSize: 15,
  boxSizing: "border-box",
};

const cardPaymentBox = {
  marginTop: 12,
  padding: 14,
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  background: "#eff6ff",
  display: "grid",
  gap: 10,
};

const scanBtn = {
  padding: "12px 16px",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
};

function radioCard(active) {
  return {
    display: "block",
    border: active ? "2px solid #2563eb" : "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 14,
    cursor: "pointer",
    background: active ? "#eff6ff" : "#fff",
  };
}

function paymentStatusBox(status) {
  return {
    padding: 12,
    borderRadius: 12,
    fontWeight: 800,
    background:
      status === "processing" ? "#fef3c7" : status === "success" ? "#dcfce7" : "#fee2e2",
    color:
      status === "processing" ? "#92400e" : status === "success" ? "#166534" : "#991b1b",
  };
}

const scannerOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.72)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const scannerModal = {
  width: 390,
  maxWidth: "92vw",
  background: "#fff",
  borderRadius: 22,
  padding: 20,
  textAlign: "center",
};

const videoBox = {
  height: 230,
  borderRadius: 18,
  background: "#111",
  marginBottom: 14,
  overflow: "hidden",
  position: "relative",
  border: "3px solid #2563eb",
};

const scanFrame = {
  position: "absolute",
  inset: 22,
  border: "2px dashed #22c55e",
  borderRadius: 16,
  pointerEvents: "none",
};

const scanText = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 12,
  color: "#fff",
  fontWeight: 800,
  fontSize: 13,
  textShadow: "0 1px 4px #000",
};

const scannerErrorStyle = {
  background: "#fee2e2",
  color: "#991b1b",
  borderRadius: 12,
  padding: 10,
  marginBottom: 12,
  fontWeight: 800,
};

const captureBtn = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "none",
  background: "#22c55e",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const cancelBtn = {
  padding: "10px 16px",
  borderRadius: 12,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
};

