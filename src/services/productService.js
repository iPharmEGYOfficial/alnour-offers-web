import productsSA from "./ProductsSA.json";
import productsEG from "./ProductsEG.json";
import {
  getApiBaseUrl,
  isBridgeMode,
  isHybridMode,
  shouldUseBridgeProducts,
  shouldUseLocalProducts,
} from "../config/runtimeConfig";

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_MARKET = "SA";
const STORAGE_KEY = "alnour_local_products_by_market";

const MARKET_SOURCES = {
  SA: productsSA,
  EG: productsEG,
};

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function pick(...values) {
  return values.find((v) => v !== undefined && v !== null && v !== "");
}

function readStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function writeStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data || {}));
}

function getRawLocalProducts(market = DEFAULT_MARKET) {
  const storage = readStorage();
  return storage[market] || MARKET_SOURCES[market] || [];
}

function saveRawLocalProducts(market, products) {
  const storage = readStorage();
  storage[market] = products || [];
  writeStorage(storage);
}

function normalizeCategory(cat = "") {
  const map = {
    "Personal Care": "العناية الشخصية",
    "Hair Care": "العناية بالشعر",
    Thermometers: "أجهزة قياس ومتابعة",
    "Blood Pressure Monitors": "أجهزة قياس ومتابعة",
    "First Aid": "إسعافات أولية",
    "Mother & Baby": "الأم والطفل",
    "Massage Devices": "العلاج الطبيعي والتدليك",
    Hijama: "مستلزمات الحجامة",
  };

  return map[cat] || cat || "مستلزمات طبية";
}

function normalizeProduct(
  raw = {},
  index = 0,
  forcedSource = "local",
  market = DEFAULT_MARKET,
) {
  const source = pick(forcedSource, raw.source, raw.Source, "local");

  const rawId = String(
    pick(
      raw.rawId,
      raw.productID,
      raw.ProductId,
      raw.ProductID,
      raw.productId,
      raw.id,
      raw.ItemNo,
      raw.itemNo,
      raw.legacyProductId,
      raw.CLS_ID,
      raw.clsId,
      `${market}-${index + 1}`,
    ),
  );

  const productName = pick(
    raw.productName,
    raw.ProductName,
    raw.ItemNameAr,
    raw.itemNameAr,
    raw.name,
    raw.Name,
    "منتج",
  );

  const price = toNumber(
    pick(
      raw.price,
      raw.Price,
      raw.salePrice,
      raw.SalePrice,
      raw.UnitPrice,
      raw.unitPrice,
      0,
    ),
  );

  const originalPrice = toNumber(
    pick(
      raw.originalPrice,
      raw.OriginalPrice,
      raw.oldPrice,
      raw.OldPrice,
      price,
    ),
    price,
  );

  const imageUrl = pick(
    raw.imageUrl,
    raw.ImageUrl,
    raw.primaryImageUrl,
    raw.PrimaryImageUrl,
    raw.image,
    "/no-image.svg",
  );

  const stockQty = toNumber(
    pick(raw.stockQty, raw.StockQty, raw.stock, raw.Stock, 0),
  );

  const cleanSource = source === "live" ? "live" : `local-${market}`;

  return {
    ...raw,
    source,
    market,

    id: raw.id || `${cleanSource}-${rawId}`,
    productID: raw.productID || `${cleanSource}-${rawId}`,
    productId: raw.productId || `${cleanSource}-${rawId}`,
    rawId,

    legacyProductId: pick(
      raw.legacyProductId,
      raw.LegacyProductId,
      raw.CLS_ID,
      raw.clsId,
      rawId,
    ),
    clsId: pick(
      raw.clsId,
      raw.CLS_ID,
      raw.legacyProductId,
      raw.LegacyProductId,
      rawId,
    ),

    barcode: pick(raw.barcode, raw.Barcode, raw.GTIN, raw.gtin, ""),
    productName,
    name: pick(raw.name, productName, "منتج"),

    price,
    originalPrice,

    primaryImageUrl: pick(raw.primaryImageUrl, raw.PrimaryImageUrl, imageUrl),
    imageUrl,

    categoryName: normalizeCategory(
      pick(raw.categoryName, raw.CategoryName, raw.category, raw.Category, ""),
    ),
    category: normalizeCategory(
      pick(raw.category, raw.categoryName, raw.CategoryName, raw.Category, ""),
    ),

    brandName: pick(raw.brandName, raw.BrandName, raw.brand, raw.Brand, ""),
    brand: pick(raw.brand, raw.brandName, raw.BrandName, ""),

    stockQty,
    availability: stockQty >= 1 ? "available" : "unavailable",
    isActive: raw.isActive ?? true,
  };
}

