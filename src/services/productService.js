import productsData from "./mockProducts.json";
import { getApiBaseUrl, isBridgeMode } from "../config/runtimeConfig";

const DEFAULT_PAGE_SIZE = 50;

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function pick(...values) {
  return values.find((v) => v !== undefined && v !== null && v !== "");
}

function normalizeProduct(raw = {}, index = 0) {
  const id = pick(raw.productID, raw.ProductId, raw.ProductID, raw.productId, raw.id, raw.ItemNo, raw.itemNo, raw.legacyProductId, raw.CLS_ID, raw.clsId, index);
  const barcode = pick(raw.barcode, raw.Barcode, raw.GTIN, raw.gtin, "");
  const price = toNumber(pick(raw.price, raw.Price, raw.salePrice, raw.SalePrice, raw.UnitPrice, raw.unitPrice, 0));
  const originalPrice = toNumber(pick(raw.originalPrice, raw.OriginalPrice, raw.oldPrice, raw.OldPrice, price), price);

  return {
    ...raw,
    id,
    productID: id,
    productId: id,
    legacyProductId: pick(raw.legacyProductId, raw.LegacyProductId, raw.CLS_ID, raw.clsId, id),
    clsId: pick(raw.clsId, raw.CLS_ID, raw.legacyProductId, raw.LegacyProductId, id),
    barcode,
    productName: pick(raw.productName, raw.ProductName, raw.ItemNameAr, raw.itemNameAr, raw.name, raw.Name, "منتج"),
    name: pick(raw.name, raw.productName, raw.ProductName, raw.ItemNameAr, "منتج"),
    price,
    originalPrice,
    primaryImageUrl: pick(raw.primaryImageUrl, raw.PrimaryImageUrl, raw.imageUrl, raw.ImageUrl, raw.image, "/no-image.svg"),
    imageUrl: pick(raw.imageUrl, raw.ImageUrl, raw.primaryImageUrl, raw.PrimaryImageUrl, raw.image, "/no-image.svg"),
    categoryName: pick(raw.categoryName, raw.CategoryName, raw.category, raw.Category, ""),
    category: pick(raw.category, raw.categoryName, raw.CategoryName, ""),
    brandName: pick(raw.brandName, raw.BrandName, raw.brand, raw.Brand, ""),
    brand: pick(raw.brand, raw.brandName, raw.BrandName, ""),
    stockQty: toNumber(pick(raw.stockQty, raw.StockQty, raw.stock, raw.Stock, 0)),
  };
}

function normalizeOffer(raw = {}) {
  const offerId = pick(raw.offerId, raw.OfferId, raw.OFF_ID, raw.offId);
  const legacyProductId = pick(raw.legacyProductId, raw.LegacyProductId, raw.clsId, raw.CLS_ID, raw.productId, raw.ProductId);
  return {
    ...raw,
    offerId,
    id: offerId,
    legacyProductId,
    clsId: legacyProductId,
    offerNameAr: pick(raw.offerNameAr, raw.OfferNameAr, raw.OFF_ARNAME, "عرض"),
    offerNameEn: pick(raw.offerNameEn, raw.OfferNameEn, raw.OFF_ENNAME, ""),
    offerState: toNumber(pick(raw.offerState, raw.OfferState, raw.OFF_STATE, 0)),
    startDate: pick(raw.startDate, raw.StartDate, raw.OFF_F_DATE, null),
    endDate: pick(raw.endDate, raw.EndDate, raw.OFF_T_DATE, null),
    offerType: toNumber(pick(raw.offerType, raw.OfferType, raw.OFF_TYPE, 0)),
    discountType: toNumber(pick(raw.discountType, raw.DiscountType, raw.OFF_DIS_TYPE, 0)),
    discountValue: toNumber(pick(raw.discountValue, raw.DiscountValue, raw.OFF_VAL, 0)),
    offerQty: toNumber(pick(raw.offerQty, raw.OfferQty, raw.OFF_QTY, 1), 1),
  };
}

async function requestJson(path, options = {}) {
  const url = `${getApiBaseUrl()}${path}`;
  const res = await fetch(url, { headers: { Accept: "application/json", ...(options.headers || {}) }, ...options });
  if (!res.ok) throw new Error(`HTTP ${res.status} while loading ${url}`);
  const data = await res.json();
  if (data?.status === "ERROR") throw new Error(data.error || `API error from ${url}`);
  return data;
}

