import axios from "axios";
import { getApiBaseUrl, getBridgeKey, shouldUseBridgeHeaders } from "../config/runtimeConfig";

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

    console.log("API Request:", `${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;