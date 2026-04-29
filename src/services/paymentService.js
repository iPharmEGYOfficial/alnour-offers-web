import paymentMethods from "../data/paymentMethods.json";

export const countries = [
  { code: "SA", name: "السعودية", currency: "SAR" },
  { code: "EG", name: "مصر", currency: "EGP" },
];

export function normalizeCountry(country = "SA") {
  const value = String(country || "").toUpperCase();

  if (["EG", "EGYPT", "مصر"].includes(value)) return "EG";
  if (["SA", "KSA", "SAUDI", "SAUDI ARABIA", "السعودية"].includes(value)) return "SA";

  return "SA";
}

export function getPaymentMethods(country = "SA") {
  const code = normalizeCountry(country);
  return paymentMethods[code] || paymentMethods.SA || [];
}

export function getPaymentMethod(country, methodId) {
  return getPaymentMethods(country).find((method) => method.id === methodId) || null;
}

export function buildPaymentInfo({ country, methodId, cardForm = {} }) {
  const method = getPaymentMethod(country, methodId);

  if (!method) {
    return {
      methodId: "cash",
      label: "الدفع عند الاستلام",
      status: "pending",
      provider: "COD",
    };
  }

  const info = {
    methodId: method.id,
    label: method.label,
    type: method.type,
    status: method.type === "offline" ? "cash_on_delivery" : "authorized_mock",
    provider: method.label,
  };

  if (method.type === "card") {
    const cleanNumber = String(cardForm.cardNumber || "").replace(/\D/g, "");
    info.cardLast4 = cleanNumber ? cleanNumber.slice(-4) : "";
  }

  if (method.type === "wallet" || method.type === "bnpl" || method.type === "cash_network") {
    info.referenceNo = `PAY-${Date.now()}`;
  }

  return info;
}

export default {
  countries,
  normalizeCountry,
  getPaymentMethods,
  getPaymentMethod,
  buildPaymentInfo,
};