function toPagedResult(data, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  if (Array.isArray(data)) {
    return { items: data.map(normalizeProduct), page, pageSize, total: data.length, hasMore: data.length >= pageSize };
  }
  const rawItems = data?.items || data?.data || data?.products || [];
  const items = Array.isArray(rawItems) ? rawItems.map(normalizeProduct) : [];
  return { ...data, items, page: data?.page ?? page, pageSize: data?.pageSize ?? pageSize, total: data?.total ?? data?.totalCount ?? items.length, hasMore: data?.hasMore ?? items.length >= pageSize };
}

function applyOffersToProducts(products, offers) {
  if (!Array.isArray(products) || !Array.isArray(offers) || !offers.length) return products;
  const offerByProduct = new Map();
  offers.map(normalizeOffer).forEach((offer) => {
    const key = String(offer.legacyProductId ?? "");
    if (key && !offerByProduct.has(key)) offerByProduct.set(key, offer);
  });

  return products.map((product) => {
    const keys = [product.legacyProductId, product.clsId, product.productID, product.productId, product.id].filter(Boolean).map(String);
    const offer = keys.map((k) => offerByProduct.get(k)).find(Boolean);
    if (!offer) return product;

    const originalPrice = toNumber(product.originalPrice || product.price);
    let finalPrice = originalPrice;
    if (offer.discountType === 1 && offer.discountValue > 0) finalPrice = Math.max(0, originalPrice - offer.discountValue);
    else if (offer.discountType === 2 && offer.discountValue > 0) finalPrice = Math.max(0, originalPrice * (1 - offer.discountValue / 100));

    return { ...product, hasOffer: true, offer, offerId: offer.offerId, offerName: offer.offerNameAr || "عرض", originalPrice, price: finalPrice };
  });
}

async function getBridgeProducts(params = {}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const search = params.search || params.q || "";
  const query = new URLSearchParams({ page, pageSize });
  if (search) query.set("search", search);
  const data = await requestJson(`/api/products?${query.toString()}`);
  const paged = toPagedResult(data, page, pageSize);
  try {
    paged.items = applyOffersToProducts(paged.items, await getActiveOffers());
  } catch (error) {
    console.warn("Offers merge skipped:", error);
  }
  return paged;
}

async function getLocalProducts(params = {}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const search = (params.search || params.q || "").toString().trim().toLowerCase();
  let items = productsData.map(normalizeProduct);
  if (search) {
    items = items.filter((p) => [p.productName, p.name, p.barcode, p.brandName, p.categoryName].filter(Boolean).some((v) => String(v).toLowerCase().includes(search)));
  }
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, pageSize, total: items.length, hasMore: start + pageSize < items.length };
}

export async function getProducts(params = {}) {
  return isBridgeMode() ? getBridgeProducts(params) : getLocalProducts(params);
}

export async function searchProducts(query, params = {}) {
  return getProducts({ ...params, page: 1, search: query });
}

export async function getFeaturedProducts(limit = 12) {
  const res = await getProducts({ page: 1, pageSize: limit });
  return res.items || [];
}

export async function getProductById(id) {
  const value = String(id);
  if (isBridgeMode()) {
    try {
      return normalizeProduct(await requestJson(`/api/products/${encodeURIComponent(value)}`));
    } catch {
      const res = await getProducts({ page: 1, pageSize: 200, search: value });
      return (res.items || []).find((p) => [p.id, p.productID, p.productId, p.barcode].some((x) => String(x) === value)) || null;
    }
  }
  const res = await getLocalProducts({ page: 1, pageSize: productsData.length || 10000 });
  return (res.items || []).find((p) => [p.id, p.productID, p.productId, p.barcode].some((x) => String(x) === value)) || null;
}

export async function getOffers() {
  if (!isBridgeMode()) return [];
  const data = await requestJson("/api/offers");
  return Array.isArray(data) ? data.map(normalizeOffer) : [];
}

export async function getActiveOffers() {
  if (!isBridgeMode()) return [];
  const data = await requestJson("/api/offers/active");
  return Array.isArray(data) ? data.map(normalizeOffer) : [];
}

export async function getOfferProducts(params = {}) {
  const res = await getProducts(params);
  return { ...res, items: (res.items || []).filter((p) => p.hasOffer) };
}

const productService = { getProducts, searchProducts, getFeaturedProducts, getProductById, getOffers, getActiveOffers, getOfferProducts };
export default productService;
