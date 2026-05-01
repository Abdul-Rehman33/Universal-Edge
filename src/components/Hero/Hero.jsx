import { useState, useEffect, useCallback } from "react";
import "./Hero.css";

// ─────────────────────────────────────────────────────────────
//  SLIDE DATA
//  Replace the `image` URLs with your own images from /assets
//  Example: import img1 from "../assets/slide1.jpg"
//  then use  image: img1
// ─────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 1,
    // Using high quality Unsplash images as placeholders
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    category: "New Arrivals",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80",
    category: "Premium Watches",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1600&q=80",
    category: "Latest Fashion",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4f2b?w=1600&q=80",
    category: "Luxury Perfumes",
  },
];

// Auto-slide interval in milliseconds
const AUTO_SLIDE_INTERVAL = 4500;

// ─────────────────────────────────────────────────────────────
//  HERO COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Hero() {
  const [current, setCurrent] = useState(0);  // which slide is active
  const [paused,  setPaused]  = useState(false); // pause on hover

  // Go to next slide
  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  // Go to previous slide
  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-slide timer
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer); // cleanup on unmount
  }, [paused, nextSlide]);

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}   // pause on hover
      onMouseLeave={() => setPaused(false)}  // resume on leave
    >

      {/* ── Background Image Slides ── */}
      <div className="hero-slides">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
      </div>

      {/* ── Dark Overlay ── */}
      <div className="hero-overlay" />

      {/* ── Slide Counter (top right) ── */}
      <div className="hero-counter">
        <span>{String(current + 1).padStart(2, "0")}</span>
        {" / "}
        {String(SLIDES.length).padStart(2, "0")}
      </div>

      {/* ── Main Text Content ── */}
      <div className="hero-content">

        {/* Small badge above heading */}
        <span className="hero-badge">
          {SLIDES[current].category}
        </span>

        {/* Main heading */}
        <h1 className="hero-heading">
          Welcome to <span>Universal Edge</span>
        </h1>

        {/* Subheading */}
        <p className="hero-subheading">
          Best Deals on Perfumes, Shoes &amp; Clothing
        </p>

        {/* Shop Now button */}
        <div className="hero-btn-wrap">
          <button className="button-89" role="button">
            Shop Now
          </button>
        </div>

      </div>

      {/* ── Left Arrow ── */}
      <button
        className="hero-arrow prev"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* ── Right Arrow ── */}
      <button
        className="hero-arrow next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Dot Indicators ── */}
      <div className="hero-dots">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* ── Scroll Hint (bottom right) ── */}
      <div className="hero-scroll-hint">
        <span className="scroll-line" />
        <span>Scroll</span>
      </div>

    </section>
  );
}