function normalizeOffer(raw = {}) {
  const offerId = pick(raw.offerId, raw.OfferId, raw.OFF_ID, raw.offId);

  const legacyProductId = pick(
    raw.legacyProductId,
    raw.LegacyProductId,
    raw.clsId,
    raw.CLS_ID,
    raw.productId,
    raw.ProductId,
  );

  return {
    ...raw,
    offerId,
    id: offerId,
    legacyProductId,
    clsId: legacyProductId,
    offerNameAr: pick(raw.offerNameAr, raw.OfferNameAr, raw.OFF_ARNAME, "عرض"),
    offerNameEn: pick(raw.offerNameEn, raw.OfferNameEn, raw.OFF_ENNAME, ""),
    offerState: toNumber(
      pick(raw.offerState, raw.OfferState, raw.OFF_STATE, 0),
    ),
    startDate: pick(raw.startDate, raw.StartDate, raw.OFF_F_DATE, null),
    endDate: pick(raw.endDate, raw.StartDate, raw.OFF_T_DATE, null),
    offerType: toNumber(pick(raw.offerType, raw.OfferType, raw.OFF_TYPE, 0)),
    discountType: toNumber(
      pick(raw.discountType, raw.DiscountType, raw.OFF_DIS_TYPE, 0),
    ),
    discountValue: toNumber(
      pick(raw.discountValue, raw.DiscountValue, raw.OFF_VAL, 0),
    ),
    offerQty: toNumber(pick(raw.offerQty, raw.OfferQty, raw.OFF_QTY, 1), 1),
  };
}

