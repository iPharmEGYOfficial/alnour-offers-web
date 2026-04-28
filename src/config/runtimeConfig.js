export const runtimeModes = {
  MOCK: "mock",
  BRIDGE: "bridge",
};

const env = import.meta.env || {};

const runtimeConfig = {
  mode: env.VITE_RUNTIME_MODE || runtimeModes.BRIDGE,
  apiBaseUrl:
    env.VITE_API_BASE_URL ||
    env.VITE_BRIDGE_BASE_URL ||
    "http://192.168.8.140:5215",
};

console.log("ENV API:", env.VITE_API_BASE_URL);
console.log("RUNTIME CONFIG:", runtimeConfig);

export function getRuntimeMode() {
  return runtimeConfig.mode;
}

export function isBridgeMode() {
  return getRuntimeMode() === runtimeModes.BRIDGE;
}

export function getApiBaseUrl() {
  return (runtimeConfig.apiBaseUrl || "").replace(/\/+$/, "");
}

export function getRuntimeLabel() {
  if (isBridgeMode()) {
    return `Bridge API: ${getApiBaseUrl()}`;
  }
  return "وضع محلي JSON";
}

export default runtimeConfig;
