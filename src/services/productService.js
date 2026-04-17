import mockProducts from "./mockProducts.json";
import { getRuntimeMode, runtimeModes } from "../config/runtimeConfig";

function normalizeMockProduct(item) {
  return {
    productID: String(item.productID ?? ""),
    id: String(item.productID ?? ""),
    productName: item.productName ?? item.name ?? "Unnamed Product",
    name: item.productName ?? item.name ?? "Unnamed Product",
    barcode: String(item.barcode ?? ""),
    price: Number(item.price ?? 0),
    originalPrice: Number(item.originalPrice ?? item.price ?? 0),
    stockQty: Number(item.stockQty ?? 0),
    stock: Number(item.stockQty ?? 0),
    categoryName: item.categoryName ?? "General",
    category: item.categoryName ?? "General",
    brandName: item.brandName ?? "No Brand",
    brand: item.brandName ?? "No Brand",
    imageUrl: item.imageUrl ?? "/no-image.svg",
    primaryImageUrl: item.primaryImageUrl ?? item.imageUrl ?? "/no-image.svg",
    image: item.primaryImageUrl ?? item.imageUrl ?? "/no-image.svg",
    barcodeImageUrl: item.barcodeImageUrl ?? null,
    gallery: Array.isArray(item.gallery) ? item.gallery : [],
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
    filtered = filtered.filter((x) =>
      String(x.productName ?? "").toLowerCase().includes(q) ||
      String(x.barcode ?? "").toLowerCase().includes(q) ||
      String(x.brandName ?? "").toLowerCase().includes(q) ||
      String(x.categoryName ?? "").toLowerCase().includes(q) ||
      String(x.productID ?? "").toLowerCase().includes(q)
    );
  }

  if (offersOnly) {
    filtered = filtered.filter((x) =>
      String(x.productType ?? "").toLowerCase().includes("offer")
    );
  }

  return filtered.filter((x) => Boolean(x.isActive ?? true));
}

function paginateItems(items, page = 1, pageSize = 24) {
  const safePage = Math.max(1, Number(page || 1));
  const safePageSize = Math.min(200, Math.max(1, Number(pageSize || 24)));
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
  const start = (safePage - 1) * safePageSize;

  return {
    items: items.slice(start, start + safePageSize),
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
  const normalizedItems = (mockProducts || []).map(normalizeMockProduct);
  const filtered = filterProducts(normalizedItems, search, offersOnly);
  return paginateItems(filtered, page, pageSize);
}

export async function getProducts(options = {}) {
  const runtimeMode = getRuntimeMode();

  if (runtimeMode === runtimeModes.BRIDGE) {
    return await getProductsFromMock(options);
  }

  return await getProductsFromMock(options);
}

export async function getLiveProducts(options = {}) {
  return await getProductsFromMock(options);
}

export async function getFeaturedProducts({
  page = 1,
  pageSize = 12,
  search = "",
  offersOnly = false
} = {}) {
  return await getProductsFromMock({ page, pageSize, search, offersOnly });
}

export async function getProductById(id) {
  const safeId = String(id || "").trim();
  if (!safeId) return null;

  const items = (mockProducts || []).map(normalizeMockProduct);

  return (
    items.find(
      (x) =>
        String(x.productID).trim() === safeId ||
        String(x.barcode).trim() === safeId
    ) || null
  );
}

export async function getProductReviews() {
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
