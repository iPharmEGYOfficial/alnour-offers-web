import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://bridge.ipharmegy.com/api/open",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use(
  (config) => {
    console.log("API Request:", `${config.baseURL || ""}${config.url || ""}`);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error?.message || error);

    return Promise.resolve({
      data: []
    });
  }
);

export default apiClient;