import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Receipt80mm from "../components/invoice/Receipt80mm";

const STORAGE_KEY = "alnour_orders";

function readOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function InvoicePrintPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = readOrders().find((x) => String(x.orderNo) === String(id));

  useEffect(() => {
    if (!order) return;

    const printTimer = setTimeout(() => {
      window.print();
    }, 700);

    const afterPrintHandler = () => {
      navigate(`/order-final/${id}`, { replace: true });
    };

    window.addEventListener("afterprint", afterPrintHandler);

    return () => {
      clearTimeout(printTimer);
      window.removeEventListener("afterprint", afterPrintHandler);
    };
  }, [id, navigate, order]);

  if (!order) {
    return (
      <section className="catalog-section" dir="rtl">
        <div className="catalog-message">الطلب غير موجود.</div>
      </section>
    );
  }

  return (
    <section style={screenWrapper} dir="rtl">
      <div style={screenNotice}>جاري تجهيز فاتورة الطباعة الحرارية 80mm...</div>

      <Receipt80mm order={order} />
    </section>
  );
}

const screenWrapper = {
  minHeight: "100vh",
  background: "#f1f5f9",
  padding: 20,
};

const screenNotice = {
  maxWidth: 420,
  margin: "0 auto 14px",
  padding: 12,
  borderRadius: 12,
  background: "#eff6ff",
  color: "#1d4ed8",
  fontWeight: 900,
  textAlign: "center",
};
