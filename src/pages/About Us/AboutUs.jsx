import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./AboutUs.css";

// ─────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────

const WHY_CARDS = [
  { icon: "✅", title: "Trusted Products", desc: "Every product is carefully verified for quality and authenticity before listing on our store." },
  { icon: "🚚", title: "Fast Delivery", desc: "We deliver across Pakistan in 2–4 business days with reliable courier partners." },
  { icon: "🔒", title: "Secure Shopping", desc: "Your data and payments are 100% protected with secure and encrypted transactions." },
  { icon: "💬", title: "Customer Support", desc: "Our team is available 24/7 to help you with any questions or concerns." },
];

const STATS = [
  { icon: "😊", num: "500", suffix: "+", label: "Happy Customers" },
  { icon: "📦", num: "1000", suffix: "+", label: "Orders Completed" },
  { icon: "🛍️", num: "50", suffix: "+", label: "Products Listed" },
  { icon: "⏰", num: "24", suffix: "/7", label: "Customer Support" },
];

const MISSION_POINTS = [
  "Provide high-quality products at affordable prices",
  "Ensure a smooth and enjoyable shopping experience",
  "Build long-term customer relationships based on trust",
];

const VISION_POINTS = [
  "Become Pakistan's most trusted online store",
  "Expand product range across all major categories",
  "Deliver excellence in every order, every time",
];

const TEAM = [
  { initials: "UE", name: "Universal Edge", role: "Founder & CEO", bio: "Passionate entrepreneur focused on building a trusted e-commerce brand for Pakistani shoppers." },
  { initials: "OP", name: "Operations Team", role: "Fulfillment & Logistics", bio: "Dedicated to making sure every order is packed, shipped, and delivered with care and precision." },
  { initials: "CS", name: "Support Team", role: "Customer Relations", bio: "Always here to help — from pre-purchase questions to after-sale support, we've got you covered." },
];

const STORY_POINTS = [
  "Products sourced from trusted local & verified suppliers",
  "Focused on quality, affordability, and fast delivery",
  "Serving customers across all major cities in Pakistan",
  "Growing every day with your trust and support",
];

// ─────────────────────────────────────────────────────────────
//  ANIMATED COUNTER HOOK
// ─────────────────────────────────────────────────────────────
function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const num = parseInt(target, 10);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * num));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

