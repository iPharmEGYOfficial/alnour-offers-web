export default function PaymentCountrySelector({ country, onChange }) {
  return (
    <div className="country-switcher">
      <button
        type="button"
        className={country === "SaudiArabia" ? "country-btn active" : "country-btn"}
        onClick={() => onChange("SaudiArabia")}
      >
        السعودية
      </button>

      <button
        type="button"
        className={country === "Egypt" ? "country-btn active" : "country-btn"}
        onClick={() => onChange("Egypt")}
      >
        مصر
      </button>
    </div>
  );
}

