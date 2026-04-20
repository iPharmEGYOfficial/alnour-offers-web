export const adminOrderStatuses = [
  { code: "Pending", label: "قيد المراجعة" },
  { code: "Confirmed", label: "تم التأكيد" },
  { code: "Preparing", label: "جارٍ التجهيز" },
  { code: "Ready", label: "جاهز" },
  { code: "OutForDelivery", label: "خرج للتوصيل" },
  { code: "Delivered", label: "تم التسليم" },
  { code: "Cancelled", label: "ملغي" }
];

export function getStatusLabel(code) {
  return adminOrderStatuses.find((x) => x.code === code)?.label || code || "حالة غير معروفة";
}
