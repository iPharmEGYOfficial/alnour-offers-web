const SYMBOL = "⃁";

export function formatCurrency(value) {
  const num = Number(value || 0);
  if (!num) return "السعر عند الطلب";
  return `${num} ${SYMBOL}`;
}

export default formatCurrency;