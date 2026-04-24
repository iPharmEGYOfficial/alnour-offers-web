const env = import.meta.env || {};

export const runtimeModes = {
  MOCK: "mock",
  BRIDGE: "bridge",
};

export function getRuntimeMode() {
  return env.VITE_RUNTIME_MODE || runtimeModes.BRIDGE;
}

export function getRuntimeLabel() {
  const mode = getRuntimeMode();

  if (mode === runtimeModes.MOCK) return "وضع تجريبي";
  if (mode === runtimeModes.BRIDGE) return "متصل بالشامل عبر Bridge";

  return "غير معروف";
}

const runtimeConfig = {
  apiBaseUrl:
    env.VITE_API_BASE_URL ||
    env.VITE_BRIDGE_BASE_URL ||
    "https://syracuse-bus-operate-posts.trycloudflare.com",
  bridgeKey: env.VITE_BRIDGE_KEY || "",
};

console.log("Runtime Config:", runtimeConfig);
console.log("Runtime Mode:", getRuntimeMode());

export default runtimeConfig;
