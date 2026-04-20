import apiClient from "./apiClient";

export async function fetchProductsFromBridge() {
  const response = await apiClient.get("/api/shamel/products");
  return response?.data || [];
}

export async function searchProductsInBridge(query) {
  const response = await apiClient.get("/api/shamel/product-search", {
    params: { q: query },
  });
  return response?.data || [];
}

export async function pingBridge() {
  try {
    const response = await apiClient.get("/health");
    return response?.data || "OK";
  } catch {
    return null;
  }
}

export default {
  fetchProductsFromBridge,
  searchProductsInBridge,
  pingBridge,
};

