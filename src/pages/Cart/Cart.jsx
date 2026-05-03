import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Cart.css";

// ─────────────────────────────────────────────────────────────
//  DUMMY CART DATA
//  Later: replace with real cart state from Context API
// ─────────────────────────────────────────────────────────────
const INITIAL_CART = [
  {
    id: 1,
    name: "Nike Air Max 270",
    category: "Shoes",
    price: 12500,
    oldPrice: 15000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  },
  {
    id: 2,
    name: "Dior Sauvage EDP",
    category: "Perfumes",
    price: 8900,
    oldPrice: null,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80",
  },
  {
    id: 4,
    name: "Casio G-Shock Watch",
    category: "Accessories",
    price: 6200,
    oldPrice: null,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  },
];

// Valid coupon codes
const VALID_COUPONS = {
  EDGE10: { discount: 10, label: "10% off applied!" },
  SAVE20: { discount: 20, label: "20% off applied!" },
  WELCOME: { discount: 15, label: "15% welcome discount!" },
};

// Delivery charge threshold
const FREE_DELIVERY_MIN = 5000;
const DELIVERY_CHARGE = 250;

// Format price helper
const fmt = (n) => `PKR ${Math.round(n).toLocaleString()}`;

// ─────────────────────────────────────────────────────────────
//  CART PAGE COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Cart() {
  const navigate = useNavigate();

  // Cart items state
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [removingId, setRemovingId] = useState(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponStatus, setCouponStatus] = useState(null); // null | "success" | "error"
  const [couponData, setCouponData] = useState(null); // { discount, label }

  // ── Quantity handlers ──
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity < 10
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // ── Remove item with animation ──
  const removeItem = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

  // ── Clear all items ──
  const clearCart = () => {
    setCartItems([]);
    setCouponData(null);
    setCouponStatus(null);
  };

  // ── Apply coupon ──
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setCouponData(VALID_COUPONS[code]);
      setCouponStatus("success");
    } else {
      setCouponData(null);
      setCouponStatus("error");
    }
  };

  // ── Price calculations ──
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_CHARGE;
  const discountAmt = couponData ? Math.round(subtotal * (couponData.discount / 100)) : 0;
  const total = subtotal + delivery - discountAmt;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar cartCount={totalItems} />

      <div className="cart-page">

        {/* ── Hero Header ── */}
        <div className="cart-hero">
          <span className="cart-hero-tag">Your Bag</span>
          <h1 className="cart-hero-title">
            Shopping <span>Cart</span>
          </h1>
          <p className="cart-hero-sub">
            {totalItems > 0
              ? `You have ${totalItems} item${totalItems > 1 ? "s" : ""} in your cart`
              : "Your cart is empty"}
          </p>
        </div>

        {/* ── Breadcrumb ── */}
        <div className="cart-breadcrumb">
          <Link to="/">Home</Link>
          <span className="cart-breadcrumb-sep">›</span>
          <Link to="/products">Products</Link>
          <span className="cart-breadcrumb-sep">›</span>
          <span>Cart</span>
        </div>

        {/* ── Page Body ── */}
        <div className="cart-body">

          {/* ════ LEFT — CART ITEMS ════ */}
          <div className="cart-items-section">

            {cartItems.length > 0 ? (
              <>
                {/* Top bar */}
                <div className="cart-items-bar">
                  <span className="cart-items-label">
                    Cart Items
                    <span className="cart-items-count"> ({totalItems})</span>
                  </span>
                  <button className="cart-clear-btn" onClick={clearCart}>
                    Clear All
                  </button>
                </div>

                {/* Cart item cards */}
                {cartItems.map((item, index) => {
                  const discount = item.oldPrice
                    ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
                    : null;

                  return (
                    <div
                      key={item.id}
                      className={`cart-item ${removingId === item.id ? "removing" : ""}`}
                      style={{ animationDelay: `${index * 0.07}s` }}
                    >
                      {/* Image */}
                      <div className="cart-item-img-wrap">
                        <img src={item.image} alt={item.name} loading="lazy" />
                      </div>

                      {/* Details */}
                      <div className="cart-item-details">
                        <span className="cart-item-cat">{item.category}</span>
                        <h3 className="cart-item-name">{item.name}</h3>

                        {/* Price */}
                        <div className="cart-item-price-row">
                          <span className="cart-item-price">{fmt(item.price)}</span>
                          {item.oldPrice && (
                            <span className="cart-item-old-price">{fmt(item.oldPrice)}</span>
                          )}
                          {discount && (
                            <span className="cart-item-badge">-{discount}%</span>
                          )}
                        </div>

                        {/* Quantity control */}
                        <div className="cart-item-qty">
                          <button
                            className="cart-qty-btn"
                            onClick={() => decreaseQty(item.id)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="cart-qty-num">{item.quantity}</span>
                          <button
                            className="cart-qty-btn"
                            onClick={() => increaseQty(item.id)}
                            disabled={item.quantity >= 10}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Right side: subtotal + remove */}
                      <div className="cart-item-right">
                        <span className="cart-item-subtotal">
                          {fmt(item.price * item.quantity)}
                        </span>
                        <button
                          className="cart-remove-btn"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Continue shopping */}
                <Link to="/products" className="cart-continue">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Continue Shopping
                </Link>
              </>
            ) : (
              /* Empty cart state */
              <div className="cart-empty">
                <span className="cart-empty-icon">🛒</span>
                <h2>Your Cart is Empty</h2>
                <p>
                  Looks like you haven't added anything yet.<br />
                  Browse our collection and find something you love!
                </p>
                <Link to="/products" className="cart-empty-btn">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    width="16" height="16" stroke="currentColor">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Start Shopping
                </Link>
              </div>
            )}
          </div>

          {/* ════ RIGHT — ORDER SUMMARY ════ */}
          {cartItems.length > 0 && (
            <div className="cart-summary">
              <h2 className="cart-summary-title">Order Summary</h2>

              {/* Price rows */}
              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span className="row-label">Subtotal ({totalItems} items)</span>
                  <span className="row-value">{fmt(subtotal)}</span>
                </div>
                <div className="cart-summary-row">
                  <span className="row-label">Delivery Charges</span>
                  <span className={`row-value ${delivery === 0 ? "free" : ""}`}>
                    {delivery === 0 ? "FREE" : fmt(delivery)}
                  </span>
                </div>
                {couponData && (
                  <div className="cart-summary-row">
                    <span className="row-label">
                      Discount ({couponData.discount}%)
                    </span>
                    <span className="row-value discount">− {fmt(discountAmt)}</span>
                  </div>
                )}
              </div>

              {/* Coupon input */}
              <div className="cart-coupon">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    setCouponStatus(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                />
                <button
                  className={`cart-coupon-btn ${couponStatus === "success" ? "applied" : ""}`}
                  onClick={applyCoupon}
                >
                  {couponStatus === "success" ? "✓ Applied" : "Apply"}
                </button>
              </div>

              {/* Coupon message */}
              {couponStatus === "success" && (
                <p className="cart-coupon-msg success">
                  ✅ {couponData.label}
                </p>
              )}
              {couponStatus === "error" && (
                <p className="cart-coupon-msg error">
                  ❌ Invalid coupon code. Try EDGE10 or SAVE20
                </p>
              )}

              {/* Divider */}
              <div className="cart-summary-divider" />

              {/* Total */}
              <div className="cart-summary-total">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-value">{fmt(total)}</span>
              </div>

              {/* Checkout button */}
              <button
                className="cart-checkout-btn"
                onClick={() => navigate("/checkout")}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              {/* Safe payment note */}
              <p className="cart-safe-note">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Secure & safe checkout
              </p>

              {/* Delivery estimate */}
              <div className="cart-delivery-est">
                <span className="cart-delivery-icon">🚚</span>
                <div className="cart-delivery-text">
                  <span className="cart-delivery-title">
                    {delivery === 0
                      ? "You qualify for FREE delivery!"
                      : `Add ${fmt(FREE_DELIVERY_MIN - subtotal)} more for free delivery`}
                  </span>
                  <span className="cart-delivery-sub">
                    Estimated delivery: 2–4 business days
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}