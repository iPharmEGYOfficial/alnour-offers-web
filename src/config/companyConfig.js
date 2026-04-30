const companyConfig = {
  defaultCountry: "SA",

  storeUrl: "https://www.alnoorpharmacy.ipharmegy.com",

  logoUrl: "/alnoor-logo.png",

  legalNameAr: "صيدلية النور",
  legalNameEn: "Al-Noor Pharmacy",

  commercialRegister: "1117104725",
  vatNumber: "311263307300003",

  phonePrimary: "+966535272372",
  phoneSecondary: "+966598918692",

  addressAr:
    "طريق الملك فهد، حي النزهة، المبنى 4273، الرقم الفرعي 7966، الرمز البريدي 29353، الخرمة، المملكة العربية السعودية",

  addressEn:
    "King Fahad Rd, An Nuzhah Dist., Bldg 4273, Sec. No. 7966, Postal Code 29353, Al Khurmah, Saudi Arabia",

  tax: {
    SA: {
      label: "ضريبة القيمة المضافة",
      labelEn: "VAT",
      rate: 0.15,
      currency: "SAR",
      countryNameAr: "السعودية",
      countryNameEn: "Saudi Arabia",
    },
    EG: {
      label: "ضريبة القيمة المضافة",
      labelEn: "VAT",
      rate: 0.14,
      currency: "EGP",
      countryNameAr: "مصر",
      countryNameEn: "Egypt",
    },
  },
};

export default companyConfig;
