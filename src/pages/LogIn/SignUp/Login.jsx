import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../Context/ToastContext.jsx";
import "./Auth.css";
import Logo from "../../../assets/Logo.png";

// ─────────────────────────────────────────────────────────────
//  LOGIN PAGE
// ─────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const { success, info, warning } = useToast();

  // Form state
  const [form, setForm] = useState({ email: "", password: "" });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [remember,     setRemember]     = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState({});

  // Update field
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  // Simple validation
  const validate = () => {
    const newErrors = {};
    if (!form.email)                          newErrors.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email  = "Enter a valid email";
    if (!form.password)                       newErrors.password = "Password is required";
    else if (form.password.length < 6)        newErrors.password = "Min 6 characters";
    return newErrors;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      success("Welcome back! 👋");
      navigate("/"); // redirect to home after login
    }, 1500);
  };

  return (
    <div className="auth-page">

      {/* ══ LEFT PANEL ══ */}
      <div className="auth-left">
        <div className="auth-left-inner">

          {/* Logo */}
          <Link to="/" className="auth-panel-logo">
            <img src={Logo} alt="Universal Edge Logo" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
            <span className="auth-panel-logo-name">
              Universal <span>Edge</span>
            </span>
          </Link>

          {/* Illustration circle */}
          <div className="auth-panel-img">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <h2 className="auth-panel-title">
            Welcome <span>Back!</span>
          </h2>
          <p className="auth-panel-desc">
            Login to access your orders, wishlist, and exclusive deals
            from Universal Edge Mart.
          </p>

          {/* Dots */}
          <div className="auth-panel-dots">
            <div className="auth-panel-dot active" />
            <div className="auth-panel-dot" />
            <div className="auth-panel-dot" />
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — FORM ══ */}
      <div className="auth-right">

        {/* Header */}
        <div className="auth-form-header">
          <span className="auth-form-tag">Welcome Back</span>
          <h1 className="auth-form-title">Login to your<br />account</h1>
          <p className="auth-form-subtitle">
            Enter your credentials to continue shopping.
          </p>
        </div>

        {/* Social login buttons */}
        <div className="auth-social-btns" style={{ width: "100%", marginBottom: "20px" }}>
          <button className="auth-social-btn">
            {/* Google icon */}
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button className="auth-social-btn">
            {/* Facebook icon */}
            <svg viewBox="0 0 24 24" fill="#1877F2" width="18" height="18">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="auth-divider" style={{ width: "100%", marginBottom: "20px" }}>
          <div className="auth-divider-line" />
          <span className="auth-divider-text">or login with email</span>
          <div className="auth-divider-line" />
        </div>

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email Address</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                className={`auth-input ${errors.email ? "error" : ""}`}
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="auth-error-msg">⚠ {errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <input
                className={`auth-input ${errors.password ? "error" : ""}`}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {/* Show/Hide toggle */}
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  // Eye icon
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="auth-error-msg">⚠ {errors.password}</span>
            )}
          </div>

          {/* Remember me + Forgot password */}
          <div className="auth-extras">
            <label className="auth-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="auth-remember-label">Remember me</span>
            </label>
            <a href="#" className="auth-forgot">Forgot Password?</a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              "Logging in…"
            ) : (
              <>
                Login to Account
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>

        </form>

        {/* Switch to Signup */}
        <p className="auth-switch" style={{ marginTop: "24px" }}>
          Don't have an account?{" "}
          <Link to="/signup">Create Account</Link>
        </p>

      </div>
    </div>
  );
}