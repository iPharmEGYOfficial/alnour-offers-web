export const paymentCatalog = {
  SaudiArabia: [
    {
      code: "CashOnDelivery",
      label: "الدفع عند الاستلام",
      type: "offline",
      country: "SaudiArabia"
    },
    {
      code: "CardGateway",
      label: "بطاقة (مدى / فيزا / ماستر)",
      type: "gateway",
      provider: "GenericCardGateway",
      country: "SaudiArabia"
    },
    {
      code: "Tamara",
      label: "تمارا",
      type: "bnpl",
      provider: "Tamara",
      country: "SaudiArabia"
    }
  ],
  Egypt: [
    {
      code: "CashOnDelivery",
      label: "الدفع عند الاستلام",
      type: "offline",
      country: "Egypt"
    },
    {
      code: "CardGateway",
      label: "بطاقة بنكية",
      type: "gateway",
      provider: "EgyptCardGateway",
      country: "Egypt"
    },
    {
      code: "Fawry",
      label: "فوري",
      type: "cash_network",
      provider: "Fawry",
      country: "Egypt"
    },
    {
      code: "InstaPayManual",
      label: "إنستا باي (تحويل يدوي)",
      type: "manual_transfer",
      provider: "InstaPay",
      country: "Egypt"
    }
  ]
};

export function getPaymentMethodsByCountry(country = "SaudiArabia") {
  return paymentCatalog[country] || paymentCatalog.SaudiArabia;
}