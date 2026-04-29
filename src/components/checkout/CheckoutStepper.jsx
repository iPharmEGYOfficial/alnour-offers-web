export default function CheckoutStepper({ steps = [], currentStep = 0 }) {
  return (
    <div style={wrap} dir="rtl">
      {steps.map((step, index) => {
        const done = index < currentStep;
        const active = index === currentStep;

        return (
          <div key={step.key || step.label} style={item}>
            {index > 0 && (
              <div
                style={{
                  ...line,
                  background: done || active ? "#22c55e" : "#e5e7eb",
                }}
              />
            )}

            <div
              style={{
                ...circle,
                background: done ? "#22c55e" : active ? "#2563eb" : "#fff",
                borderColor: done || active ? "#22c55e" : "#cbd5e1",
                color: done || active ? "#fff" : "#64748b",
              }}
            >
              {done ? "✓" : index + 1}
            </div>

            <div
              style={{
                ...label,
                color: done ? "#15803d" : active ? "#1d4ed8" : "#64748b",
                fontWeight: done || active ? 900 : 700,
              }}
            >
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const wrap = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0,
  margin: "14px 0 22px",
  overflowX: "auto",
  padding: "8px 4px",
};

const item = {
  display: "flex",
  alignItems: "center",
  minWidth: 120,
  position: "relative",
};

const line = {
  width: 55,
  height: 4,
  borderRadius: 999,
  margin: "0 8px",
};

const circle = {
  width: 34,
  height: 34,
  minWidth: 34,
  borderRadius: "50%",
  border: "2px solid #cbd5e1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
};

const label = {
  marginRight: 8,
  whiteSpace: "nowrap",
  fontSize: 14,
};
