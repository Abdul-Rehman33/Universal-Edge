import { useState, useEffect } from "react";
import "./ScrollButton.css";

// ─────────────────────────────────────────────────────────────
//  FLOATING SCROLL TO TOP BUTTON
//  Jab user 200px niche scroll karega tab button dikhega
//  Click karo → page top pe smoothly scroll hoga
// ─────────────────────────────────────────────────────────────
export default function ScrollButton() {
  const [visible, setVisible] = useState(false);

  // Jab user 200px niche scroll karega, tab button dikhega
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`scroll-btn ${visible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  );
}