import localProducts from "./mockProducts.json";
import { buildPriceModel } from "./pricingService";

function resolveAssetUrl(rawPath) {
  if (!rawPath) return "/no-image.svg";

  const value = String(rawPath).trim();

  if (!value) return "/no-image.svg";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;

  if (value.startsWith("/src/assets/")) {
    try {
      const relativePath = value.replace("/src/assets/", "../assets/");
      return new URL(relativePath, import.meta.url).href;
    } catch {
      return "/no-image.svg";
    }
  }

  if (value.startsWith("/assets/") || value.startsWith("/")) {
    return value;
  }

  return value;
}

function normalize(item, index = 0) {
  const priceModel = buildPriceModel({
    price: item.price,
    originalPrice: item.originalPrice
  });

  const imageUrl = resolveAssetUrl(item.imageUrl);
  const primaryImageUrl = resolveAssetUrl(item.primaryImageUrl || item.imageUrl);
  const barcodeImageUrl = item.barcodeImageUrl
    ? resolveAssetUrl(item.barcodeImageUrl)
    : null;

  return {
    productID: String(item.productID ?? item.barcode ?? index + 1),
    id: String(item.productID ?? item.barcode ?? index + 1),

    productName: item.productName ?? item.name ?? "منتج",
    name: item.productName ?? item.name ?? "منتج",

    barcode: item.barcode ? String(item.barcode) : "",

    brandName: item.brandName ?? item.brand ?? "Generic",
    brand: item.brandName ?? item.brand ?? "Generic",

    categoryName: item.categoryName ?? item.productType ?? "General",
    category: item.categoryName ?? item.productType ?? "General",

    price: priceModel.price,
    originalPrice: priceModel.originalPrice,
    displayPrice: priceModel.displayPrice,
    displayOriginalPrice: priceModel.displayOriginalPrice,
    hasDiscount: priceModel.hasDiscount,
    discountPercent: priceModel.discountPercent,

    stockQty: Number(item.stockQty ?? item.stock ?? 0),
    stock: Number(item.stockQty ?? item.stock ?? 0),

    imageUrl,
    primaryImageUrl,
    image: primaryImageUrl,

    barcodeImageUrl,
    gallery: Array.isArray(item.gallery)
      ? item.gallery.map(resolveAssetUrl).filter(Boolean)
      : [],

    description: item.description || "",
    averageRating: Number(item.averageRating ?? 0),
    reviewsCount: Number(item.reviewsCount ?? 0),

    productType: item.productType || "general",
    isActive: item.isActive !== false,

    source: item.source || "local-json"
  };
}

function filterLocal(items, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return items;

  return items.filter((p) =>
    String(p.productName || "").toLowerCase().includes(q) ||
    String(p.barcode || "").toLowerCase().includes(q) ||
    String(p.brandName || "").toLowerCase().includes(q) ||
    String(p.categoryName || "").toLowerCase().includes(q)
  );
}

export async function getProducts({ page = 1, pageSize = 24 } = {}) {
  await new Promise((r) => setTimeout(r, 150));

  const items = (localProducts || []).map(normalize);
  const safePage = Math.max(1, Number(page || 1));
  const safePageSize = Math.max(1, Number(pageSize || 24));

  const start = (safePage - 1) * safePageSize;
  const pagedItems = items.slice(start, start + safePageSize);

  return {
    items: pagedItems,
    totalCount: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / safePageSize))
  };
}

export async function searchProducts(query) {
  const q = String(query || "").trim();

  if (!q || q.length < 2) {
    return getProducts({ page: 1, pageSize: 100 });
  }

  const items = filterLocal(localProducts || [], q).map(normalize);

  return {
    items,
    totalCount: items.length,
    totalPages: 1
  };
}

export async function getFeaturedProducts({ pageSize = 6 } = {}) {
  const res = await getProducts({ page: 1, pageSize: 100 });

  return {
    ...res,
    items: (res.items || []).slice(0, pageSize)
  };
}

export async function getProductById(id) {
  const safeId = String(id || "").trim();
  const items = (localProducts || []).map(normalize);

  return (
    items.find(
      (item) =>
        String(item.productID) === safeId ||
        String(item.barcode) === safeId
    ) || null
  );
}

export async function getProductReviews() {
  return [];
}

export default {
  getProducts,
  searchProducts,
  getFeaturedProducts,
  getProductById,
  getProductReviews
};

