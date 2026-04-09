export default function PaymentMethodSelector({
  methods = [],
  selectedMethod = "",
  onChange
}) {
  return (
    <div className="payment-method-grid">
      {methods.map((method) => (
        <button
          key={method.code}
          type="button"
          className={
            selectedMethod === method.code
              ? "payment-method-card active"
              : "payment-method-card"
          }
          onClick={() => onChange(method.code)}
        >
          <strong>{method.label}</strong>
          <span>{method.type}</span>
        </button>
      ))}
    </div>
  );
}
