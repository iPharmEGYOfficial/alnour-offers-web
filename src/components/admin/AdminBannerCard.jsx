export default function AdminBannerCard({ item, onToggle }) {
  return (
    <div className="admin-banner-card">
      <div className="admin-banner-card__head">
        <div>
          <h3>{item.title}</h3>
          <p>{item.subtitle}</p>
        </div>
        <span className={item.enabled ? "banner-state enabled" : "banner-state disabled"}>
          {item.enabled ? "???" : "?????"}
        </span>
      </div>

      <div className="admin-banner-card__body">
        <p><strong>??????:</strong> {item.slot}</p>
        <p><strong>??????:</strong> {item.link}</p>
      </div>

      <div className="admin-banner-card__actions">
        <button className="secondary-btn" onClick={() => onToggle(item.id)}>
          {item.enabled ? "?????" : "?????"}
        </button>
      </div>
    </div>
  );
}

