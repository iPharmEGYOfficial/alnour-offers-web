import { getRuntimeLabel } from "../../config/runtimeConfig";

export default function RuntimeBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "#eff6ff",
        color: "#1d4ed8",
        border: "1px solid #bfdbfe",
        borderRadius: "999px",
        padding: "6px 10px",
        fontSize: "12px",
        fontWeight: 700
      }}
    >
      {getRuntimeLabel()}
    </span>
  );
}
