import { getRuntimeMode, runtimeModes } from "@/config/runtimeConfig";
import apiClient from "./apiClient";
import { buildPriceModel } from "./pricingService";

// 🧠 Normalize data coming from API
function normalize(item, index = 0) {
  const priceModel = buildPriceModel({
    price: item.price,
    originalPrice: item.originalPrice,
  });

  return {
    productID: String(item.productID ?? item.itemNo ?? index + 1),
    id: String(item.productID ?? item.itemNo ?? index + 1),

    productName: item.productName || item.itemNameAr || "منتج",
    name: item.productName || item.itemNameAr || "منتج",

    barcode: item.barcode || "",

    brandName: item.brandName || "Generic",
    brand: item.brandName || "Generic",

    categoryName: item.categoryName || "General",
    category: item.categoryName || "General",

    price: priceModel.price,
    originalPrice: priceModel.originalPrice,
    displayPrice: priceModel.displayPrice,
    displayOriginalPrice: priceModel.displayOriginalPrice,
    hasDiscount: priceModel.hasDiscount,
    discountPercent: priceModel.discountPercent,

    stockQty: Number(item.stockQty || 0),
    stock: Number(item.stockQty || 0),

    imageUrl: item.imageUrl || "/no-image.svg",
    primaryImageUrl: item.primaryImageUrl || "/no-image.svg",
    image: item.primaryImageUrl || item.imageUrl || "/no-image.svg",

    description: item.description || "",
    averageRating: Number(item.averageRating || 0),
    reviewsCount: Number(item.reviewsCount || 0),

    productType: item.productType || "general",
    isActive: true,

    source: "bridge",
  };
}

// 🟢 GET PRODUCTS (with pagination)
export async function getProducts({ page = 1, pageSize = 24 } = {}) {
  const mode = getRuntimeMode();

  if (mode === runtimeModes.BRIDGE) {
    const res = await apiClient.get("/api/products", {
      params: { page, pageSize },
    });

    return {
      items: (res.data.items || []).map(normalize),
      totalCount: res.data.totalCount || 0,
      totalPages: res.data.totalPages || 1,
    };
  }

  return { items: [], totalCount: 0, totalPages: 0 };
}

// 🟢 SEARCH PRODUCTS
export async function searchProducts(query) {
  const mode = getRuntimeMode();

  if (mode === runtimeModes.BRIDGE) {
    if (!query || query.length < 2) {
      return getProducts({ page: 1, pageSize: 50 });
    }

    const res = await apiClient.get("/api/shamel/product-search", {
      params: { query },
    });

    const items = res.data || [];

    return {
      items: items.map(normalize),
      totalCount: items.length,
      totalPages: 1,
    };
  }

  return { items: [], totalCount: 0, totalPages: 0 };
}

// 🟢 GET PRODUCT BY ID
export async function getProductById(id) {
  try {
    const res = await apiClient.get(`/api/products/${id}`);
    return normalize(res.data);
  } catch {
    return null;
  }
}

// 🟢 FEATURED PRODUCTS (simple slice)
export async function getFeaturedProducts({ pageSize = 6 } = {}) {
  const res = await getProducts({ page: 1, pageSize: 50 });

  return {
    ...res,
    items: (res.items || []).slice(0, pageSize),
  };
}

// 🟢 REVIEWS (placeholder for now)
export async function getProductReviews() {
  return [];
}

// 🔥 DEFAULT EXPORT (important for compatibility)
export default {
  getProducts,
  searchProducts,
  getProductById,
  getFeaturedProducts,
  getProductReviews,
};
