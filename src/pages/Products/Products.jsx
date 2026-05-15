import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import "./Products.css";
import { useToast } from "../../Context/ToastContext.jsx";

// ─────────────────────────────────────────────────────────────
//  DUMMY PRODUCTS DATA
//  Replace image URLs with your own assets:
//  import img from "../assets/shoe1.jpg"  then use image: img
// ─────────────────────────────────────────────────────────────
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Nike Air Max 270",
    category: "Shoes",
    price: 12500,
    oldPrice: 15000,
    badge: "sale",
    rating: 4.5,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  },
  {
    id: 5,
    name: "Adidas Ultraboost 22",
    category: "Shoes",
    price: 14000,
    oldPrice: 17500,
    badge: "sale",
    rating: 4.6,
    reviews: 185,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
  },
  {
    id: 6,
    name: "Leather Crossbody Bag",
    category: "Accessories",
    price: 3500,
    oldPrice: null,
    badge: null,
    rating: 4.3,
    reviews: 52,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  },
  {
    id: 7,
    name: "Slim Fit Chinos",
    category: "Clothing",
    price: 2900,
    oldPrice: 3800,
    badge: "sale",
    rating: 4.1,
    reviews: 63,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
  },
  {
    id: 8,
    name: "Versace Eros EDT",
    category: "Perfumes",
    price: 11200,
    oldPrice: null,
    badge: "new",
    rating: 4.9,
    reviews: 302,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4f2b?w=600&q=80",
  },
  {
    id: 9,
    name: "Puma RS-X Sneakers",
    category: "Shoes",
    price: 9800,
    oldPrice: 12000,
    badge: "sale",
    rating: 4.4,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&q=80",
  },
  {
    id: 10,
    name: "Aviator Sunglasses",
    category: "Accessories",
    price: 2200,
    oldPrice: null,
    badge: "new",
    rating: 4.5,
    reviews: 44,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80",
  },
  {
    id: 11,
    name: "Oversized Hoodie",
    category: "Clothing",
    price: 3200,
    oldPrice: 4000,
    badge: null,
    rating: 4.6,
    reviews: 117,
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
  },
  {
    id: 12,
    name: "Chanel No. 5 EDP",
    category: "Perfumes",
    price: 16500,
    oldPrice: null,
    badge: "hot",
    rating: 5.0,
    reviews: 421,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80",
  },
  {
    id: 13,
    name: "Minimalist Leather Wallet",
    category: "Accessories",
    price: 1500,
    oldPrice: 2000,
    badge: "sale",
    rating: 4.4,
    reviews: 82,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
  },
  {
    id: 14,
    name: "Tom Ford Black Orchid",
    category: "Perfumes",
    price: 21000,
    oldPrice: 23500,
    badge: null,
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&q=80",
  },
  {
    id: 15,
    name: "Converse Chuck Taylor",
    category: "Shoes",
    price: 7500,
    oldPrice: null,
    badge: "hot",
    rating: 4.7,
    reviews: 530,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80",
  },
  {
    id: 16,
    name: "Classic Denim Jacket",
    category: "Clothing",
    price: 5400,
    oldPrice: 6500,
    badge: "sale",
    rating: 4.5,
    reviews: 215,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80",
  },
  {
    id: 17,
    name: "Rolex Submariner Watch",
    category: "Accessories",
    price: 145000,
    oldPrice: null,
    badge: "new",
    rating: 5.0,
    reviews: 289,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80",
  },
];

// Category filter options
const CATEGORIES = [
  { label: "All", emoji: "🛍️" },
  { label: "Shoes", emoji: "👟" },
  { label: "Perfumes", emoji: "🌸" },
  { label: "Clothing", emoji: "👕" },
  { label: "Accessories", emoji: "⌚" },
];

// Sort options
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest First" },
];

