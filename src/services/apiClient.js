import axios from "axios";
import runtimeConfig from "@/config/runtimeConfig";

const apiClient = axios.create({
  baseURL: runtimeConfig.apiBaseUrl,
  timeout: 15000,
});

export default apiClient;
