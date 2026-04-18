export default function AddressCard({
  item,
  onDelete,
  onSetDefault
}) {
  const fullAddress = [
    item.country,
    item.city,
    item.district
  ]
    .filter(Boolean)
    .join(" / ");

  const buildingLine = [
    item.street,
    item.buildingNo ? `مبنى ${item.buildingNo}` : "",
    item.floor ? `دور ${item.floor}` : "",
    item.apartment ? `شقة ${item.apartment}` : ""
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <div className="address-card">
      <div className="address-card__head">
        <div>
          <h3>{item.label || "عنوان محفوظ"}</h3>
          <p>{item.fullName || "بدون اسم"} {item.phone ? `• ${item.phone}` : ""}</p>
        </div>

        <div className="address-card__badges">
          {item.isDefault && <span className="verified-badge">العنوان الافتراضي</span>}
          {item.latitude && item.longitude && (
            <span className="meta-chip">جاهز للخريطة</span>
          )}
        </div>
      </div>

      <div className="address-card__body">
        {fullAddress && <p>{fullAddress}</p>}
        {buildingLine && <p>{buildingLine}</p>}

        {item.notes && (
          <p className="subtle">
            <strong>ملاحظات:</strong> {item.notes}
          </p>
        )}

        {(item.latitude || item.longitude) && (
          <p className="subtle">
            الإحداثيات: {item.latitude || "-"} / {item.longitude || "-"}
          </p>
        )}
      </div>

      <div className="address-card__actions">
        {!item.isDefault && (
          <button className="secondary-btn" onClick={() => onSetDefault(item.id)}>
            تعيين كافتراضي
          </button>
        )}

        <button className="secondary-btn danger" onClick={() => onDelete(item.id)}>
          حذف العنوان
        </button>
      </div>
    </div>
  );
}