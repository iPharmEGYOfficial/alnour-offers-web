export const runtimeModes = {
  LOCAL: "local",
  BRIDGE: "bridge",
  PRODUCTION: "production"
};

export function getRuntimeMode() {
  const raw =
    import.meta.env.VITE_RUNTIME_MODE ||
    import.meta.env.MODE ||
    "development";

  if (raw === "bridge") return runtimeModes.BRIDGE;
  if (raw === "production") return runtimeModes.PRODUCTION;
  return runtimeModes.LOCAL;
}

export function getApiBaseUrl() {
  const mode = getRuntimeMode();

  if (mode === runtimeModes.BRIDGE) {
    return import.meta.env.VITE_BRIDGE_BASE_URL || "http://127.0.0.1:5192";
  }

  if (mode === runtimeModes.PRODUCTION) {
    return import.meta.env.VITE_API_BASE_URL || "https://api.example.com";
  }

  return import.meta.env.VITE_API_BASE_URL || "http://localhost:5193";
}

export function getBridgeKey() {
  return import.meta.env.VITE_BRIDGE_KEY || "";
}

export function shouldUseBridgeHeaders() {
  return getRuntimeMode() === runtimeModes.BRIDGE;
}

export function getRuntimeLabel() {
  const mode = getRuntimeMode();

  if (mode === runtimeModes.BRIDGE) return "Bridge";
  if (mode === runtimeModes.PRODUCTION) return "Production";
  return "Local";
}
