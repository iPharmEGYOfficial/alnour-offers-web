import { getRuntimeLabel, isBridgeMode } from "../../config/runtimeConfig";

export default function RuntimeBadge() {
  const bridge = isBridgeMode();

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: bridge ? "#ecfdf5" : "#eff6ff",
        color: bridge ? "#047857" : "#1d4ed8",
        border: bridge ? "1px solid #a7f3d0" : "1px solid #bfdbfe",
        borderRadius: "999px",
        padding: "6px 10px",
        fontSize: "12px",
        fontWeight: 700,
      }}
      title={getRuntimeLabel()}
    >
      {bridge ? "🟢 Bridge Live" : "🔵 Mock JSON"}
    </span>
  );
}
