import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../../assets/Logo.png";

// ─────────────────────────────────────────────────────────────
//  QUICK LINKS DATA
// ─────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: "Home",        href: "/" },
  { label: "Products",    href: "/products" },
  { label: "Categories",  href: "/#categories" },
  { label: "About Us",    href: "/about" },
  { label: "Contact Us",  href: "/#contact" },
];

// ─────────────────────────────────────────────────────────────
//  CONTACT INFO DATA
// ─────────────────────────────────────────────────────────────
const CONTACT_ITEMS = [
  {
    id: 1,
    label: "Address",
    value: "Gujranwala, Punjab, Pakistan",
    href: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    id: 2,
    label: "Email",
    value: "contact@universaledge.pk",
    href: "mailto:contact@universaledge.pk",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    id: 3,
    label: "Phone",
    value: "+92 304-5528850",
    href: "tel:+923045528850",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.37 10.8 19.79 19.79 0 01.3 2.18 2 2 0 012.28.01h3a2 2 0 012 1.72c.12.97.36 1.92.7 2.84a2 2 0 01-.45 2.11L6.17 7.63A16 16 0 0013 14.46l.88-.88a2 2 0 012.11-.45c.92.34 1.87.58 2.84.7a2 2 0 011.72 2.09z" />
      </svg>
    ),
  },
  {
    id: 4,
    label: "WhatsApp",
    value: "+92 304-5528850",
    href: "https://wa.me/923045528850",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────
//  SOCIAL LINKS DATA
// ─────────────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  {
    id: 1,
    name: "Facebook",
    handle: "@universaledge",
    href: "#",
    colorClass: "fb",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Instagram",
    handle: "@universaledge.pk",
    href: "#",
    colorClass: "ig",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth="0" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "TikTok",
    handle: "@universaledge",
    href: "#",
    colorClass: "tiktok",
    icon: (
      // TikTok icon
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────
//  FOOTER COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Footer() {
  const [email,      setEmail]      = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Handle newsletter subscribe
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    console.log("Newsletter subscribed:", email);
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="footer">

      {/* ── Main Footer Grid ── */}
      <div className="footer-body">

        {/* ══ Column 1 — Brand ══ */}
        <div className="footer-brand">

          {/* Logo */}
          <a href="#" className="footer-logo">
            <img src={logo} alt="Universal Edge Logo" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
            <span className="footer-logo-name">
              Universal <span>Edge</span>
            </span>
          </a>

          {/* Brand Description */}
          <p className="footer-brand-desc">
            Your one-stop online shopping destination for fashion, perfumes,
            shoes, and more. Premium quality, unbeatable prices.
          </p>

          {/* Newsletter */}
          <span className="footer-newsletter-label">Stay Updated</span>
          <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              className="footer-newsletter-input"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className={`footer-newsletter-btn ${subscribed ? "subscribed" : ""}`}
            >
              {subscribed ? "✓ Done" : "Subscribe"}
            </button>
          </form>

        </div>

        {/* ══ Column 2 — Quick Links ══ */}
        <div className="footer-quick-links">
          <h4 className="footer-col-title">Quick Links</h4>
          <ul className="footer-links">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ══ Column 3 — Contact Info ══ */}
        <div className="footer-contact">
          <h4 className="footer-col-title">Contact Us</h4>
          <div className="footer-contact-items">
            {CONTACT_ITEMS.map((item) =>
              item.href ? (
                // Clickable items (email, phone, whatsapp)
                <a
                  key={item.id}
                  href={item.href}
                  className="footer-contact-item"
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  <span className="footer-contact-icon">{item.icon}</span>
                  <span className="footer-contact-text">
                    <span className="footer-contact-label">{item.label}</span>
                    <span className="footer-contact-value">{item.value}</span>
                  </span>
                </a>
              ) : (
                // Non-clickable items (address)
                <div key={item.id} className="footer-contact-item">
                  <span className="footer-contact-icon">{item.icon}</span>
                  <span className="footer-contact-text">
                    <span className="footer-contact-label">{item.label}</span>
                    <span className="footer-contact-value">{item.value}</span>
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* ══ Column 4 — Social Media ══ */}
        <div className="footer-social">
          <h4 className="footer-col-title">Follow Us</h4>
          <div className="footer-social-grid">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.id}
                href={s.href}
                className="footer-social-btn"
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
              >
                <span className={`social-icon-wrap ${s.colorClass}`}>
                  {s.icon}
                </span>
                <span className="social-btn-text">
                  <span className="social-btn-name">{s.name}</span>
                  <span className="social-btn-handle">{s.handle}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* ── Divider ── */}
      <div className="footer-divider" />

      {/* ── Bottom Bar ── */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2026 <span>Universal Edge</span>. All Rights Reserved.
        </p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Refund Policy</a>
        </div>
      </div>

    </footer>
  );
}