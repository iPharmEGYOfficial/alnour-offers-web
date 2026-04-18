import mockProducts from "./mockProducts.json";
import { getRuntimeMode, runtimeModes } from "../config/runtimeConfig";
import { buildPriceModel, toNumber } from "./pricingService";
import { extractBrands, extractCategories, filterCatalog } from "./catalogService";

function safeText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function safeBarcode(value) {
  const text = String(value ?? "").trim();
  return text || "";
}

function buildFallbackPrice(item) {
  const category = safeText(item.categoryName, "General").toLowerCase();
  const brand = safeText(item.brandName, "Generic").toLowerCase();

  if (category.includes("thermometer")) return 149;
  if (category.includes("blood pressure")) return 229;
  if (category.includes("mother")) return 189;
  if (category.includes("massage")) return 175;
  if (category.includes("dental")) return 139;
  if (category.includes("first aid")) return 49;
  if (category.includes("beauty")) return 79;
  if (category.includes("hair")) return 129;
  if (category.includes("personal care")) return 69;
  if (brand.includes("braun")) return 239;
  if (brand.includes("philips")) return 199;
  if (brand.includes("omron")) return 249;

  return 95;
}

function buildFallbackOriginalPrice(finalPrice) {
  const price = toNumber(finalPrice, 0);
  if (price <= 0) return 0;
  return Math.round(price + Math.max(15, price * 0.2));
}

function normalizeMockProduct(item) {
  const productID = safeText(item.productID, `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const productName = safeText(item.productName || item.name, "منتج بدون اسم");
  const barcode = safeBarcode(item.barcode);
  const categoryName = safeText(item.categoryName, "General");
  const brandName = safeText(item.brandName, "Generic");
  const imageUrl = safeText(item.imageUrl, "/no-image.svg");
  const primaryImageUrl = safeText(item.primaryImageUrl, imageUrl);
  const stockQty = Math.max(1, toNumber(item.stockQty, 1));
  const averageRating = Math.max(0, Math.min(5, toNumber(item.averageRating, 0)));
  const reviewsCount = Math.max(0, toNumber(item.reviewsCount, 0));
  const fallbackPrice = buildFallbackPrice(item);

  const originalSourcePrice = toNumber(item.price, 0);
  const originalSourceOriginalPrice = toNumber(item.originalPrice, 0);

  const originalComputedPrice =
    originalSourcePrice > 0 ? originalSourcePrice : fallbackPrice;

  const originalComputedOriginalPrice =
    originalSourceOriginalPrice > originalComputedPrice
      ? originalSourceOriginalPrice
      : buildFallbackOriginalPrice(originalComputedPrice);

  const priceModel = buildPriceModel({
    price: originalComputedPrice,
    originalPrice: originalComputedOriginalPrice,
    fallbackPrice
  });

  return {
    productID,
    id: productID,
    productName,
    name: productName,
    barcode,
    price: priceModel.price,
    originalPrice: priceModel.originalPrice,
    displayPrice: priceModel.displayPrice,
    displayOriginalPrice: priceModel.displayOriginalPrice,
    displayFinalPrice: priceModel.displayFinalPrice,
    hasVisiblePrice: priceModel.hasVisiblePrice,
    hasDiscount: priceModel.hasDiscount,
    discountPercent: priceModel.discountPercent,
    stockQty,
    stock: stockQty,
    categoryName,
    category: categoryName,
    brandName,
    brand: brandName,
    imageUrl,
    primaryImageUrl,
    image: primaryImageUrl,
    barcodeImageUrl: item.barcodeImageUrl ?? null,
    gallery: Array.isArray(item.gallery) && item.gallery.length > 0
      ? item.gallery
      : [primaryImageUrl],
    description: safeText(
      item.description,
      `منتج متاح ضمن الكتالوج المحلي لصيدلية النور تحت قسم ${categoryName}.`
    ),
    averageRating,
    reviewsCount,
    productType: safeText(item.productType, "general"),
    isActive: item.isActive ?? true,
    source: safeText(item.source, "local-manual-seed")
  };
}

function paginateItems(items, page = 1, pageSize = 24) {
  const safePage = Math.max(1, Number(page || 1));
  const safePageSize = Math.min(200, Math.max(1, Number(pageSize || 24)));
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
  const start = (safePage - 1) * safePageSize;

  return {
    page: safePage,
    pageSize: safePageSize,
    totalCount,
    totalPages,
    items: items.slice(start, start + safePageSize)
  };
}

function getNormalizedMockItems() {
  return (mockProducts || []).map(normalizeMockProduct);
}

async function getProductsFromMock({
  page = 1,
  pageSize = 24,
  search = "",
  category = "",
  brand = "",
  offersOnly = false
} = {}) {
  const normalizedItems = getNormalizedMockItems();
  const filtered = filterCatalog(normalizedItems, {
    search,
    category,
    brand,
    offersOnly,
    activeOnly: true
  });

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
  category = "",
  brand = "",
  offersOnly = false
} = {}) {
  return await getProductsFromMock({
    page,
    pageSize,
    search,
    category,
    brand,
    offersOnly
  });
}

export async function getProductById(id) {
  const safeId = String(id || "").trim();
  if (!safeId) return null;

  const items = getNormalizedMockItems();

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

export async function getCatalogMeta() {
  const items = getNormalizedMockItems();

  return {
    categories: extractCategories(items),
    brands: extractBrands(items),
    totalCount: items.length
  };
}

const productService = {
  getProducts,
  getLiveProducts,
  getFeaturedProducts,
  getProductById,
  getProductReviews,
  getCatalogMeta
};

export default productService;