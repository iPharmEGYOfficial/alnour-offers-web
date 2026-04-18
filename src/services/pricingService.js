const SAR_SYMBOL = "⃁";

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function roundPrice(value) {
  return Math.round(toNumber(value, 0));
}

function formatSar(value) {
  const amount = roundPrice(value);
  if (amount <= 0) return `غير متوفر`;
  return `${amount} ${SAR_SYMBOL}`;
}

function calculateDiscountPercent(originalPrice, finalPrice) {
  const original = toNumber(originalPrice, 0);
  const finalValue = toNumber(finalPrice, 0);

  if (original <= 0 || finalValue <= 0 || finalValue >= original) {
    return 0;
  }

  return Math.round(((original - finalValue) / original) * 100);
}

function buildPriceModel({
  price = 0,
  originalPrice = 0,
  fallbackPrice = 0
} = {}) {
  const rawPrice = toNumber(price, 0);
  const rawOriginal = toNumber(originalPrice, 0);
  const fallback = toNumber(fallbackPrice, 0);

  const finalPrice = rawPrice > 0 ? rawPrice : fallback;
  const computedOriginal =
    rawOriginal > finalPrice
      ? rawOriginal
      : finalPrice > 0
        ? finalPrice
        : 0;

  const hasVisiblePrice = finalPrice > 0;
  const hasDiscount = computedOriginal > finalPrice && finalPrice > 0;
  const discountPercent = calculateDiscountPercent(computedOriginal, finalPrice);

  return {
    price: roundPrice(finalPrice),
    originalPrice: roundPrice(computedOriginal),
    hasVisiblePrice,
    hasDiscount,
    discountPercent,
    displayPrice: hasVisiblePrice ? formatSar(finalPrice) : "السعر عند الطلب",
    displayOriginalPrice:
      hasDiscount ? formatSar(computedOriginal) : "",
    displayFinalPrice:
      hasVisiblePrice ? formatSar(finalPrice) : "السعر عند الطلب"
  };
}

export {
  SAR_SYMBOL,
  toNumber,
  roundPrice,
  formatSar,
  calculateDiscountPercent,
  buildPriceModel
};

export default {
  SAR_SYMBOL,
  toNumber,
  roundPrice,
  formatSar,
  calculateDiscountPercent,
  buildPriceModel
};