const env = import.meta.env || {};

export const runtimeModes = {
  MOCK: "mock",
  BRIDGE: "bridge"
};

export function getRuntimeMode() {
  return env.VITE_RUNTIME_MODE || runtimeModes.MOCK;
}

export function getRuntimeLabel() {
  const mode = getRuntimeMode();

  if (mode === runtimeModes.MOCK) {
    return "وضع تجريبي";
  }

  if (mode === runtimeModes.BRIDGE) {
    return "متصل بالصيدلية";
  }

  return "غير معروف";
}

export const runtimeConfig = {
  mode: getRuntimeMode(),
  apiBaseUrl: env.VITE_API_BASE_URL || "http://localhost:5207",
  bridgeKey: env.VITE_BRIDGE_KEY || ""
};

export default runtimeConfig;