import axios from "axios";
import {
  getApiBaseUrl,
  getBridgeKey,
  shouldUseBridgeHeaders
} from "../config/runtimeConfig";

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use(
  (config) => {
    if (shouldUseBridgeHeaders()) {
      const key = getBridgeKey();
      if (key) {
        config.headers["X-Bridge-Key"] = key;
      }
    }

    console.log("API Request:", `${config.baseURL || ""}${config.url || ""}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Response Error:",
      error?.response?.data || error?.message || error
    );
    return Promise.reject(error);
  }
);

export default apiClient;
