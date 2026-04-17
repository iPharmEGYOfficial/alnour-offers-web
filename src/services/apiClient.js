import axios from "axios";
import runtimeConfig from "../config/runtimeConfig";

const apiClient = axios.create({
  baseURL: runtimeConfig.apiBaseUrl,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    if (runtimeConfig.bridgeKey) {
      config.headers["X-Bridge-Key"] = runtimeConfig.bridgeKey;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default apiClient;