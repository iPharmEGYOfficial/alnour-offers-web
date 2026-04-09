import axios from "axios";

// ===== CONFIG =====
const BRIDGE_BASE_URL = "https://bridge.ipharmegy.com";
const BRIDGE_KEY = ""; // 🔥 حط المفتاح هنا لو عندك

// ===== AXIOS INSTANCE =====
const apiClient = axios.create({
  baseURL: BRIDGE_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    ...(BRIDGE_KEY && { "X-Bridge-Key": BRIDGE_KEY })
  }
});

// ===== REQUEST INTERCEPTOR =====
apiClient.interceptors.request.use(
  (config) => {
    console.log("🚀 API Request:", config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== RESPONSE INTERCEPTOR =====
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error?.response || error.message);

    // fallback mock (عشان الموقع ما يبوظش)
    return Promise.resolve({
      data: {
        success: false,
        mocked: true,
        message: "Fallback response (Bridge not reachable)"
      }
    });
  }
);

export default apiClient;