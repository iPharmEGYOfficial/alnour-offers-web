import apiClient from "./apiClient";
import mockProducts from "./mockProducts.json";
import { getRuntimeMode, runtimeModes } from "../config/runtimeConfig";

function normalizeBridgeProduct(item) {
  return {
    productID: String(item.productID ?? item.id ?? item.ItemNo ?? item.barcode ?? ""),
    productName: item.productName ?? item.name ?? item.ItemNameAr ?? "Unnamed Product",
    barcode: String(item.barcode ?? ""),
    price: Number(item.price ?? 0),
    originalPrice: Number(item.originalPrice ?? item.price ?? 0),
    stockQty: Number(item.stockQty ?? item.stock ?? item.Qty ?? 0),
    categoryName: item.categoryName ?? item.category ?? item.productType ?? "General",
    brandName: item.brandName ?? item.brand ?? "No Brand",
    imageUrl: item.imageUrl ?? item.primaryImageUrl ?? item.image ?? "/no-image.svg",
    primaryImageUrl: item.primaryImageUrl ?? item.imageUrl ?? item.image ?? "/no-image.svg",
    barcodeImageUrl: item.barcodeImageUrl ?? null,
    gallery: Array.isArray(item.gallery)
      ? item.gallery
      : item.gallery
        ? [item.gallery]
        : [],
    description: item.description ?? "",
    averageRating: Number(item.averageRating ?? item.ratingAverage ?? 0),
    reviewsCount: Number(item.reviewsCount ?? item.ratingCount ?? 0),
    productType: item.productType ?? "general",
    isActive: item.isActive ?? true,
    source: item.source ?? "bridge-live"
  };
}

function normalizeProductsPayload(raw) {
  if (Array.isArray(raw)) {
    return {
      items: raw.map(normalizeBridgeProduct),
      totalPages: 1,
      totalCount: raw.length
    };
  }

  if (raw && Array.isArray(raw.items)) {
    return {
      items: raw.items.map(normalizeBridgeProduct),
      totalPages: Number(raw.totalPages || 1),
      totalCount: Number(raw.totalCount || raw.items.length || 0)
    };
  }

  if (raw && Array.isArray(raw.value)) {
    return {
      items: raw.value.map(normalizeBridgeProduct),
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

function normalizeMockProduct(item) {
  return {
    productID: String(item.productID ?? ""),
    productName: item.productName ?? "Unnamed Product",
    barcode: String(item.barcode ?? ""),
    price: Number(item.price ?? 0),
    originalPrice: Number(item.originalPrice ?? item.price ?? 0),
    stockQty: Number(item.stockQty ?? 0),
    categoryName: item.categoryName ?? "General",
    brandName: item.brandName ?? "No Brand",
    imageUrl: item.imageUrl ?? "/no-image.svg",
    primaryImageUrl: item.primaryImageUrl ?? item.imageUrl ?? "/no-image.svg",
    barcodeImageUrl: item.barcodeImageUrl ?? null,
    gallery: Array.isArray(item.gallery)
      ? item.gallery
      : item.gallery
        ? [item.gallery]
        : [],
    description: item.description ?? "",
    averageRating: Number(item.averageRating ?? 0),
    reviewsCount: Number(item.reviewsCount ?? 0),
    productType: item.productType ?? "general",
    isActive: item.isActive ?? true,
    source: item.source ?? "local-manual-seed"
  };
}

function filterProducts(items, search = "", offersOnly = false) {
  let filtered = [...items];

  if (search) {
    const q = String(search).trim().toLowerCase();
    filtered = filtered.filter(
      (x) =>
        String(x.productName ?? "").toLowerCase().includes(q) ||
        String(x.barcode ?? "").toLowerCase().includes(q) ||
        String(x.brandName ?? "").toLowerCase().includes(q) ||
        String(x.categoryName ?? "").toLowerCase().includes(q) ||
        String(x.productID ?? "").toLowerCase().includes(q)
    );
  }

  if (offersOnly) {
    filtered = filtered.filter((x) =>
      String(x.productType ?? x.categoryName ?? "").toLowerCase().includes("offer")
    );
  }

  return filtered.filter(
    (x) => Boolean(x.isActive ?? true) && Number(x.stockQty ?? 0) > 0
  );
}

function paginateItems(items, page = 1, pageSize = 24) {
  const safePage = Math.max(1, Number(page || 1));
  const safePageSize = Math.min(200, Math.max(1, Number(pageSize || 24)));

  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
  const start = (safePage - 1) * safePageSize;
  const pagedItems = items.slice(start, start + safePageSize);

  return {
    items: pagedItems,
    totalPages,
    totalCount
  };
}

async function getProductsFromMock({
  page = 1,
  pageSize = 24,
  search = "",
  offersOnly = false
} = {}) {
  const normalizedItems = mockProducts.map(normalizeMockProduct);
  const filtered = filterProducts(normalizedItems, search, offersOnly);
  return paginateItems(filtered, page, pageSize);
}

async function getProductsFromApi({
  page = 1,
  pageSize = 24,
  search = "",
  offersOnly = false
} = {}) {
  const response = await apiClient.get(
    `/api/products?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search || "")}`
  );

  const normalized = normalizeProductsPayload(response?.data);
  const filtered = filterProducts(normalized.items, search, offersOnly);

  return {
    items: filtered,
    totalPages: normalized.totalPages,
    totalCount: normalized.totalCount
  };
}

export async function getProducts({
  page = 1,
  pageSize = 24,
  search = "",
  offersOnly = false
} = {}) {
  const runtimeMode = getRuntimeMode();

  if (runtimeMode === runtimeModes.LOCAL) {
    return getProductsFromMock({ page, pageSize, search, offersOnly });
  }

  return await getProductsFromApi({ page, pageSize, search, offersOnly });
}

export async function getLiveProducts({
  page = 1,
  pageSize = 24,
  search = "",
  offersOnly = false
} = {}) {
  return await getProductsFromApi({ page, pageSize, search, offersOnly });
}

export async function getFeaturedProducts({
  page = 1,
  pageSize = 24,
  search = "",
  offersOnly = false
} = {}) {
  return await getProductsFromMock({ page, pageSize, search, offersOnly });
}

export async function getProductById(id) {
  const runtimeMode = getRuntimeMode();
  const safeId = String(id || "").trim();

  if (!safeId) return null;

  if (runtimeMode === runtimeModes.LOCAL) {
    const items = mockProducts.map(normalizeMockProduct);
    return (
      items.find(
        (x) =>
          String(x.productID).trim() === safeId ||
          String(x.barcode).trim() === safeId
      ) || null
    );
  }

  const response = await apiClient.get(`/api/products/${encodeURIComponent(safeId)}`);
  return normalizeBridgeProduct(response?.data);
}

export async function getProductReviews(productId) {
  return [];
}

const productService = {
  getProducts,
  getLiveProducts,
  getFeaturedProducts,
  getProductById,
  getProductReviews
};

export default productService;