// Single animated stat
function StatCard({ icon, num, suffix, label }) {
  const ref = useRef(null);
  const [go, setGo] = useState(false);
  const count = useCounter(num, 1600, go);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setGo(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="about-stat-card" ref={ref}>
      <span className="about-stat-icon">{icon}</span>
      <span className="about-stat-num">
        {count}<span>{suffix}</span>
      </span>
      <span className="about-stat-label">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ABOUT PAGE COMPONENT
// ─────────────────────────────────────────────────────────────
export default function About() {
  const navigate = useNavigate();

  return (
    <>
        <Navbar />

        <div className="about-page">

          {/* ══════════════════════════════════════════
            1. HERO
        ══════════════════════════════════════════ */}
          <section className="about-hero">
            <div className="about-hero-bg" />
            <div className="about-hero-overlay" />

            <div className="about-hero-content">
              <span className="about-hero-tag">Our Story</span>

              <h1 className="about-hero-title">
                About <span>Universal Edge</span>
              </h1>

              <p className="about-hero-desc">
                Your trusted destination for quality products, modern shopping,
                and reliable service — all in one place.
              </p>

              {/* Trust badges */}
              <div className="about-hero-badges">
                <div className="about-hero-badge"><span>✅</span> Trusted Store</div>
                <div className="about-hero-badge"><span>🚚</span> Fast Delivery</div>
                <div className="about-hero-badge"><span>🔒</span> Secure Payments</div>
                <div className="about-hero-badge"><span>💬</span> 24/7 Support</div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
            2. BRAND STORY
        ══════════════════════════════════════════ */}
          <section className="about-story">
            <div className="about-story-inner">

              {/* Image with floating card */}
              <div className="about-story-img-wrap">
                <img
                  className="about-story-img"
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80"
                  alt="Universal Edge Store"
                  loading="lazy"
                />
                {/* Floating stat card */}
                <div className="about-story-float">
                  <span className="about-story-float-num">500+</span>
                  <span className="about-story-float-label">Happy Customers</span>
                </div>
              </div>

              {/* Text */}
              <div className="about-story-text">
                <span className="about-section-tag">Who We Are</span>
                <h2 className="about-section-title">
                  Built on <span>Trust</span> &amp; Quality
                </h2>
                <div className="about-section-divider" style={{ marginBottom: "22px" }} />

                <p className="about-story-para">
                  Universal Edge is a modern online shopping platform founded with
                  one simple mission — to give every customer access to premium
                  quality products at fair prices, delivered right to their doorstep.
                </p>
                <p className="about-story-para">
                  We source our products from verified and trusted local suppliers,
                  carefully selecting each item to meet our quality standards. From
                  fashion and footwear to perfumes and accessories — we have it all.
                </p>

                {/* Bullet points */}
                <ul className="about-story-bullets">
                  {STORY_POINTS.map((point, i) => (
                    <li className="about-story-bullet" key={i}>
                      <span className="bullet-dot"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </section>

          {/* ══════════════════════════════════════════
            3. MISSION & VISION
        ══════════════════════════════════════════ */}
          <section className="about-mv">
            <div className="about-mv-inner">

              <div className="about-mv-header">
                <span className="about-section-tag">What Drives Us</span>
                <h2 className="about-section-title">
                  Mission &amp; <span>Vision</span>
                </h2>
                <div className="about-section-divider" style={{ margin: "0 auto 22px" }} />
              </div>

              <div className="about-mv-grid">

                {/* Mission Card */}
                <div className="about-mv-card">
                  <div className="about-mv-card-icon">🎯</div>
                  <h3 className="about-mv-card-title">Our Mission</h3>
                  <p className="about-mv-card-text">
                    To provide customers with a seamless, enjoyable, and trustworthy
                    shopping experience — offering quality products at prices that
                    make sense.
                  </p>
                  <ul className="about-mv-list">
                    {MISSION_POINTS.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>

                {/* Vision Card */}
                <div className="about-mv-card">
                  <div className="about-mv-card-icon">🚀</div>
                  <h3 className="about-mv-card-title">Our Vision</h3>
                  <p className="about-mv-card-text">
                    To become Pakistan's most loved and trusted online shopping
                    destination — a platform where quality, speed, and customer
                    happiness come first.
                  </p>
                  <ul className="about-mv-list">
                    {VISION_POINTS.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>

              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
            4. WHY CHOOSE US
        ══════════════════════════════════════════ */}
          <section className="about-why">
            <div className="about-why-inner">

              <div className="about-why-header">
                <span className="about-section-tag">Why Us</span>
                <h2 className="about-section-title">
                  Why Choose <span>Universal Edge</span>
                </h2>
                <div className="about-section-divider" style={{ margin: "0 auto 22px" }} />
              </div>

              <div className="about-why-grid">
                {WHY_CARDS.map((card) => (
                  <div className="about-why-card" key={card.title}>
                    <span className="about-why-card-icon">{card.icon}</span>
                    <h3 className="about-why-card-title">{card.title}</h3>
                    <p className="about-why-card-text">{card.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ══════════════════════════════════════════
            5. STATS / ACHIEVEMENTS
        ══════════════════════════════════════════ */}
          <section className="about-stats">
            <div className="about-stats-inner">
              {STATS.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════
            6. TEAM SECTION
        ══════════════════════════════════════════ */}
          <section className="about-team">
            <div className="about-team-inner">

              <div className="about-team-header">
                <span className="about-section-tag">The People</span>
                <h2 className="about-section-title">
                  Meet Our <span>Team</span>
                </h2>
                <div className="about-section-divider" style={{ margin: "0 auto 22px" }} />
              </div>

              <div className="about-team-grid">
                {TEAM.map((member) => (
                  <div className="about-team-card" key={member.name}>
                    <div className="about-team-avatar">{member.initials}</div>
                    <h3 className="about-team-name">{member.name}</h3>
                    <span className="about-team-role">{member.role}</span>
                    <p className="about-team-bio">{member.bio}</p>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ══════════════════════════════════════════
            7. CTA SECTION
        ══════════════════════════════════════════ */}
          <section className="about-cta">
            <div className="about-cta-inner">

              <h2 className="about-cta-title">
                Start Shopping with<br />
                <span>Universal Edge</span> Today
              </h2>

              <p className="about-cta-text">
                Join hundreds of happy customers who trust Universal Edge for
                quality products, fast delivery, and excellent service.
              </p>

              <div className="about-cta-btns">
                <Link to="/products" className="about-cta-btn-primary">
                  Explore Products
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <Link to="/#contact" className="about-cta-btn-secondary">
                  Contact Us
                </Link>
              </div>

            </div>
          </section>

        </div>

        <Footer />
    </>
  );
}