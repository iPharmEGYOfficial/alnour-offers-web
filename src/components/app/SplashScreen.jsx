export default function SplashScreen() {
  return (
    <div className="center-screen">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div
          style={{
            width: 74,
            height: 74,
            margin: "0 auto 18px",
            borderRadius: 22,
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, #0f766e, #22c55e)"
          }}
        >
          <span style={{ color: "#fff", fontSize: 28, fontWeight: 900 }}>AN</span>
        </div>

        <h1 style={{ marginBottom: 12 }}>Al-Nour Offers</h1>
        <p className="subtle" style={{ marginBottom: 16 }}>
          Loading storefront, checking session, and preparing customer experience...
        </p>

        <div
          style={{
            width: "100%",
            height: 10,
            borderRadius: 999,
            overflow: "hidden",
            background: "rgba(15,118,110,0.10)"
          }}
        >
          <div
            style={{
              width: "45%",
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, #0f766e, #22c55e)",
              animation: "pulseBar 1.2s infinite ease-in-out"
            }}
          />
        </div>
      </div>
    </div>
  );
}

