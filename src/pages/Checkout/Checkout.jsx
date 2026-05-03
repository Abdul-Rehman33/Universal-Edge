import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Checkout.css";

// ─────────────────────────────────────────────────────────────
//  DUMMY ORDER ITEMS
//  Later: get these from Cart Context / state
// ─────────────────────────────────────────────────────────────
const ORDER_ITEMS = [
  {
    id: 1,
    name: "Nike Air Max 270",
    qty: 1,
    price: 12500,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80",
  },
  {
    id: 2,
    name: "Dior Sauvage EDP",
    qty: 2,
    price: 8900,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=200&q=80",
  },
  {
    id: 4,
    name: "Casio G-Shock Watch",
    qty: 1,
    price: 6200,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
  },
];

// Delivery settings
const FREE_DELIVERY_MIN = 5000;
const DELIVERY_CHARGE   = 250;

// Payment methods
const PAYMENT_METHODS = [
  {
    id: "cod",
    name: "Cash on Delivery",
    desc: "Pay when your order arrives at your door",
    icon: "💵",
    iconClass: "cod",
    recommended: true,
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    desc: "Pay securely via JazzCash mobile account",
    icon: "💜",
    iconClass: "jazz",
    recommended: false,
  },
  {
    id: "easypaisa",
    name: "EasyPaisa",
    desc: "Pay securely via EasyPaisa mobile account",
    icon: "💚",
    iconClass: "easypaisa",
    recommended: false,
  },
];

// Format price helper
const fmt = (n) => `PKR ${Math.round(n).toLocaleString()}`;

// Generate random order ID
const genOrderId = () =>
  "UE-" + Math.random().toString(36).substring(2, 8).toUpperCase();

