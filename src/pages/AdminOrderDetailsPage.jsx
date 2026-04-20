import { useParams } from "react-router-dom";

export default function AdminOrderDetailsPage() {
  const { id } = useParams();

  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>تفاصيل طلب إداري</h2>
          <p>رقم الطلب: {id}</p>
        </div>
      </div>

      <div className="catalog-message">
        شاشة الإدارة التفصيلية ستُربط لاحقًا.
      </div>
    </section>
  );
}
