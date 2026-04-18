import { fetchProductsFromBridge, searchProductsInBridge } from "./bridgeService";
import { buildPriceModel } from "./pricingService";

function normalize(item) {
  const priceModel = buildPriceModel({
    price: item.price,
    originalPrice: item.originalPrice
  });

  return {
    productID: item.barcode,
    productName: item.name,
    barcode: item.barcode,
    brandName: item.brand || "Generic",
    categoryName: item.productType || "General",

    price: priceModel.price,
    originalPrice: priceModel.originalPrice,
    displayPrice: priceModel.displayPrice,
    displayOriginalPrice: priceModel.displayOriginalPrice,

    stockQty: item.stock || 0,
    imageUrl: "/no-image.svg",
    primaryImageUrl: "/no-image.svg"
  };
}

export async function getProducts() {
  const data = await fetchProductsFromBridge();

  return {
    items: data.map(normalize),
    totalCount: data.length,
    totalPages: 1
  };
}

export async function searchProducts(query) {
  if (!query || query.trim().length < 2) {
    return getProducts();
  }

  const data = await searchProductsInBridge(query);

  return {
    items: data.map(normalize),
    totalCount: data.length,
    totalPages: 1
  };
}

export default {
  getProducts,
  searchProducts
};