// ─────────────────────────────────────────────────────────────
//  STAR RATING COMPONENT
// ─────────────────────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= Math.round(rating) ? "filled" : ""}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PRODUCT CARD COMPONENT
// ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, onViewDetail }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wished = isWishlisted(product.id);
  const [cartAdded, setCartAdded] = useState(false);

  // Calculate discount percentage
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  // Format price in PKR
  const formatPrice = (p) => `PKR ${p.toLocaleString()}`;

  // Add to cart handler
  const handleCart = (e) => {
    e.stopPropagation();
    if (cartAdded) return;
    setCartAdded(true);
    onAddToCart(product);
    setTimeout(() => setCartAdded(false), 1800);
  };

  return (
    <div
      className="product-card"
      onClick={() => onViewDetail(product.id)}
    >
      {/* ── Image Area ── */}
      <div className="product-card-img-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />

        {/* Badge */}
        {product.badge && (
          <span className={`product-card-badge ${product.badge}`}>
            {product.badge === "new" ? "New" :
              product.badge === "sale" ? "Sale" : "Hot 🔥"}
          </span>
        )}

        {/* Wishlist */}
        <button
          className={`product-card-wish ${wished ? "wished" : ""}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          aria-label="Wishlist"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>

        {/* Quick view overlay */}
        <div className="product-card-overlay">
          <button
            className="product-card-view-btn"
            onClick={(e) => { e.stopPropagation(); onViewDetail(product.id); }}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="product-card-body">
        <span className="product-card-cat">{product.category}</span>
        <h3 className="product-card-name">{product.name}</h3>

        {/* Rating */}
        <div className="product-card-rating">
          <StarRating rating={product.rating} />
          <span className="rating-count">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="product-card-price-row">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="product-card-old-price">{formatPrice(product.oldPrice)}</span>
          )}
          {discount && (
            <span className="product-card-discount">-{discount}%</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          className={`product-card-btn ${cartAdded ? "added" : ""}`}
          onClick={handleCart}
        >
          {cartAdded ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Added!
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
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PRODUCTS PAGE COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Products() {
  const { addToCart } = useCart();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("All");
  const [sort,     setSort]     = useState("default");

  // Sync search state whenever URL ?search= param changes
  // (e.g. user searches again from Navbar while already on Products page)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearch(urlSearch);
  }, [searchParams]);

  // Filter + sort products using useMemo for performance
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS_DATA];

    // 1. Category filter
    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }

    // 2. Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // 3. Sort
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "newest": list.sort((a, b) => b.id - a.id); break;
      default: break;
    }

    return list;
  }, [search, category, sort]);

  // Add to cart handler
  const handleAddToCart = (product) => {
    addToCart(product);
    showSuccess(`${product.name} added to cart!`);
  };

  // Navigate to product detail
  const handleViewDetail = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <>
      <Navbar />

      <div className="products-page">

        {/* ── Page Hero Header ── */}
        <div className="products-page-hero">
          <span className="products-page-tag">Our Collection</span>
          <h1 className="products-page-title">
            All <span>Products</span>
          </h1>
          <p className="products-page-subtitle">
            Explore our latest collections and trending products
          </p>
        </div>

        {/* ── Body ── */}
        <div className="products-page-body">

          {/* ── Toolbar ── */}
          <div className="products-toolbar">

            {/* Search */}
            <div className="products-search-box">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="products-search-input"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Sort */}
            <select
              className="products-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Results count */}
            <span className="products-results-count">
              <span>{filteredProducts.length}</span> products found
            </span>

          </div>

          {/* ── Category Filters ── */}
          <div className="products-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                className={`products-filter-btn ${category === cat.label ? "active" : ""}`}
                onClick={() => setCategory(cat.label)}
              >
                <span className="filter-emoji">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* ── Products Grid ── */}
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetail={handleViewDetail}
                  />
                </div>
              ))
            ) : (
              // No results
              <div className="products-empty">
                <span className="products-empty-icon">🔍</span>
                <h3>No products found</h3>
                <p>Try a different search term or category</p>
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}