import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import SocialBar from "../components/common/SocialBar";
import ProductCard from "../components/products/ProductCard";
import ReviewSummary from "../components/products/ReviewSummary";
import ReviewList from "../components/products/ReviewList";
import useCartStore from "../store/cartStore";
import {
  getProductById,
  getProducts,
  getProductReviews
} from "../services/productService";

function fallbackSpecs(product) {
  return [
    { label: "Product", value: product?.productName || product?.name || "-" },
    { label: "Barcode", value: product?.barcode || "-" },
    { label: "Category", value: product?.categoryName || product?.category || "General" },
    { label: "Brand", value: product?.brandName || product?.brand || "No Brand" },
    { label: "Availability", value: Number(product?.stockQty || product?.stock || 0) > 0 ? "In Stock" : "Out of Stock" }
  ];
}

export default function ProductDetailsPage() {
  const { productId } = useParams();

  const addToCart = useCartStore((state) => state.addToCart);

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    loadProduct();
  }, [productId]);

  async function loadProduct() {
    try {
      setLoading(true);

      const result = await getProductById(productId);
      setProduct(result || null);

      const candidateImage =
        result?.imageUrl ||
        result?.image ||
        result?.primaryImageUrl ||
        "/no-image.svg";

      setActiveImage(candidateImage);

      const similar = await getProducts({
        page: 1,
        pageSize: 8,
        search: result?.categoryName || result?.brandName || result?.productName || ""
      });

      const normalized = (similar?.items || similar || [])
        .filter((x) => String(x.productID || x.id || x.barcode) !== String(result?.productID || result?.id || result?.barcode))
        .slice(0, 4);

      setSimilarProducts(normalized);

      const reviewItems = await getProductReviews(result?.productID || productId);
      setReviews(reviewItems);
    } catch {
      setProduct(null);
      setSimilarProducts([]);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  const specs = useMemo(() => fallbackSpecs(product), [product]);

  if (loading) {
    return (
      <div className="page">
        <Header />
        <main className="container">
          <div className="status-box" style={{ marginTop: "20px" }}>Loading product details...</div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <Header />
        <main className="container">
          <div className="status-box" style={{ marginTop: "20px" }}>Product not found.</div>
        </main>
      </div>
    );
  }

  const currentPrice = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || product.price || 0);
  const stock = Number(product.stockQty || product.stock || 0);
  const discount = Math.max(0, originalPrice - currentPrice);
  const discountPercent =
    originalPrice > 0 ? Math.round((discount / originalPrice) * 100) : 0;

  const gallery = [
    activeImage || "/no-image.svg",
    product?.imageUrl || "/no-image.svg",
    product?.primaryImageUrl || "/no-image.svg",
    product?.image || "/no-image.svg"
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  const handleAdd = () => {
    addToCart({
      productID: product.productID,
      productName: product.productName,
      price: currentPrice,
      originalPrice,
      stockQty: stock,
      barcode: product.barcode
    });
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.ratingValue || 0), 0) / reviews.length
      : Number(product.averageRating || 0);

  return (
    <div className="page">
      <Header />

      <main className="container">
        <div className="product-details-shell">
          <section className="product-gallery-panel">
            <div className="product-main-image">
              <img src={activeImage || "/no-image.svg"} alt={product.productName} />
            </div>

            <div className="product-thumb-row">
              {gallery.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  className={activeImage === img ? "thumb-btn active" : "thumb-btn"}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`preview-${index}`} />
                </button>
              ))}
            </div>
          </section>

          <section className="product-content-panel">
            <div className="product-content-top">
              <div className="product-path">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/offers">Offers</Link>
                <span>/</span>
                <strong>{product.productName}</strong>
              </div>

              <h1>{product.productName}</h1>

              <div className="product-rating-inline">
                <span className="rating-stars large">
                  {"˜…".repeat(Math.round(averageRating || 0)) + "˜†".repeat(5 - Math.round(averageRating || 0))}
                </span>
                <span className="rating-meta big">
                  {averageRating > 0 ? averageRating.toFixed(1) : "0.0"} Â· {reviews.length} reviews
                </span>
              </div>

              <p className="product-long-desc">
                {product.description ||
                  "This product page is connected to the live pharmacy feed. Detailed copy can be added later when product descriptions become available."}
              </p>

              <div className="product-meta-row">
                <span className="meta-chip">Barcode: {product.barcode || "-"}</span>
                <span className="meta-chip">Stock: {stock}</span>
                <span className="meta-chip">{stock > 0 ? "Available" : "Out of stock"}</span>
              </div>

              <div className="product-price-panel">
                <div className="price-stack">
                  <strong className="price-now">{currentPrice.toFixed(2)} SAR</strong>

                  {originalPrice > currentPrice && (
                    <div className="price-old-wrap">
                      <span className="price-old">{originalPrice.toFixed(2)} SAR</span>
                      <span className="discount-badge">Save {discountPercent}%</span>
                    </div>
                  )}
                </div>

                <div className="delivery-note">
                  Fast local fulfillment from the connected pharmacy inventory.
                </div>
              </div>

              <div className="product-action-row">
                <button className="primary-btn" onClick={handleAdd} disabled={stock <= 0}>
                  {stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>

                <Link className="secondary-btn" to="/cart">
                  View Cart
                </Link>
              </div>
            </div>

            <div className="product-specs-box">
              <h3>Product Information</h3>

              <div className="specs-grid">
                {specs.map((spec, index) => (
                  <div key={index} className="spec-row">
                    <span>{spec.label}</span>
                    <strong>{spec.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="home-section">
          <div className="section-head">
            <div>
              <h2>Share this product</h2>
              <p>Help customers discover this item through social and messaging channels.</p>
            </div>
          </div>

          <SocialBar title="Share this product with others" compact />
        </section>

        <section className="home-section">
          <div className="section-head">
            <div>
              <h2>Customer Reviews</h2>
              <p>Ratings and comments collected from previous customers.</p>
            </div>
          </div>

          <ReviewSummary average={averageRating} total={reviews.length} />
          <ReviewList reviews={reviews} />
        </section>

        <section className="home-section">
          <div className="section-head">
            <div>
              <h2>Similar Products</h2>
              <p>More products from the same category or brand.</p>
            </div>
          </div>

          <div className="products-grid-inline">
            {similarProducts.map((item) => (
              <ProductCard key={item.productID || item.barcode} product={item} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


