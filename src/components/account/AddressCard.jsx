export default function AddressCard({
  item,
  address,
  onEdit,
  onDelete,
  onSetDefault,
  selectable = false,
  selected = false,
  onSelect,
}) {
  const data = item || address || {};

  const fullAddress = [data.country, data.city, data.district]
    .filter(Boolean)
    .join(" / ");

  const buildingLine = [
    data.street,
    data.buildingNo ? `مبنى ${data.buildingNo}` : "",
    data.floor ? `دور ${data.floor}` : "",
    data.apartment ? `شقة ${data.apartment}` : "",
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <div
      className="address-card"
      style={{
        border: selected ? "2px solid #2563eb" : "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 16,
        background: selected ? "#eff6ff" : "#fff",
      }}
    >
      <div className="address-card__head" style={headStyle}>
        <div>
          <h3 style={{ margin: 0 }}>
            {data.label || "عنوان محفوظ"}{" "}
            {data.isDefault && <span style={defaultBadge}>افتراضي</span>}
          </h3>

          <p style={muted}>
            {data.fullName || "بدون اسم"} {data.phone ? `• ${data.phone}` : ""}
          </p>
        </div>

        <div className="address-card__badges" style={badgesStyle}>
          {data.latitude && data.longitude && (
            <span style={mapBadge}>جاهز للخريطة</span>
          )}
        </div>
      </div>

      <div className="address-card__body" style={{ marginTop: 12 }}>
        {fullAddress && <p style={lineStyle}>{fullAddress}</p>}
        {buildingLine && <p style={lineStyle}>{buildingLine}</p>}

        {data.notes && (
          <p style={muted}>
            <strong>ملاحظات:</strong> {data.notes}
          </p>
        )}

        {(data.latitude || data.longitude) && (
          <p style={muted}>
            الإحداثيات: {data.latitude || "-"} / {data.longitude || "-"}
          </p>
        )}
      </div>

      <div className="address-card__actions" style={actionsStyle}>
        {selectable && (
          <button type="button" style={primaryBtn} onClick={() => onSelect?.(data)}>
            {selected ? "العنوان المختار" : "اختيار"}
          </button>
        )}

        {!data.isDefault && (
          <button
            type="button"
            style={secondaryBtn}
            onClick={() => onSetDefault?.(data.id)}
          >
            تعيين كافتراضي
          </button>
        )}

        <button type="button" style={secondaryBtn} onClick={() => onEdit?.(data)}>
          تعديل
        </button>

        <button
          type="button"
          style={dangerBtn}
          onClick={() => {
            if (confirm("هل تريد حذف هذا العنوان؟")) {
              onDelete?.(data.id);
            }
          }}
        >
          حذف
        </button>
      </div>
    </div>
  );
}

const headStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const badgesStyle = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const muted = {
  color: "#64748b",
  margin: "6px 0 0",
};

const lineStyle = {
  margin: "6px 0 0",
};

const actionsStyle = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 14,
};

const primaryBtn = {
  padding: "9px 12px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "9px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  fontWeight: 800,
  cursor: "pointer",
};

const dangerBtn = {
  ...secondaryBtn,
  color: "#b91c1c",
  border: "1px solid #fecaca",
  background: "#fff5f5",
};

const defaultBadge = {
  display: "inline-block",
  marginRight: 8,
  padding: "3px 8px",
  borderRadius: 999,
  background: "#dcfce7",
  color: "#166534",
  fontSize: 12,
};

const mapBadge = {
  display: "inline-block",
  padding: "3px 8px",
  borderRadius: 999,
  background: "#dbeafe",
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 800,
};
