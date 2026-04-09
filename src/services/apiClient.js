import axios from "axios";
import {
  getApiBaseUrl,
  getBridgeKey,
  shouldUseBridgeHeaders
} from "../config/runtimeConfig";

const headers = {};

if (shouldUseBridgeHeaders()) {
  const key = getBridgeKey();
  if (key) {
    headers["X-Bridge-Key"] = key;
  }
}

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000,
  headers
});

export default apiClient;
