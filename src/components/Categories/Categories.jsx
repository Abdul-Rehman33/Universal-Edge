import { useState } from "react";
import "./Categories.css";

// ─────────────────────────────────────────────────────────────
//  CATEGORIES DATA
//  To use your own images:
//  1. Add images to src/assets/
//  2. Import them: import shoesImg from "../assets/shoes.jpg"
//  3. Replace the `image` URL below with the imported variable
// ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 1,
    name: "Shoes",
    icon: "👟",
    count: "120+ Products",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    href: "#shoes",
  },
  {
    id: 2,
    name: "Perfumes",
    icon: "🌸",
    count: "85+ Products",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80",
    href: "#perfumes",
  },
  {
    id: 3,
    name: "Clothing",
    icon: "👕",
    count: "200+ Products",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80",
    href: "#clothing",
  },
  {
    id: 4,
    name: "Accessories",
    icon: "⌚",
    count: "60+ Products",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    href: "#accessories",
  },
];

// ─────────────────────────────────────────────────────────────
//  CATEGORIES COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Categories() {
  // Track which card is hovered (to apply hover styles)
  const [hoveredId, setHoveredId] = useState(null);

  // Handle card click
  const handleCardClick = (category) => {
    console.log(`Navigating to: ${category.name}`);
    // Later: use navigate(category.href) with React Router
  };

  return (
    <section className="categories-section">

      {/* ── Section Header ── */}
      <div className="categories-header">
        <span className="categories-tag">Our Collections</span>
        <h2 className="categories-title">
          Shop by <span>Categories</span>
        </h2>
        <div className="categories-divider" />
      </div>

      {/* ── Categories Grid ── */}
      <div className="categories-grid">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => handleCardClick(cat)}
            onMouseEnter={() => setHoveredId(cat.id)}
            onMouseLeave={() => setHoveredId(null)}
            role="button"
            tabIndex={0}
            aria-label={`Browse ${cat.name}`}
            // Keyboard support
            onKeyDown={(e) => e.key === "Enter" && handleCardClick(cat)}
          >
            {/* Background Image */}
            <img
              className="card-image"
              src={cat.image}
              alt={cat.name}
              loading="lazy"
            />

            {/* Dark Gradient Overlay */}
            <div className="card-overlay" />

            {/* Arrow icon (top right, shows on hover) */}
            <div className="card-arrow">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>

            {/* Card Text (bottom) */}
            <div className="card-content">
              <span className="card-icon">{cat.icon}</span>
              <span className="card-name">{cat.name}</span>
              <span className="card-count">{cat.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── View All Button ── */}
      <div className="categories-footer">
        <button className="view-all-btn">
          View All Categories
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

    </section>
  );
}