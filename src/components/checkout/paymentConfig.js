export const paymentCatalog = {
  SaudiArabia: [
    {
      code: "CashOnDelivery",
      label: "????? ??? ????????",
      type: "offline",
      country: "SaudiArabia"
    },
    {
      code: "CardGateway",
      label: "?????? (??? / ???? / ?????)",
      type: "gateway",
      provider: "GenericCardGateway",
      country: "SaudiArabia"
    },
    {
      code: "Tamara",
      label: "?????",
      type: "bnpl",
      provider: "Tamara",
      country: "SaudiArabia"
    }
  ],
  Egypt: [
    {
      code: "CashOnDelivery",
      label: "????? ??? ????????",
      type: "offline",
      country: "Egypt"
    },
    {
      code: "CardGateway",
      label: "?????? ?????",
      type: "gateway",
      provider: "EgyptCardGateway",
      country: "Egypt"
    },
    {
      code: "Fawry",
      label: "????",
      type: "cash_network",
      provider: "Fawry",
      country: "Egypt"
    },
    {
      code: "InstaPayManual",
      label: "???????? (????? ????)",
      type: "manual_transfer",
      provider: "InstaPay",
      country: "Egypt"
    }
  ]
};

export function getPaymentMethodsByCountry(country = "SaudiArabia") {
  return paymentCatalog[country] || paymentCatalog.SaudiArabia;
}
