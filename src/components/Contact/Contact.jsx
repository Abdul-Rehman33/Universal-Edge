import { useState } from "react";
import "./Contact.css";

// ─────────────────────────────────────────────────────────────
//  CONTACT INFO DATA — edit your details here
// ─────────────────────────────────────────────────────────────
const CONTACT_INFO = [
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
      // WhatsApp icon (custom SVG path)
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────
//  CONTACT COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Contact() {
  // Form field state
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Track if form was submitted successfully
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  // Update field on change
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending (replace with real API call later)
    setTimeout(() => {
      console.log("Form submitted:", form);
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <section className="contact-section" id="contact">

      {/* ── Section Header ── */}
      <div className="contact-header">
        <span className="contact-tag">Reach Out</span>
        <h2 className="contact-title">
          Get In <span>Touch</span>
        </h2>
        <p className="contact-subtitle">
          Have questions or business inquiries? Feel free to contact us anytime.
        </p>
        <div className="contact-divider" />
      </div>

      {/* ── Two Column Body ── */}
      <div className="contact-body">

        {/* ══ LEFT — Info Card ══ */}
        <div className="contact-info-card">
          <span className="info-card-tag">Contact Info</span>
          <h3 className="info-card-title">Let's talk about your needs</h3>
          <p className="info-card-desc">
            We're here to help and answer any question you might have.
            We look forward to hearing from you.
          </p>

          {/* Contact Details */}
          <div className="info-items">
            {CONTACT_INFO.map((item) => (
              <div className="info-item" key={item.id}>
                <div className="info-icon-box">
                  {item.icon}
                </div>
                <div className="info-text-wrap">
                  <span className="info-label">{item.label}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="info-value"
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="info-value">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <span className="info-social-label">Follow Us</span>
          <div className="info-social-links">

            {/* Instagram */}
            <a href="#" className="social-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>

            {/* Facebook */}
            <a href="#" className="social-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a href="#" className="social-btn" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/923045528850"
              className="social-btn"
              aria-label="WhatsApp"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </a>

          </div>
        </div>

        {/* ══ RIGHT — Form Card ══ */}
        <div className="contact-form-card">
          <h3 className="form-title">Send a Message</h3>
          <p className="form-subtitle">We'll get back to you within 24 hours.</p>

          {/* Show success message after submit */}
          {submitted ? (
            <div className="form-success">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="success-title">Message Sent!</p>
              <p className="success-text">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>

              {/* Row 1: Name + Email */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <input
                    className="form-input"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    className="form-input"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subject</label>
                <input
                  className="form-input"
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label" htmlFor="message">Message</label>
                <textarea
                  className="form-textarea"
                  id="message"
                  name="message"
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`submit-btn ${loading ? "sent" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  "Sending…"
                ) : (
                  <>
                    Send Message
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}