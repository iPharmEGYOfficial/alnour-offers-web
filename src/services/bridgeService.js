import apiClient from "./apiClient";

export async function fetchProductsFromBridge() {
  try {
    const res = await apiClient.get("/api/shamel/products");
    return res.data || [];
  } catch (err) {
    console.error("BRIDGE ERROR:", err);
    return [];
  }
}

export async function searchProductsInBridge(query) {
  try {
    const res = await apiClient.get("/api/shamel/product-search", {
      params: { q: query }
    });
    return res.data || [];
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    return [];
  }
}

export default {
  fetchProductsFromBridge,
  searchProductsInBridge
};