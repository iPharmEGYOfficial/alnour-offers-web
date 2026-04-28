import { socialChannels } from "../../config/socialChannels";

export default function SocialBar() {
  if (!Array.isArray(socialChannels) || socialChannels.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        alignItems: "center"
      }}
    >
      {socialChannels.map((item) => (
        <a
          key={item.key}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          style={{
            textDecoration: "none",
            color: "#0f172a",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "999px",
            padding: "8px 12px",
            fontSize: "13px",
            fontWeight: 700
          }}
          title={item.note || item.label}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}









