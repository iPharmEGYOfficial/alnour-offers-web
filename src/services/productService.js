import mockProducts from "./mockProducts.json";
import { fetchProductsFromBridge, searchProductsInBridge } from "./bridgeService";
import { buildPriceModel } from "./pricingService";

function normalize(item, index = 0) {
  const priceModel = buildPriceModel({
    price: item.price,
    originalPrice: item.originalPrice
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

    price: priceModel.price,
    originalPrice: priceModel.originalPrice,
    displayPrice: priceModel.displayPrice,
    displayOriginalPrice: priceModel.displayOriginalPrice,
    hasDiscount: priceModel.hasDiscount,
    discountPercent: priceModel.discountPercent,

    stockQty: Number(item.stockQty ?? item.stock ?? 0),
    stock: Number(item.stockQty ?? item.stock ?? 0),

    imageUrl: item.imageUrl || "/no-image.svg",
    primaryImageUrl: item.primaryImageUrl || item.imageUrl || "/no-image.svg",
    image: item.primaryImageUrl || item.imageUrl || "/no-image.svg",

    barcodeImageUrl: item.barcodeImageUrl || null,
    gallery: Array.isArray(item.gallery) ? item.gallery : [],
    description: item.description || "",
    averageRating: Number(item.averageRating ?? 0),
    reviewsCount: Number(item.reviewsCount ?? 0),
    productType: item.productType || "general",
    isActive: item.isActive !== false,
    source: item.source || "bridge-or-mock"
  };
}

function filterMock(items, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return items;

  return items.filter((p) =>
    String(p.productName || "").toLowerCase().includes(q) ||
    String(p.barcode || "").toLowerCase().includes(q) ||
    String(p.brandName || "").toLowerCase().includes(q) ||
    String(p.categoryName || "").toLowerCase().includes(q)
  );
}

async function getBridgeProductsSafe() {
  try {
    const data = await fetchProductsFromBridge();
    if (Array.isArray(data) && data.length > 0) {
      return data.map(normalize);
    }
    return null;
  } catch {
    return null;
  }
}

export async function getProducts() {
  const bridgeItems = await getBridgeProductsSafe();

  if (bridgeItems && bridgeItems.length > 0) {
    return {
      items: bridgeItems,
      totalCount: bridgeItems.length,
      totalPages: 1
    };
  }

  const mockItems = (mockProducts || []).map(normalize);
  return {
    items: mockItems,
    totalCount: mockItems.length,
    totalPages: 1
  };
}

export async function searchProducts(query) {
  const q = String(query || "").trim();

  if (!q || q.length < 2) {
    return getProducts();
  }

  try {
    const data = await searchProductsInBridge(q);
    if (Array.isArray(data) && data.length > 0) {
      const items = data.map(normalize);
      return {
        items,
        totalCount: items.length,
        totalPages: 1
      };
    }
  } catch {
    // fallback continues below
  }

  const filtered = filterMock(mockProducts || [], q).map(normalize);
  return {
    items: filtered,
    totalCount: filtered.length,
    totalPages: 1
  };
}

export async function getFeaturedProducts({ pageSize = 6 } = {}) {
  const res = await getProducts();
  return {
    ...res,
    items: (res.items || []).slice(0, pageSize)
  };
}

export async function getProductById(id) {
  const safeId = String(id || "").trim();
  const res = await getProducts();

  return (res.items || []).find(
    (item) =>
      String(item.productID) === safeId ||
      String(item.barcode) === safeId
  ) || null;
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
