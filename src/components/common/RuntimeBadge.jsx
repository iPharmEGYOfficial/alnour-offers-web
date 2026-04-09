import { getRuntimeLabel } from "../../config/runtimeConfig";

export default function RuntimeBadge() {
  const label = getRuntimeLabel();

  return (
    <span className="runtime-badge">
      Runtime: {label}
    </span>
  );
}
