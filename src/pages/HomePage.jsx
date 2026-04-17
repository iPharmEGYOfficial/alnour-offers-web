import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import FeaturedProductsSection from "../components/products/FeaturedProductsSection";

export default function HomePage() {
  return (
    <div>
      <Header />

      <main className="container" style={{ padding: "24px 16px" }}>
        <section
          style={{
            background: "linear-gradient(135deg, #eff6ff, #ffffff)",
            border: "1px solid #dbeafe",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "24px"
          }}
        >
          <div style={{ maxWidth: "760px" }}>
            <h1
              style={{
                margin: 0,
                marginBottom: "10px",
                fontSize: "30px",
                color: "#111827"
              }}
            >
              أهلاً بك في صيدلية النور
            </h1>

            <p
              style={{
                margin: 0,
                color: "#4b5563",
                lineHeight: 1.9,
                fontSize: "16px"
              }}
            >
              تصفح المنتجات الطبية والصحية بسهولة، وأضف ما يناسبك إلى السلة
              لإكمال تجربة شراء واضحة وبسيطة.
            </p>
          </div>
        </section>

        <FeaturedProductsSection />
      </main>

      <Footer />
    </div>
  );
}
