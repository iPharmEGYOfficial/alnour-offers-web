export default function AdminBannerCard({ item, onToggle }) {
  const stateLabel = item.enabled ? "نشط" : "متوقف";

  return (
    <div className="admin-banner-card">
      <div className="admin-banner-card__head">
        <div>
          <h3>{item.title || "بانر بدون عنوان"}</h3>
          <p>{item.subtitle || "لا يوجد وصف مختصر لهذا البانر"}</p>
        </div>

        <span className={item.enabled ? "banner-state enabled" : "banner-state disabled"}>
          {stateLabel}
        </span>
      </div>

      <div className="admin-banner-card__body">
        <p><strong>الموضع:</strong> {item.slot || "غير محدد"}</p>
        <p><strong>الرابط:</strong> {item.link || "بدون رابط"}</p>
      </div>

      <div className="admin-banner-card__actions">
        <button className="secondary-btn" onClick={() => onToggle(item.id)}>
          {item.enabled ? "إيقاف البانر" : "تفعيل البانر"}
        </button>
      </div>
    </div>
  );
}









