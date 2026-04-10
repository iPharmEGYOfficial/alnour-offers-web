import apiClient from "./apiClient";

function normalizeBridgeProduct(item) {
  return {
    productID: item.productID ?? item.id ?? item.barcode ?? "",
    productName: item.productName ?? item.name ?? "Unnamed Product",
    barcode: item.barcode ?? "",
    price: Number(item.price ?? 0),
    originalPrice: Number(item.originalPrice ?? item.price ?? 0),
    stockQty: Number(item.stockQty ?? item.stock ?? 0),
    categoryName: item.categoryName ?? item.category ?? item.productType ?? "",
    brandName: item.brandName ?? item.brand ?? "",
    imageUrl: item.imageUrl ?? item.primaryImageUrl ?? item.image ?? "/no-image.svg",
    primaryImageUrl: item.primaryImageUrl ?? item.imageUrl ?? item.image ?? "/no-image.svg",
    description: item.description ?? "",
    averageRating: Number(item.averageRating ?? item.ratingAverage ?? 0),
    reviewsCount: Number(item.reviewsCount ?? item.ratingCount ?? 0),
    productType: item.productType ?? ""
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

function normalizeReview(item) {
  return {
    id: item.id ?? item.ratingID ?? `review-${Math.random()}`,
    customerName: item.customerName ?? item.authorName ?? "Customer",
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
  const response = await apiClient.get("/products");
  const normalized = normalizeProductsPayload(response?.data);

  let items = normalized.items;

  if (search) {
    const q = String(search).trim().toLowerCase();
    items = items.filter(
      (x) =>
        String(x.productName ?? "").toLowerCase().includes(q) ||
        String(x.barcode ?? "").toLowerCase().includes(q) ||
        String(x.brandName ?? "").toLowerCase().includes(q) ||
        String(x.categoryName ?? "").toLowerCase().includes(q)
    );
  }

  if (offersOnly) {
    items = items.filter((x) =>
      String(x.productType ?? x.categoryName ?? "").toLowerCase().includes("offer")
    );
  }

  items = items.filter((x) => Number(x.stockQty ?? 0) > 0);
  items = items.filter((x) => Number(x.price ?? 0) > 0);

  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (page - 1) * pageSize;
  const pagedItems = items.slice(start, start + pageSize);

  return {
    items: pagedItems,
    totalPages,
    totalCount
  };
}

export async function getProductById(id) {
  const result = await getProducts({
    page: 1,
    pageSize: 500,
    search: String(id || "")
  });

  const exact = result.items.find(
    (x) =>
      String(x.productID).trim() === String(id).trim() ||
      String(x.barcode).trim() === String(id).trim()
  );

  return exact || result.items[0] || null;
}

export async function getProductReviews(productId) {
  return [];
}

const productService = {
  getProducts,
  getProductById,
  getProductReviews
};

export default productService;