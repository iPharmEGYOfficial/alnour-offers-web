export default function AddressCard({
  item,
  onDelete,
  onSetDefault
}) {
  return (
    <div className="address-card">
      <div className="address-card__head">
        <div>
          <h3>{item.label}</h3>
          <p>{item.fullName} {item.phone ? ` ${item.phone}` : ""}</p>
        </div>

        <div className="address-card__badges">
          {item.isDefault && <span className="verified-badge">???????</span>}
          {item.latitude && item.longitude && (
            <span className="meta-chip">Map Ready</span>
          )}
        </div>
      </div>

      <div className="address-card__body">
        <p>
          {item.country} / {item.city} / {item.district}
        </p>
        <p>
          {item.street} {item.buildingNo ? `- ???? ${item.buildingNo}` : ""}
          {item.floor ? ` - ??? ${item.floor}` : ""}
          {item.apartment ? ` - ??? ${item.apartment}` : ""}
        </p>

        {item.notes && <p className="subtle">{item.notes}</p>}

        {(item.latitude || item.longitude) && (
          <p className="subtle">
            Lat: {item.latitude || "-"} | Lng: {item.longitude || "-"}
          </p>
        )}
      </div>

      <div className="address-card__actions">
        {!item.isDefault && (
          <button className="secondary-btn" onClick={() => onSetDefault(item.id)}>
            ????? ????????
          </button>
        )}
        <button className="secondary-btn danger" onClick={() => onDelete(item.id)}>
          ???
        </button>
      </div>
    </div>
  );
}
