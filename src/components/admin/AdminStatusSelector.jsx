import { adminOrderStatuses, getStatusLabel } from "../../config/adminOrderStatuses";

export default function AdminStatusSelector({
  value,
  onChange,
  compact = false
}) {
  return (
    <div className={compact ? "admin-status-selector compact" : "admin-status-selector"}>
      <label>حالة الطلب الحالية: <strong>{getStatusLabel(value)}</strong></label>

      <select value={value || "Pending"} onChange={(e) => onChange(e.target.value)}>
        {adminOrderStatuses.map((status) => (
          <option key={status.code} value={status.code}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
}