async function requestJson(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("API base URL is empty.");

  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} while loading ${url}`);

  const data = await res.json();
  if (data?.status === "ERROR")
    throw new Error(data.error || `API error from ${url}`);

  return data;
}

function toPagedResult(
  data,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  source = "live",
) {
  if (Array.isArray(data)) {
    return {
      items: data.map((x, i) => normalizeProduct(x, i, source, "LIVE")),
      page,
      pageSize,
      total: data.length,
      hasMore: data.length >= pageSize,
      source,
    };
  }

  const rawItems = data?.items || data?.data || data?.products || [];
  const items = Array.isArray(rawItems)
    ? rawItems.map((x, i) => normalizeProduct(x, i, source, "LIVE"))
    : [];

  return {
    ...data,
    items,
    page: data?.page ?? page,
    pageSize: data?.pageSize ?? pageSize,
    total: data?.total ?? data?.totalCount ?? items.length,
    hasMore: data?.hasMore ?? items.length >= pageSize,
    source,
  };
}

function applyOffersToProducts(products, offers) {
  if (!Array.isArray(products) || !Array.isArray(offers) || !offers.length)
    return products;

  const offerByProduct = new Map();

  offers.map(normalizeOffer).forEach((offer) => {
    const key = String(offer.legacyProductId ?? "");
    if (key && !offerByProduct.has(key)) offerByProduct.set(key, offer);
  });

  return products.map((product) => {
    const keys = [
      product.legacyProductId,
      product.clsId,
      product.rawId,
      product.productID,
      product.productId,
      product.id,
    ]
      .filter(Boolean)
      .map(String);

    const offer = keys.map((k) => offerByProduct.get(k)).find(Boolean);
    if (!offer) return product;

    const originalPrice = toNumber(product.originalPrice || product.price);
    let finalPrice = originalPrice;

    if (offer.discountType === 1 && offer.discountValue > 0) {
      finalPrice = Math.max(0, originalPrice - offer.discountValue);
    } else if (offer.discountType === 2 && offer.discountValue > 0) {
      finalPrice = Math.max(0, originalPrice * (1 - offer.discountValue / 100));
    }

    return {
      ...product,
      hasOffer: true,
      offer,
      offerId: offer.offerId,
      offerName: offer.offerNameAr || "عرض",
      originalPrice,
      price: finalPrice,
    };
  });
}

async function getBridgeProducts(params = {}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const search = params.search || params.q || "";

  const query = new URLSearchParams({ page, pageSize });
  if (search) query.set("search", search);

  const data = await requestJson(`/api/products?${query.toString()}`);
  const paged = toPagedResult(data, page, pageSize, "live");

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
  const market = params.market || params.country || "ALL";

  const search = (params.search || params.q || "")
    .toString()
    .trim()
    .toLowerCase();

  const markets = market === "ALL" ? ["SA", "EG"] : [market];

  let items = markets.flatMap((m) =>
    getRawLocalProducts(m).map((x, i) => normalizeProduct(x, i, "local", m)),
  );

  if (search) {
    items = items.filter((p) =>
      [
        p.productName,
        p.name,
        p.barcode,
        p.brandName,
        p.categoryName,
        p.productID,
        p.rawId,
        p.market,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(search)),
    );
  }

  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
    hasMore: start + pageSize < items.length,
    source: "local",
    market,
  };
}

function mergePagedResults(localResult, bridgeResult, params = {}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  const localItems = localResult?.items || [];
  const bridgeItems = bridgeResult?.items || [];

  const map = new Map();

  [...localItems, ...bridgeItems].forEach((item) => {
    const key = `${item.source}-${item.market || "LIVE"}-${item.rawId || item.id || item.productID}`;
    if (!map.has(key)) map.set(key, item);
  });

  const allItems = Array.from(map.values());

  return {
    items: allItems,
    page,
    pageSize,
    total:
      (localResult?.total || localItems.length) +
      (bridgeResult?.total || bridgeItems.length),
    hasMore: Boolean(localResult?.hasMore || bridgeResult?.hasMore),
    source: "hybrid",
    sources: {
      local: {
        total: localResult?.total || localItems.length,
        ok: Boolean(localResult),
      },
      live: {
        total: bridgeResult?.total || bridgeItems.length,
        ok: Boolean(bridgeResult),
      },
    },
  };
}

async function getHybridProducts(params = {}) {
  const results = await Promise.allSettled([
    getLocalProducts(params),
    getBridgeProducts(params),
  ]);

  const localResult =
    results[0].status === "fulfilled" ? results[0].value : null;
  const bridgeResult =
    results[1].status === "fulfilled" ? results[1].value : null;

  if (results[0].status === "rejected")
    console.warn("Local products failed:", results[0].reason);
  if (results[1].status === "rejected")
    console.warn("Live products failed:", results[1].reason);

  if (!localResult && !bridgeResult) {
    throw new Error("تعذر تحميل المنتجات من المصدر المحلي واللايف");
  }

  return mergePagedResults(localResult, bridgeResult, params);
}

export async function getProducts(params = {}) {
  if (isHybridMode()) return getHybridProducts(params);

  if (isBridgeMode() || shouldUseBridgeProducts())
    return getBridgeProducts(params);

  if (shouldUseLocalProducts()) return getLocalProducts(params);

  return getLocalProducts(params);
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

  const res = await getProducts({
    page: 1,
    pageSize: 1000,
    search: value,
  });

  return (
    (res.items || []).find((p) =>
      [p.id, p.productID, p.productId, p.rawId, p.barcode].some(
        (x) => String(x) === value,
      ),
    ) || null
  );
}

export async function getOffers() {
  if (!shouldUseBridgeProducts()) return [];
  const data = await requestJson("/api/offers");
  return Array.isArray(data) ? data.map(normalizeOffer) : [];
}

export async function getActiveOffers() {
  if (!shouldUseBridgeProducts()) return [];
  const data = await requestJson("/api/offers/active");
  return Array.isArray(data) ? data.map(normalizeOffer) : [];
}

export async function getOfferProducts(params = {}) {
  const res = await getProducts(params);
  return { ...res, items: (res.items || []).filter((p) => p.hasOffer) };
}

export function getLocalAdminProducts(market = DEFAULT_MARKET) {
  return getRawLocalProducts(market).map((x, i) =>
    normalizeProduct(x, i, "local", market),
  );
}

export function saveLocalAdminProducts(products, market = DEFAULT_MARKET) {
  saveRawLocalProducts(market, products);
  return getLocalAdminProducts(market);
}

export function upsertLocalAdminProduct(product, market = DEFAULT_MARKET) {
  const current = getRawLocalProducts(market);
  const rawId = String(product.rawId || product.id || Date.now());

  const index = current.findIndex((p) =>
    [p.id, p.productID, p.productId, p.rawId, p.barcode, p.legacyProductId]
      .filter(Boolean)
      .some((x) => String(x) === rawId),
  );

  const saved = {
    ...product,
    rawId,
    id: rawId,
    productID: rawId,
    productId: rawId,
    market,
    source: "local",
  };

  const next =
    index >= 0
      ? current.map((p, i) => (i === index ? { ...p, ...saved } : p))
      : [saved, ...current];

  saveRawLocalProducts(market, next);
  return normalizeProduct(saved, 0, "local", market);
}

export function deleteLocalAdminProduct(id, market = DEFAULT_MARKET) {
  const value = String(id);

  const next = getRawLocalProducts(market).filter((p) => {
    const normalized = normalizeProduct(p, 0, "local", market);

    return ![
      normalized.id,
      normalized.productID,
      normalized.productId,
      normalized.rawId,
      normalized.barcode,
    ].some((x) => String(x) === value);
  });

  saveRawLocalProducts(market, next);
  return getLocalAdminProducts(market);
}

const productService = {
  getProducts,
  searchProducts,
  getFeaturedProducts,
  getProductById,
  getOffers,
  getActiveOffers,
  getOfferProducts,

  getLocalAdminProducts,
  saveLocalAdminProducts,
  upsertLocalAdminProduct,
  deleteLocalAdminProduct,
};

export default productService;
