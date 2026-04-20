import localProducts from "../data/products.json"; // 🔥 ده ملفك الجديد
import { buildPriceModel } from "./pricingService";

function normalize(item, index = 0) {
  const priceModel = buildPriceModel({
    price: item.price,
    originalPrice: item.originalPrice,
  });

  return {
    productID: String(item.productID ?? item.barcode ?? index + 1),
    id: String(item.productID ?? item.barcode ?? index + 1),

    productName: item.productName ?? item.name ?? "منتج",
    name: item.productName ?? item.name ?? "منتج",

    barcode: String(item.barcode ?? ""),

    brandName: item.brandName ?? item.brand ?? "Generic",
    brand: item.brandName ?? item.brand ?? "Generic",

    categoryName: item.categoryName ?? item.productType ?? "General",
    category: item.categoryName ?? item.productType ?? "General",

    // 💰 السعر (من JSON)
    price: priceModel.price,
    originalPrice: priceModel.originalPrice,
    displayPrice: priceModel.displayPrice,
    displayOriginalPrice: priceModel.displayOriginalPrice,
    hasDiscount: priceModel.hasDiscount,
    discountPercent: priceModel.discountPercent,

    stockQty: Number(item.stockQty ?? item.stock ?? 0),
    stock: Number(item.stockQty ?? item.stock ?? 0),

    // 🖼️ صور (fix مهم)
    imageUrl:
      (item.imageUrl || "").replace("/src", "") || "/assets/no-image.png",
    primaryImageUrl:
      (item.primaryImageUrl || item.imageUrl || "").replace("/src", "") ||
      "/assets/no-image.png",
    image:
      (item.primaryImageUrl || item.imageUrl || "").replace("/src", "") ||
      "/assets/no-image.png",

    barcodeImageUrl: item.barcodeImageUrl || null,
    gallery: Array.isArray(item.gallery)
      ? item.gallery.map((g) => g.replace("/src", ""))
      : [],

    description: item.description || "",
    averageRating: Number(item.averageRating ?? 0),
    reviewsCount: Number(item.reviewsCount ?? 0),

    productType: item.productType || "general",
    isActive: item.isActive !== false,

    source: "local-json", // 🔥 مهم
  };
}

function filterLocal(items, query) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return items;

  return items.filter(
    (p) =>
      String(p.productName || "")
        .toLowerCase()
        .includes(q) ||
      String(p.barcode || "")
        .toLowerCase()
        .includes(q) ||
      String(p.brandName || "")
        .toLowerCase()
        .includes(q) ||
      String(p.categoryName || "")
        .toLowerCase()
        .includes(q),
  );
}

// 🔥 الأساسي
export async function getProducts({ pageSize = 24 } = {}) {
  await new Promise((r) => setTimeout(r, 300)); // loading وهمي

  const items = (localProducts || []).map(normalize);

  return {
    items: items.slice(0, pageSize),
    totalCount: items.length,
    totalPages: 1,
  };
}

// 🔍 البحث
export async function searchProducts(query) {
  const q = String(query || "").trim();

  if (!q || q.length < 2) {
    return getProducts();
  }

  const items = filterLocal(localProducts || [], q).map(normalize);

  return {
    items,
    totalCount: items.length,
    totalPages: 1,
  };
}

// ⭐ Featured
export async function getFeaturedProducts({ pageSize = 6 } = {}) {
  const res = await getProducts();
  return {
    ...res,
    items: (res.items || []).slice(0, pageSize),
  };
}

// 📦 منتج واحد
export async function getProductById(id) {
  const safeId = String(id || "").trim();
  const items = (localProducts || []).map(normalize);

  return (
    items.find(
      (item) =>
        String(item.productID) === safeId || String(item.barcode) === safeId,
    ) || null
  );
}

// ⭐ مراجعات (مؤقت)
export async function getProductReviews() {
  return [];
}

export default {
  getProducts,
  searchProducts,
  getFeaturedProducts,
  getProductById,
  getProductReviews,
};
