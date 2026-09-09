import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./ProductDetail.css";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import { useToast } from "../../Context/ToastContext.jsx";
import { ProductDetailSkeleton } from "../../components/Skeleton/Skeleton.jsx";


// ─────────────────────────────────────────────────────────────
//  DUMMY PRODUCTS DATABASE
//  Replace image URLs with your own assets later
// ─────────────────────────────────────────────────────────────
const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Nike Air Max 270",
    category: "Shoes",
    price: 12500,
    oldPrice: 15000,
    badge: "sale",
    rating: 4.5,
    reviews: 128,
    sold: "1.2k+",
    inStock: true,
    description:
      "The Nike Air Max 270 delivers an iconic look with big, bold Max Air cushioning. The large Air unit in the heel provides all-day comfort, while the streamlined upper keeps things fresh and modern. Perfect for everyday wear or casual outings.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
    ],
    specs: {
      Brand: "Nike",
      Model: "Air Max 270",
      Material: "Mesh + Synthetic",
      Sole: "Rubber",
      Closure: "Lace-Up",
      "Available Sizes": "38 – 46",
      Color: "White / Black",
      Weight: "310g",
    },
  },
  {
    id: 2,
    name: "Dior Sauvage EDP",
    category: "Perfumes",
    price: 8900,
    oldPrice: null,
    badge: "new",
    rating: 4.8,
    reviews: 96,
    sold: "850+",
    inStock: true,
    description:
      "Dior Sauvage EDP is a bold, radically fresh fragrance that evokes wide-open spaces. With top notes of Bergamot and Pepper, a heart of Sichuan Pepper and Lavender, and a base of Vanilla and Ambroxan, this is a scent for the modern man.",
    images: [
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4f2b?w=800&q=80",
      "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80",
    ],
    specs: {
      Brand: "Dior",
      Type: "Eau de Parfum",
      Volume: "100ml",
      "Top Notes": "Bergamot, Pepper",
      "Heart Notes": "Lavender, Sichuan Pepper",
      "Base Notes": "Vanilla, Ambroxan",
      Longevity: "8–10 hours",
      Occasion: "Day & Night",
    },
  },
  {
    id: 3,
    name: "Classic White Tee",
    category: "Clothing",
    price: 1800,
    oldPrice: 2400,
    badge: "sale",
    rating: 4.2,
    reviews: 74,
    sold: "600+",
    inStock: true,
    description:
      "A wardrobe essential — our Classic White Tee is made from 100% premium cotton for all-day breathability and comfort. The relaxed fit and clean design make it perfect for any casual occasion.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
    ],
    specs: {
      Brand: "Universal Edge",
      Material: "100% Cotton",
      Fit: "Regular / Relaxed",
      "Available Sizes": "S, M, L, XL, XXL",
      Color: "White",
      Care: "Machine Wash Cold",
      Origin: "Pakistan",
    },
  },
  {
    id: 4,
    name: "Casio G-Shock Watch",
    category: "Accessories",
    price: 6200,
    oldPrice: null,
    badge: "hot",
    rating: 4.7,
    reviews: 210,
    sold: "2.1k+",
    inStock: true,
    description:
      "Built for toughness, the Casio G-Shock combines rugged shock resistance with a bold design. Water-resistant up to 200m, with multi-function display, stopwatch, alarm, and LED illumination — the ultimate everyday companion.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    ],
    specs: {
      Brand: "Casio",
      Series: "G-Shock",
      "Water Resistance": "200m",
      Display: "Digital",
      "Band Material": "Resin",
      Battery: "CR2016",
      "Case Size": "46mm",
      Weight: "68g",
    },
  },
];

// Dummy reviews data
const DUMMY_REVIEWS = [
  { id: 1, name: "Ahmed K.", date: "Apr 2025", rating: 5, text: "Amazing quality! Exactly as described. Fast delivery too. Highly recommended for anyone looking for premium products." },
  { id: 2, name: "Sara M.", date: "Mar 2025", rating: 4, text: "Great product overall. Packaging was neat and the item arrived in perfect condition. Will definitely order again." },
  { id: 3, name: "Usman R.", date: "Feb 2025", rating: 5, text: "Absolutely love it! The quality exceeded my expectations. Universal Edge never disappoints." },
];

// Rating bar percentages
const RATING_BARS = [
  { stars: 5, pct: 68 },
  { stars: 4, pct: 20 },
  { stars: 3, pct: 7 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 2 },
];

