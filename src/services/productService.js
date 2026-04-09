import apiClient from "./apiClient";
import { getRuntimeMode } from "../config/runtimeConfig";

function normalizeBridgeProduct(item) {
  return {
    productID: item.productID ?? item.id ?? item.barcode,
    productName: item.productName ?? item.name ?? "????",
    barcode: item.barcode ?? "",
    price: Number(item.price ?? 0),
    originalPrice: Number(item.originalPrice ?? item.price ?? 0),
    stockQty: Number(item.stockQty ?? item.stock ?? 0),
    categoryName: item.categoryName ?? item.category ?? "",
    brandName: item.brandName ?? item.brand ?? "",
    imageUrl: item.imageUrl ?? item.primaryImageUrl ?? item.image ?? "/no-image.svg",
    primaryImageUrl: item.primaryImageUrl ?? item.imageUrl ?? item.image ?? "/no-image.svg",
    description: item.description ?? "",
    averageRating: Number(item.averageRating ?? item.ratingAverage ?? 0),
    reviewsCount: Number(item.reviewsCount ?? item.ratingCount ?? 0)
  };
}

function normalizeApiProduct(item) {
  return {
    productID: item.productID ?? item.id ?? item.barcode,
    productName: item.productName ?? item.name ?? "????",
    barcode: item.barcode ?? "",
    price: Number(item.price ?? 0),
    originalPrice: Number(item.originalPrice ?? item.price ?? 0),
    stockQty: Number(item.stockQty ?? item.stock ?? 0),
    categoryName: item.categoryName ?? item.category ?? "",
    brandName: item.brandName ?? item.brand ?? "",
    imageUrl: item.imageUrl ?? item.primaryImageUrl ?? item.image ?? "/no-image.svg",
    primaryImageUrl: item.primaryImageUrl ?? item.imageUrl ?? item.image ?? "/no-image.svg",
    description: item.description ?? "",
    averageRating: Number(item.averageRating ?? item.ratingAverage ?? 0),
    reviewsCount: Number(item.reviewsCount ?? item.ratingCount ?? 0)
  };
}

function normalizeProductsPayload(raw, normalizer = normalizeApiProduct) {
  if (Array.isArray(raw)) {
    return {
      items: raw.map(normalizer),
      totalPages: 1,
      totalCount: raw.length
    };
  }

  if (raw && Array.isArray(raw.items)) {
    return {
      items: raw.items.map(normalizer),
      totalPages: Number(raw.totalPages || 1),
      totalCount: Number(raw.totalCount || raw.items.length || 0)
    };
  }

  if (raw && Array.isArray(raw.value)) {
    return {
      items: raw.value.map(normalizer),
      totalPages: Number(raw.totalPages || 1),
      totalCount: Number(raw.totalCount || raw.count || raw.value.length || 0)
    };
  }

  return {
    items: [],
    totalPages: 1,
    totalCount: 0
  };
}

function normalizeReview(item) {
  return {
    id: item.id ?? item.ratingID ?? `review-${Math.random()}`,
    customerName: item.customerName ?? item.authorName ?? "????",
    ratingValue: Number(item.ratingValue ?? item.stars ?? item.value ?? 0),
    title: item.title ?? "",
    comment: item.comment ?? item.reviewText ?? "",
    verifiedPurchase: Boolean(item.verifiedPurchase ?? true),
    adminReply: item.adminReply ?? "",
    createdAt: item.createdAt ?? item.date ?? null
  };
}

export async function getProducts({
  page = 1,
  pageSize = 24,
  search = "",
  offersOnly = false
} = {}) {
  const runtime = getRuntimeMode();

  if (runtime === "bridge") {
    const response = await apiClient.get("/api/shamel/products", {
      params: {
        page,
        pageSize,
        q: search || undefined,
        onlyInStock: true,
        onlyPriced: true
      }
    });

    return normalizeProductsPayload(response?.data, normalizeBridgeProduct);
  }

  const response = await apiClient.get("/api/products", {
    params: {
      page,
      pageSize,
      search: search || undefined,
      offersOnly: offersOnly || undefined
    }
  });

  return normalizeProductsPayload(response?.data, normalizeApiProduct);
}

export async function getProductById(id) {
  const runtime = getRuntimeMode();

  try {
    if (runtime === "bridge") {
      const result = await getProducts({
        page: 1,
        pageSize: 100,
        search: String(id || "")
      });

      const exact = result.items.find(
        (x) =>
          String(x.productID).trim() === String(id).trim() ||
          String(x.barcode).trim() === String(id).trim()
      );

      return exact || result.items[0] || null;
    }

    const response = await apiClient.get(`/api/products/${id}`);
    const raw = response?.data;

    if (raw?.product) return normalizeApiProduct(raw.product);
    return normalizeApiProduct(raw);
  } catch {
    const result = await getProducts({
      page: 1,
      pageSize: 100,
      search: String(id || "")
    });

    const exact = result.items.find(
      (x) =>
        String(x.productID).trim() === String(id).trim() ||
        String(x.barcode).trim() === String(id).trim()
    );

    return exact || result.items[0] || null;
  }
}

export async function getProductReviews(productId) {
  const runtime = getRuntimeMode();

  if (runtime === "bridge") {
    return [];
  }

  try {
    const response = await apiClient.get(`/api/products/${productId}/reviews`);
    const raw = response?.data;

    if (Array.isArray(raw)) return raw.map(normalizeReview);
    if (Array.isArray(raw?.items)) return raw.items.map(normalizeReview);
    if (Array.isArray(raw?.value)) return raw.value.map(normalizeReview);

    return [];
  } catch {
    return [];
  }
}

const productService = {
  getProducts,
  getProductById,
  getProductReviews
};

export default productService;
