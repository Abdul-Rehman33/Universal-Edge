import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import { useCart } from "../../Context/CartContext.jsx";
import "./Wishlist.css";

// Format price helper
const fmt = (n) => `PKR ${Math.round(n).toLocaleString()}`;

// ─────────────────────────────────────────────────────────────
//  STAR RATING
// ─────────────────────────────────────────────────────────────
function StarRating({ rating }) {
    if (!rating) return null;
    return (
        <div className="wl-stars">
            {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`wl-star ${s <= Math.round(rating) ? "filled" : ""}`}>★</span>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
//  WISHLIST CARD
// ─────────────────────────────────────────────────────────────
function WishlistCard({ item }) {
    const navigate = useNavigate();
    const { removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const [cartAdded, setCartAdded] = useState(false);
    const [removing, setRemoving] = useState(false);

    // Discount calculation
    const discount = item.oldPrice
        ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
        : null;

    // Add to cart handler
    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(item);
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 1800);
    };

    // Remove with animation
    const handleRemove = (e) => {
        e.stopPropagation();
        setRemoving(true);
        setTimeout(() => removeFromWishlist(item.id), 300);
    };

    return (
        <div
            className="wishlist-card"
            style={{
                opacity: removing ? 0 : 1,
                transform: removing ? "scale(0.95)" : "",
                transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
        >
            {/* Image */}
            <div
                className="wishlist-card-img-wrap"
                onClick={() => navigate(`/products/${item.id}`)}
            >
                <img src={item.image} alt={item.name} loading="lazy" />

                {/* Remove heart button */}
                <button
                    className="wishlist-remove-btn"
                    onClick={handleRemove}
                    aria-label="Remove from wishlist"
                >
                    <svg viewBox="0 0 24 24" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                </button>

                {/* Category label */}
                <span className="wishlist-card-cat">{item.category}</span>
            </div>

            {/* Card Body */}
            <div className="wishlist-card-body">

                {/* Name */}
                <h3
                    className="wishlist-card-name"
                    onClick={() => navigate(`/products/${item.id}`)}
                >
                    {item.name}
                </h3>

                {/* Rating */}
                {item.rating && (
                    <div className="wishlist-card-rating">
                        <StarRating rating={item.rating} />
                        <span style={{ fontSize: "11px", color: "#999" }}>
                            {item.rating}/5
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="wishlist-card-price-row">
                    <span className="wishlist-card-price">{fmt(item.price)}</span>
                    {item.oldPrice && (
                        <span className="wishlist-card-old-price">{fmt(item.oldPrice)}</span>
                    )}
                    {discount && (
                        <span className="wishlist-card-discount">-{discount}%</span>
                    )}
                </div>

                {/* Buttons */}
                <div className="wishlist-card-btns">

                    {/* Add to Cart */}
                    <button
                        className={`wishlist-add-cart-btn ${cartAdded ? "added" : ""}`}
                        onClick={handleAddToCart}
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

                    {/* View Detail */}
                    <button
                        className="wishlist-view-btn"
                        onClick={() => navigate(`/products/${item.id}`)}
                        aria-label="View product"
                    >
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>

                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
//  WISHLIST PAGE COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Wishlist() {
    const { wishlistItems, clearWishlist, totalWishlist } = useWishlist();
    const { addToCart } = useCart();

    // Move all wishlist items to cart
    const handleMoveAllToCart = () => {
        wishlistItems.forEach((item) => addToCart(item));
    };

    return (
        <>
            <Navbar />

            <div className="wishlist-page">

                {/* ── Hero ── */}
                <div className="wishlist-hero">
                    <span className="wishlist-hero-tag">Your Saved Items</span>
                    <h1 className="wishlist-hero-title">
                        My <span>Wishlist</span>
                    </h1>
                    <p className="wishlist-hero-sub">
                        {totalWishlist > 0
                            ? `${totalWishlist} item${totalWishlist > 1 ? "s" : ""} saved to your wishlist`
                            : "Your wishlist is empty"}
                    </p>
                </div>

                {/* ── Breadcrumb ── */}
                <div className="wishlist-breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="wishlist-breadcrumb-sep">›</span>
                    <Link to="/products">Products</Link>
                    <span className="wishlist-breadcrumb-sep">›</span>
                    <span>Wishlist</span>
                </div>

                {/* ── Body ── */}
                <div className="wishlist-body">

                    {wishlistItems.length > 0 ? (
                        <>
                            {/* Top bar */}
                            <div className="wishlist-topbar">
                                <div className="wishlist-topbar-left">
                                    <span className="wishlist-count-label">Saved Items</span>
                                    <span className="wishlist-count-badge">
                                        {totalWishlist} item{totalWishlist > 1 ? "s" : ""}
                                    </span>
                                </div>

                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {/* Move all to cart */}
                                    <button
                                        className="wishlist-move-all-btn"
                                        onClick={handleMoveAllToCart}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                            <line x1="3" y1="6" x2="21" y2="6" />
                                            <path d="M16 10a4 4 0 01-8 0" />
                                        </svg>
                                        Move All to Cart
                                    </button>

                                    {/* Clear all */}
                                    <button
                                        className="wishlist-clear-btn"
                                        onClick={clearWishlist}
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="wishlist-grid">
                                {wishlistItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        style={{ animationDelay: `${index * 0.06}s` }}
                                    >
                                        <WishlistCard item={item} />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* ── Empty State ── */
                        <div className="wishlist-empty">
                            <span className="wishlist-empty-icon">🤍</span>
                            <h2>Your Wishlist is Empty</h2>
                            <p>
                                Save your favorite products here and come back to
                                them anytime. Start exploring!
                            </p>
                            <Link to="/products" className="wishlist-empty-btn">
                                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round"
                                    width="15" height="15" stroke="currentColor">
                                    <line x1="19" y1="12" x2="5" y2="12" />
                                    <polyline points="12 19 5 12 12 5" />
                                </svg>
                                Explore Products
                            </Link>
                        </div>
                    )}

                </div>
            </div>

            <Footer />
        </>
    );
}