import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import { getOrderDetails } from "../services/orderService";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetails();
  }, [orderId]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const result = await getOrderDetails(orderId);
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="hero-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <h2 style={{ margin: 0 }}>تفاصيل الطلب</h2>
              <p className="subtle" style={{ marginTop: "8px" }}>
                الطلب رقم #{orderId}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link to="/orders" className="secondary-btn">
                رجوع إلى طلباتي
              </Link>

              <Link to={`/orders/${orderId}/invoice`} className="secondary-btn">
                عرض الفاتورة
              </Link>

              {!data?.order?.isRated && (
                <Link to={`/orders/${orderId}/rate`} className="primary-btn">
                  التالي: تقييم الطلب
                </Link>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="status-box">جارٍ تحميل تفاصيل الطلب...</div>
        ) : !data ? (
          <div className="status-box">تعذر تحميل الطلب</div>
        ) : (
          <>
            <div
              className="hero-card"
              style={{
                marginTop: "20px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                gap: "12px"
              }}
            >
              <div><strong>رقم الطلب:</strong> #{data.order.orderID}</div>
              <div><strong>التاريخ:</strong> {new Date(data.order.orderDate).toLocaleString("ar-EG")}</div>
              <div><strong>الحالة:</strong> {data.order.status}</div>
              <div><strong>طريقة الدفع:</strong> {data.order.paymentMethod || ""}</div>
              <div><strong>الإجمالي النهائي:</strong> {data.order.finalTotal} ر.س</div>
              <div><strong>حالة التقييم:</strong> {data.order.isRated ? "تم التقييم" : "لم يتم التقييم بعد"}</div>
            </div>

            <div className="products-grid" style={{ marginTop: "20px" }}>
              {data.items.map((item) => (
                <div className="product-card" key={item.orderItemID}>
                  <div className="product-image"></div>
                  <h3>{item.displayName || item.productName}</h3>

                  <div className="stock-row">
                    <span>الكمية:</span>
                    <span>{item.qty}</span>
                  </div>

                  <div className="stock-row">
                    <span>السعر الأساسي:</span>
                    <span>{item.unitPrice} ر.س</span>
                  </div>

                  <div className="stock-row">
                    <span>الخصم:</span>
                    <span>{item.discountAmount} ر.س</span>
                  </div>

                  <div className="price-row">
                    <span className="price-current">الإجمالي: {item.finalPrice} ر.س</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hero-card" style={{ marginTop: "20px" }}>
              <div style={{ display: "grid", gap: "8px" }}>
                <div><strong>الإجمالي قبل الخصم:</strong> {data.order.totalBeforeDiscount} ر.س</div>
                <div><strong>خصم العروض:</strong> {data.order.offerDiscount} ر.س</div>
                <div><strong>خصم الكوبون:</strong> {data.order.couponDiscount} ر.س</div>
                <div><strong>خصم النقاط:</strong> {data.order.pointsDiscount} ر.س</div>
                <div style={{ fontWeight: "700", fontSize: "18px" }}>
                  الإجمالي النهائي: {data.order.finalTotal} ر.س
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}>
              <Link to="/orders" className="secondary-btn">
                رجوع
              </Link>

              <Link to={`/orders/${orderId}/invoice`} className="secondary-btn">
                الفاتورة
              </Link>

              {!data?.order?.isRated && (
                <Link to={`/orders/${orderId}/rate`} className="primary-btn">
                  التالي: تقييم الطلب
                </Link>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
