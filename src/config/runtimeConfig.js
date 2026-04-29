export const runtimeModes = {
  LOCAL: "local",
  MOCK: "mock",
  BRIDGE: "bridge",
  HYBRID: "hybrid",
};

const env = import.meta.env || {};

const rawMode = String(env.VITE_RUNTIME_MODE || "").toLowerCase();

function cleanUrl(value = "") {
  return String(value || "").replace(/\/+$/, "");
}

const apiBaseUrl = cleanUrl(
  env.VITE_API_BASE_URL ||
    env.VITE_BRIDGE_BASE_URL ||
    "http://192.168.8.140:5215",
);

const validModes = [
  runtimeModes.LOCAL,
  runtimeModes.MOCK,
  runtimeModes.BRIDGE,
  runtimeModes.HYBRID,
];

const selectedMode = validModes.includes(rawMode)
  ? rawMode
  : runtimeModes.HYBRID;

const runtimeConfig = {
  mode: selectedMode,

  apiBaseUrl,

  // mock هنا معناها تشغيل مصدر JSON/localStorage
  useMock:
    selectedMode === runtimeModes.LOCAL ||
    selectedMode === runtimeModes.MOCK ||
    selectedMode === runtimeModes.HYBRID,

  useBridge:
    selectedMode === runtimeModes.BRIDGE ||
    selectedMode === runtimeModes.HYBRID,
};

console.log("RUNTIME CONFIG:", runtimeConfig);

export function getRuntimeMode() {
  return runtimeConfig.mode;
}

export function isBridgeMode() {
  return runtimeConfig.mode === runtimeModes.BRIDGE;
}

export function isHybridMode() {
  return runtimeConfig.mode === runtimeModes.HYBRID;
}

export function isLocalMode() {
  return (
    runtimeConfig.mode === runtimeModes.LOCAL ||
    runtimeConfig.mode === runtimeModes.MOCK
  );
}

export function shouldUseLocalProducts() {
  return runtimeConfig.useMock;
}

export function shouldUseBridgeProducts() {
  return runtimeConfig.useBridge;
}

export function getApiBaseUrl() {
  return runtimeConfig.apiBaseUrl;
}

export function getRuntimeLabel() {
  if (isHybridMode()) {
    return `Hybrid: JSON + API (${getApiBaseUrl()})`;
  }

  if (isBridgeMode()) {
    return `Bridge API: ${getApiBaseUrl()}`;
  }

  return "وضع محلي JSON";
}

export default runtimeConfig;
