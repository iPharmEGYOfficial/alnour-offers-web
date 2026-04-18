const cats = [
  "Medical Devices",
  "Blood Pressure",
  "Thermometers",
  "Mother & Baby",
  "Personal Care",
  "Beauty Devices"
];

export default function CategoryGrid() {
  return (
    <section className="card" style={{ margin: "16px 0", padding: 16 }}>
      <h3>الأقسام</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {cats.map((c) => (
          <span key={c} className="meta-chip">{c}</span>
        ))}
      </div>
    </section>
  );
}