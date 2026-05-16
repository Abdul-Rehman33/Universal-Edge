import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/Logo.png";

import "./NotFound.css";

// ─────────────────────────────────────────────────────────────
//  QUICK LINKS
// ─────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: "Home", emoji: "🏠", href: "/" },
  { label: "Products", emoji: "🛍️", href: "/products" },
  { label: "About Us", emoji: "💡", href: "/about" },
  { label: "Contact", emoji: "📩", href: "/#contact" },
  { label: "Cart", emoji: "🛒", href: "/cart" },
];

// Floating particles config
const PARTICLES = [
  { size: 6, left: "10%", delay: "0s", duration: "12s" },
  { size: 4, left: "25%", delay: "2s", duration: "9s" },
  { size: 8, left: "45%", delay: "1s", duration: "14s" },
  { size: 5, left: "65%", delay: "3.5s", duration: "11s" },
  { size: 10, left: "80%", delay: "0.5s", duration: "16s" },
  { size: 4, left: "90%", delay: "2.5s", duration: "10s" },
];

// ─────────────────────────────────────────────────────────────
//  NOT FOUND PAGE COMPONENT
// ─────────────────────────────────────────────────────────────
export default function NotFound() {
  const navigate = useNavigate();

  return (
      <div className="notfound-page">

        {/* ── Floating background particles ── */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="notfound-particle"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              bottom: "-20px",
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}

        {/* ── Logo ── */}
        <Link to="/" className="notfound-logo">
          <span className="notfound-logo-icon">
            <img src={logo} alt="Universal Edge Mart" className="notfound-logo-img" />
          </span>
          <span className="notfound-logo-name">
            Universal <span>Edge</span>
          </span>
        </Link>

        {/* ── Big 404 Number ── */}
        <div className="notfound-number">
          <span className="notfound-big">404</span>
        </div>

        {/* ── Main Content ── */}
        <div className="notfound-content">
          <span className="notfound-tag">Page Not Found</span>

          <h1 className="notfound-title">
            Oops! You've hit a <span>Dead End</span>
          </h1>

          <p className="notfound-desc">
            The page you're looking for doesn't exist, has been moved,
            or the URL is incorrect. Don't worry — let's get you back
            on track!
          </p>
        </div>

        {/* ── Action Buttons ── */}
        <div className="notfound-btns">
          <Link to="/" className="notfound-btn-primary">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </Link>

          <button
            className="notfound-btn-secondary"
            onClick={() => navigate(-1)}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Go Back
          </button>
        </div>

        {/* ── Quick Navigation Links ── */}
        <span className="notfound-links-label">Or explore these pages</span>

        <div className="notfound-quick-links">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="notfound-quick-link"
            >
              <span>{link.emoji}</span>
              {link.label}
            </Link>
          ))}
        </div>

      </div>

  );
}