// ─────────────────────────────────────────────────────────────
//  CHECKOUT PAGE COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    fullName:    "",
    email:       "",
    phone:       "",
    address:     "",
    city:        "",
    postalCode:  "",
    notes:       "",
    saveAddress: false,
  });

  // UI state
  const [errors,        setErrors]        = useState({});
  const [payment,       setPayment]       = useState("cod");
  const [btnState,      setBtnState]      = useState("idle"); // idle | loading | success
  const [orderSuccess,  setOrderSuccess]  = useState(false);
  const [orderId,       setOrderId]       = useState("");

  // Price calculations
  const subtotal = ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_CHARGE;
  const total    = subtotal + delivery;
  const totalQty = ORDER_ITEMS.reduce((sum, item) => sum + item.qty, 0);

  // ── Handle field change ──
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Validate form ──
  const validate = () => {
    const e = {};
    if (!form.fullName.trim())   e.fullName   = "Full name is required";
    if (!form.email.trim())                     e.email      = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email      = "Enter a valid email";
    if (!form.phone.trim())      e.phone      = "Phone number is required";
    if (!form.address.trim())    e.address    = "Address is required";
    if (!form.city.trim())       e.city       = "City is required";
    if (!form.postalCode.trim()) e.postalCode = "Postal code is required";
    return e;
  };

  // ── Place order ──
  const handlePlaceOrder = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top of form
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    setBtnState("loading");

    // Simulate API call
    setTimeout(() => {
      const id = genOrderId();
      setOrderId(id);
      setBtnState("success");
      setOrderSuccess(true);
      console.log("Order placed:", { form, payment, items: ORDER_ITEMS, total, orderId: id });
    }, 1800);
  };

  // ── Reusable field renderer ──
  const renderField = ({ id, label, name, type = "text", placeholder, icon, span = false }) => (
    <div className="co-field" style={span ? { gridColumn: "1 / -1" } : {}}>
      <label className="co-label" htmlFor={id}>{label}</label>
      <div className="co-input-wrap">
        <svg className="co-input-icon" viewBox="0 0 24 24" fill="none"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
        <input
          className={`co-input ${errors[name] ? "error" : ""}`}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      {errors[name] && (
        <span className="co-error-msg">⚠ {errors[name]}</span>
      )}
    </div>
  );

  return (
    <>
      <Navbar />

      <div className="co-page">

        {/* ── Hero ── */}
        <div className="co-hero">
          <span className="co-hero-tag">Final Step</span>
          <h1 className="co-hero-title">
            Secure <span>Checkout</span>
          </h1>
          <p className="co-hero-sub">
            Complete your order details below
          </p>
        </div>

        {/* ── Progress Steps ── */}
        <div className="co-steps">
          <div className="co-step done">
            <span className="co-step-num">✓</span>
            Cart
          </div>
          <div className="co-step-line" />
          <div className="co-step active">
            <span className="co-step-num">2</span>
            Checkout
          </div>
          <div className="co-step-line" />
          <div className="co-step">
            <span className="co-step-num">3</span>
            Confirmation
          </div>
        </div>

        {/* ── Body ── */}
        <div className="co-body">

          {/* ════ LEFT — FORM ════ */}
          <div className="co-form-section">

            {/* ── Personal Info ── */}
            <div className="co-card" style={{ animationDelay: "0s" }}>
              <div className="co-card-title">
                <div className="co-card-title-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                Personal Information
              </div>

              <div className="co-form">
                {renderField({
                  id: "fullName", label: "Full Name", name: "fullName",
                  placeholder: "Your full name",
                  icon: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
                })}

                <div className="co-form-row">
                  {renderField({
                    id: "email", label: "Email Address", name: "email", type: "email",
                    placeholder: "your@email.com",
                    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
                  })}
                  {renderField({
                    id: "phone", label: "Phone Number", name: "phone", type: "tel",
                    placeholder: "+92 300 0000000",
                    icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.37 10.8 19.79 19.79 0 01.3 2.18 2 2 0 012.28.01h3a2 2 0 012 1.72c.12.97.36 1.92.7 2.84a2 2 0 01-.45 2.11L6.17 7.63A16 16 0 0013 14.46l.88-.88a2 2 0 012.11-.45c.92.34 1.87.58 2.84.7a2 2 0 011.72 2.09z"/>,
                  })}
                </div>
              </div>
            </div>

            {/* ── Delivery Address ── */}
            <div className="co-card" style={{ animationDelay: "0.08s" }}>
              <div className="co-card-title">
                <div className="co-card-title-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                Delivery Address
              </div>

              <div className="co-form">
                {renderField({
                  id: "address", label: "Full Address", name: "address",
                  placeholder: "House/Flat no., Street, Area",
                  span: true,
                  icon: <><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
                })}

                <div className="co-form-row">
                  {renderField({
                    id: "city", label: "City", name: "city",
                    placeholder: "e.g. Gujranwala",
                    icon: <><rect x="3" y="9" width="18" height="11" rx="2"/><path d="M9 9V6a3 3 0 016 0v3"/></>,
                  })}
                  {renderField({
                    id: "postalCode", label: "Postal Code", name: "postalCode",
                    placeholder: "52250",
                    icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4"/><polyline points="2,8 12,13 22,8"/></>,
                  })}
                </div>

                {/* Notes */}
                <div className="co-field">
                  <label className="co-label" htmlFor="notes">
                    Order Notes <span style={{ color: "#bbb", fontWeight: 300 }}>(Optional)</span>
                  </label>
                  <div className="co-input-wrap">
                    <svg className="co-input-icon" viewBox="0 0 24 24" fill="none"
                      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                      style={{ top: "14px", alignSelf: "flex-start" }}>
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    <textarea
                      className="co-textarea"
                      id="notes"
                      name="notes"
                      placeholder="Any special delivery instructions..."
                      value={form.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Save address checkbox */}
                <label className="co-checkbox-row">
                  <input
                    type="checkbox"
                    name="saveAddress"
                    checked={form.saveAddress}
                    onChange={handleChange}
                  />
                  <span className="co-checkbox-label">
                    Save this address for future orders
                  </span>
                </label>
              </div>
            </div>

            {/* ── Payment Method ── */}
            <div className="co-card" style={{ animationDelay: "0.14s" }}>
              <div className="co-card-title">
                <div className="co-card-title-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                Payment Method
              </div>

              <div className="co-payment-options">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={`co-payment-card ${payment === method.id ? "selected" : ""}`}
                    onClick={() => setPayment(method.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setPayment(method.id)}
                  >
                    {/* Custom radio */}
                    <div className="co-radio-dot">
                      <div className="co-radio-fill" />
                    </div>

                    {/* Icon */}
                    <div className={`co-payment-icon ${method.iconClass}`}>
                      {method.icon}
                    </div>

                    {/* Text */}
                    <div className="co-payment-text">
                      <span className="co-payment-name">{method.name}</span>
                      <span className="co-payment-desc">{method.desc}</span>
                    </div>

                    {/* Recommended badge */}
                    {method.recommended && (
                      <span className="co-payment-rec">Recommended</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ════ RIGHT — ORDER SUMMARY ════ */}
          <div className="co-summary">

            {/* Header */}
            <div className="co-summary-header">
              <div className="co-summary-title">Order Summary</div>
              <div className="co-summary-count">
                {totalQty} item{totalQty > 1 ? "s" : ""}
              </div>
            </div>

            {/* Items list */}
            <div className="co-summary-items">
              {ORDER_ITEMS.map((item) => (
                <div className="co-summary-item" key={item.id}>
                  <img
                    className="co-summary-item-img"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />
                  <div className="co-summary-item-info">
                    <span className="co-summary-item-name">{item.name}</span>
                    <span className="co-summary-item-qty">Qty: {item.qty}</span>
                  </div>
                  <span className="co-summary-item-price">
                    {fmt(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="co-summary-breakdown">
              <div className="co-breakdown-row">
                <span className="bl">Subtotal</span>
                <span className="bv">{fmt(subtotal)}</span>
              </div>
              <div className="co-breakdown-row">
                <span className="bl">Delivery</span>
                <span className={`bv ${delivery === 0 ? "free" : ""}`}>
                  {delivery === 0 ? "FREE" : fmt(delivery)}
                </span>
              </div>
              <div className="co-breakdown-row">
                <span className="bl">Payment</span>
                <span className="bv">
                  {PAYMENT_METHODS.find((m) => m.id === payment)?.name}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="co-summary-total">
              <span className="co-total-label">Total</span>
              <span className="co-total-value">{fmt(total)}</span>
            </div>

            {/* Place Order button */}
            <button
              className={`co-place-order-btn ${btnState !== "idle" ? btnState : ""}`}
              onClick={handlePlaceOrder}
              disabled={btnState !== "idle"}
            >
              {btnState === "loading" ? (
                "Placing Order…"
              ) : btnState === "success" ? (
                "✓ Order Placed!"
              ) : (
                <>
                  Place Order
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="co-trust">
              <div className="co-trust-item">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Secure Checkout
              </div>
              <div className="co-trust-item">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Safe Payments
              </div>
              <div className="co-trust-item">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Data Protected
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />

      {/* ── Order Success Modal ── */}
      {orderSuccess && (
        <div className="co-success-overlay">
          <div className="co-success-modal">

            {/* Green checkmark */}
            <div className="co-success-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <h2 className="co-success-title">Order Placed! 🎉</h2>
            <p className="co-success-sub">
              Thank you, <strong>{form.fullName}</strong>!<br />
              Your order has been placed successfully.<br />
              We'll contact you at <strong>{form.phone}</strong> to confirm.
            </p>
            <div className="co-success-order-id">
              Order ID: <span>{orderId}</span>
            </div>

            <button
              className="co-success-btn"
              onClick={() => {
                setOrderSuccess(false);
                navigate("/");
              }}
            >
              Back to Home
            </button>

          </div>
        </div>
      )}
    </>
  );
}