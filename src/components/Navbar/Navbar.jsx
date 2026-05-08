import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/Logo.png";
import { useCart } from "../../Context/CartContext";

/* ── SVG Icons (inline, no library needed) ────────────── */

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

/* ── Nav Links data ───────────────────────────────────── */
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/#contact", className: "contact" },
];

/* ══════════════════════════════════════════════════════════
   Navbar Component
   ══════════════════════════════════════════════════════════ */
export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const drawerRef = useRef(null);
  const navigate = useNavigate();

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className={`uem-nav${scrolled ? " scrolled" : ""}`} role="navigation" aria-label="Main navigation">

        {/* Logo */}
        <Link to="/" className="uem-logo" aria-label="Universal Edge Mart — Home">
          <img src={logo} alt="Universal Edge Mart Logo" className="uem-logo-img" />
          <span className="uem-logo-text">Universal <span>Edge</span></span>
        </Link>

        {/* Center links — desktop only */}
        <ul className="uem-links" role="list">
          {NAV_LINKS.map(({ label, href, className }) => (
            <li key={label}>
              <Link to={href} className={className ?? ""}>{label}</Link>
            </li>
          ))}
        </ul>

        {/* Right — desktop only */}
        <div className="uem-right">
          <div className="uem-search" role="search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search…"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              aria-label="Search products"
            />
          </div>

          <button className="uem-icon-btn" aria-label={`Cart — ${totalItems} items`} onClick={() => navigate("/cart")}>
            <CartIcon />
            {totalItems > 0 && (
              <span className="uem-cart-badge" aria-hidden="true">{totalItems}</span>
            )}
          </button>

          <button className="uem-login-btn" onClick={() => navigate("/login")}>
            Login / Signup
          </button>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className={`uem-hamburger${menuOpen ? " open" : ""}`}
          onClick={openMenu}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="uem-drawer"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Spacer to push page content below fixed nav */}
      <div className="uem-nav-spacer" aria-hidden="true" />

      {/* ── Overlay ────────────────────────────────────── */}
      <div
        className={`uem-overlay${menuOpen ? " visible" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ──────────────────────────────── */}
      <aside
        id="uem-drawer"
        ref={drawerRef}
        className={`uem-drawer${menuOpen ? " open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {/* Drawer header */}
        <div className="uem-drawer-header">
          <Link to="/" className="uem-logo" onClick={closeMenu} aria-label="Home">
            <img src={logo} alt="Universal Edge Mart Logo" className="uem-logo-img" />
            <span className="uem-logo-text">Universal <span>Edge</span> Mart</span>
          </Link>
          <button className="uem-drawer-close" onClick={closeMenu} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        {/* Drawer search */}
        <div className="uem-drawer-search">
          <div className="uem-search" role="search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search products…"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              aria-label="Search products"
            />
          </div>
        </div>

        {/* Drawer links */}
        <ul className="uem-drawer-links" role="list">
          {NAV_LINKS.map(({ label, href, className }) => (
            <li key={label}>
              <Link to={href} className={className ?? ""} onClick={closeMenu}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Drawer bottom actions */}
        <div className="uem-drawer-actions">
          <Link to="/cart" className="uem-drawer-cart" onClick={closeMenu}>
            <CartIcon />
            My Cart
            {totalItems > 0 && (
              <span className="uem-cart-badge" style={{ position: "static", marginLeft: "auto" }}>
                {totalItems}
              </span>
            )}
          </Link>
          <button className="uem-login-btn-full" onClick={() => { closeMenu(); navigate("/login"); }}>
            Login / Signup
          </button>
        </div>
      </aside>
    </>
  );
}
