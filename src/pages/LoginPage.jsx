import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <section className="catalog-section">
      <div className="catalog-section__head">
        <div>
          <h2>تسجيل الدخول</h2>
          <p>صفحة مؤقتة أثناء التطوير</p>
        </div>
      </div>

      <div className="catalog-message">
        تسجيل الدخول الحقيقي لم يُفعّل بعد.
        <div style={{ marginTop: 12 }}>
          <Link to="/">العودة للرئيسية</Link>
        </div>
      </div>
    </section>
  );
}
