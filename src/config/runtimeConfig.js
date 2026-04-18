const env = import.meta.env || {};

export const runtimeModes = {
  MOCK: "mock",
  BRIDGE: "bridge"
};

export function getRuntimeMode() {
  return "bridge"; // 🔥 FORCE PRODUCTION
}

export const runtimeConfig = {
  apiBaseUrl: env.VITE_API_BASE_URL || "http://localhost:5192",
  bridgeKey: env.VITE_BRIDGE_KEY || "DEV-KEY"
};

export default runtimeConfig;