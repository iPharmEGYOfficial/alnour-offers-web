const SYMBOL = "⃁";

export function formatCurrency(value) {
  const num = Number(value);

  if (!Number.isFinite(num) || num <= 0) {
    return "السعر عند الطلب";
  }

  const formatted = Number.isInteger(num)
    ? String(num)
    : num.toFixed(2).replace(/\.00$/, "");

  return `${formatted} ${SYMBOL}`;
}

export default formatCurrency;