// Info cards data
const INFO_CARDS = [
  { icon: "💵", title: "Cash on Delivery", sub: "Available nationwide" },
  { icon: "📱", title: "EasyPaisa / JazzCash", sub: "Secure online payment" },
  { icon: "🚚", title: "Fast Delivery", sub: "2–4 business days" },
  { icon: "🔒", title: "Secure Shopping", sub: "100% safe & private" },
];

// ─────────────────────────────────────────────────────────────
//  PRODUCT DETAIL PAGE COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { success, info } = useToast();
  const [loading, setLoading] = useState(true);
  const { toggleWishlist, isWishlisted } = useWishlist();


  // Find product by id
  const product = ALL_PRODUCTS.find((p) => p.id === Number(id));

  // State
  const [activeImg, setActiveImg] = useState(0);
  const [switching, setSwitching] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [cartAdded, setCartAdded] = useState(false);

  // Reset when product changes
  useEffect(() => {
    setActiveImg(0);
    setQuantity(1);
    setCartAdded(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Loading state for product
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [id]); // id change hone pe bhi loading dikhao

  // Product not found
  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "120px 20px" }}>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "28px" }}>Product not found</h2>
          <button onClick={() => navigate("/products")}
            style={{ marginTop: "20px", padding: "12px 28px", cursor: "pointer", background: "#0a0a0a", color: "#fff", border: "none", borderRadius: "8px", fontFamily: "DM Sans, sans-serif" }}>
            ← Back to Products
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Switch image with fade effect
  const switchImage = (index) => {
    if (index === activeImg) return;
    setSwitching(true);
    setTimeout(() => {
      setActiveImg(index);
      setSwitching(false);
    }, 200);
  };

  // Quantity handlers
  const increaseQty = () => setQuantity((q) => Math.min(q + 1, 10));
  const decreaseQty = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleWishlist = () => {
    const wasWishlisted = isWishlisted(product.id);
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.images[0],
      category: product.category,
    });
    if (wasWishlisted) {
      info("Removed from wishlist");
    } else {
      success("Added to wishlist! ❤️");
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    // Add the product with selected quantity
    // This loops addToCart based on the quantity selected
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.images[0],
        category: product.category,
      });
    }
    setCartAdded(true);
    success(`${product.name} added to cart!`);
    setTimeout(() => setCartAdded(false), 2000);
  };

  // Discount calculation
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  // Format price
  const fmt = (p) => `PKR ${p.toLocaleString()}`;

  // Related products (same category, different id)
  const related = ALL_PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const TABS = ["description", "specifications", "reviews"];

  return (
    <>
      <Navbar />

      <div className="pd-page">

        {/* ── Breadcrumb ── */}
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link>
          <span className="pd-breadcrumb-sep">›</span>
          <Link to="/products">Products</Link>
          <span className="pd-breadcrumb-sep">›</span>
          <Link to="/products">{product.category}</Link>
          <span className="pd-breadcrumb-sep">›</span>
          <span>{product.name}</span>
        </div>

        {/* ── Two Column Main ── */}
        {loading ? (
          <ProductDetailSkeleton />
        ) : (
          <div className="pd-main">

            {/* ════ LEFT — IMAGES ════ */}
            <div className="pd-images">

              {/* Main image */}
              <div className="pd-main-img-wrap">
                <img
                  className={`pd-main-img ${switching ? "switching" : ""}`}
                  src={product.images[activeImg]}
                  alt={product.name}
                />
                {product.badge && (
                  <span className={`pd-img-badge ${product.badge}`}>
                    {product.badge === "new" ? "New" : product.badge === "sale" ? "Sale" : "Hot 🔥"}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="pd-thumbs">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={`pd-thumb ${i === activeImg ? "active" : ""}`}
                    onClick={() => switchImage(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            {/* ════ RIGHT — INFO ════ */}
            <div className="pd-info">

              {/* Meta */}
              <div className="pd-info-meta">
                <span className="pd-info-cat">{product.category}</span>
                <span className="pd-info-sold">{product.sold} Sold</span>
              </div>

              {/* Title */}
              <h1 className="pd-info-title">{product.name}</h1>

              {/* Rating */}
              <div className="pd-info-rating">
                <div className="pd-rating-score">
                  <span className="star-icon">⭐</span>
                  <span className="score-num">{product.rating}</span>
                  <span className="score-denom">/ 5</span>
                </div>
                <a href="#reviews" className="pd-rating-reviews"
                  onClick={() => setActiveTab("reviews")}>
                  {product.reviews} Reviews
                </a>
              </div>

              {/* Price */}
              <div className="pd-info-price-row">
                <span className="pd-info-price">{fmt(product.price)}</span>
                {product.oldPrice && (
                  <span className="pd-info-old-price">{fmt(product.oldPrice)}</span>
                )}
                {discount && (
                  <span className="pd-info-discount">-{discount}% OFF</span>
                )}
              </div>

              {/* Stock */}
              <div className={`pd-info-stock ${product.inStock ? "in" : "out"}`}>
                <span className="stock-dot" />
                {product.inStock ? "In Stock — Ready to Ship" : "Out of Stock"}
              </div>

              {/* Description */}
              <p className="pd-info-desc">{product.description}</p>

              {/* Quantity */}
              <div className="pd-qty-row">
                <span className="pd-qty-label">Qty:</span>
                <div className="pd-qty-control">
                  <button
                    className="pd-qty-btn"
                    onClick={decreaseQty}
                    disabled={quantity <= 1}
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <span className="pd-qty-num">{quantity}</span>
                  <button
                    className="pd-qty-btn"
                    onClick={increaseQty}
                    disabled={quantity >= 10}
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pd-action-btns">
                <button
                  className={`pd-btn-cart ${cartAdded ? "added" : ""}`}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  {cartAdded ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  className="pd-btn-buy"
                  onClick={() => navigate("/checkout")}
                  disabled={!product.inStock}
                >
                  Buy Now
                </button>
                <button
                  className={`pd-btn-wishlist ${isWishlisted(product.id) ? "wished" : ""}`}
                  onClick={handleWishlist}
                  aria-label="Wishlist"
                >
                  <svg viewBox="0 0 24 24" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Info cards */}
              <div className="pd-info-cards">
                {INFO_CARDS.map((card) => (
                  <div className="pd-info-card" key={card.title}>
                    <span className="pd-info-card-icon">{card.icon}</span>
                    <div className="pd-info-card-text">
                      <span className="pd-info-card-title">{card.title}</span>
                      <span className="pd-info-card-sub">{card.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ── TABS SECTION ── */}
        <div className="pd-tabs-section" id="reviews">

          {/* Tab buttons */}
          <div className="pd-tabs-header">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`pd-tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="pd-tab-content" key={activeTab}>

            {/* Description tab */}
            {activeTab === "description" && (
              <div className="pd-tab-desc">
                <p>{product.description}</p>
                <br />
                <p>
                  All products at Universal Edge are carefully selected for quality
                  and authenticity. We believe in offering premium items at fair prices
                  with fast and reliable delivery across Pakistan.
                </p>
              </div>
            )}

            {/* Specifications tab */}
            {activeTab === "specifications" && (
              <table className="pd-specs-table">
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Reviews tab */}
            {activeTab === "reviews" && (
              <div>
                {/* Summary */}
                <div className="pd-reviews-summary">
                  <div className="pd-reviews-score">
                    <span className="big-score">{product.rating}</span>
                    <span className="big-stars">★★★★★</span>
                    <span className="big-count">{product.reviews} Reviews</span>
                  </div>
                  <div className="pd-review-bars">
                    {RATING_BARS.map((bar) => (
                      <div className="pd-review-bar-row" key={bar.stars}>
                        <span>{bar.stars}★</span>
                        <div className="pd-review-bar-track">
                          <div
                            className="pd-review-bar-fill"
                            style={{ width: `${bar.pct}%` }}
                          />
                        </div>
                        <span>{bar.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review cards */}
                <div className="pd-review-cards">
                  {DUMMY_REVIEWS.map((review) => (
                    <div className="pd-review-card" key={review.id}>
                      <div className="pd-review-card-top">
                        <div className="pd-reviewer">
                          <div className="pd-reviewer-avatar">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <div className="pd-reviewer-name">{review.name}</div>
                            <div className="pd-reviewer-date">{review.date}</div>
                          </div>
                        </div>
                        <span className="pd-review-stars">
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p className="pd-review-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <div className="pd-related">
            <div className="pd-related-inner">
              <div className="pd-related-header">
                <span className="pd-related-tag">Discover More</span>
                <h2 className="pd-related-title">
                  You May Also <span>Like</span>
                </h2>
                <div className="pd-related-divider" />
              </div>

              <div className="pd-related-grid">
                {related.map((item) => (
                  <div
                    key={item.id}
                    className="pd-related-card"
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    <img
                      className="pd-related-card-img"
                      src={item.images[0]}
                      alt={item.name}
                      loading="lazy"
                    />
                    <div className="pd-related-card-body">
                      <p className="pd-related-card-name">{item.name}</p>
                      <span className="pd-related-card-price">
                        PKR {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}