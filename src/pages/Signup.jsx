import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import Logo from "../assets/Logo.png"

// ─────────────────────────────────────────────────────────────
//  SIGNUP PAGE
// ─────────────────────────────────────────────────────────────
export default function Signup() {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    firstName:       "",
    lastName:        "",
    email:           "",
    phone:           "",
    password:        "",
    confirmPassword: "",
  });

  // UI state
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading,             setLoading]             = useState(false);
  const [errors,              setErrors]              = useState({});

  // Update a field
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  // Validation
  const validate = () => {
    const e = {};
    if (!form.firstName)   e.firstName = "First name required";
    if (!form.lastName)    e.lastName  = "Last name required";
    if (!form.email)                           e.email    = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email    = "Invalid email";
    if (!form.phone)                           e.phone    = "Phone required";
    else if (!/^[0-9+\-\s]{10,15}$/.test(form.phone)) e.phone = "Invalid phone number";
    if (!form.password)                        e.password = "Password required";
    else if (form.password.length < 6)         e.password = "Min 6 characters";
    if (!form.confirmPassword)                         e.confirmPassword = "Please confirm password";
    else if (form.password !== form.confirmPassword)   e.confirmPassword = "Passwords do not match";
    return e;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      console.log("Signup:", form);
      setLoading(false);
      navigate("/login");
    }, 1500);
  };

  // Reusable input field renderer
  const renderInput = ({
    id, label, name, type = "text", placeholder,
    icon, hasToggle, toggleValue, onToggle, autoComplete,
  }) => (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        {/* Left icon */}
        <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>

        <input
          className={`auth-input ${errors[name] ? "error" : ""}`}
          id={id}
          name={name}
          type={hasToggle ? (toggleValue ? "text" : "password") : type}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          autoComplete={autoComplete}
        />

        {/* Eye toggle for password fields */}
        {hasToggle && (
          <button
            type="button"
            className="auth-eye-btn"
            onClick={onToggle}
            aria-label={toggleValue ? "Hide" : "Show"}
          >
            {toggleValue ? (
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {errors[name] && (
        <span className="auth-error-msg">⚠ {errors[name]}</span>
      )}
    </div>
  );

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

          {/* Illustration */}
          <div className="auth-panel-img">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>

          <h2 className="auth-panel-title">
            Join <span>Universal Edge</span>
          </h2>
          <p className="auth-panel-desc">
            Create your free account and start shopping premium fashion,
            perfumes, shoes and accessories.
          </p>

          {/* Dots */}
          <div className="auth-panel-dots">
            <div className="auth-panel-dot" />
            <div className="auth-panel-dot active" />
            <div className="auth-panel-dot" />
          </div>

        </div>
      </div>

      {/* ══ RIGHT PANEL — FORM ══ */}
      <div className="auth-right">

        {/* Header */}
        <div className="auth-form-header">
          <span className="auth-form-tag">Get Started</span>
          <h1 className="auth-form-title">Create your<br />account</h1>
          <p className="auth-form-subtitle">
            Fill in your details below to create a free account.
          </p>
        </div>

        {/* Social buttons */}
        <div className="auth-social-btns" style={{ width: "100%", marginBottom: "20px" }}>
          <button className="auth-social-btn">
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
        </div>

        {/* Divider */}
        <div className="auth-divider" style={{ width: "100%", marginBottom: "20px" }}>
          <div className="auth-divider-line" />
          <span className="auth-divider-text">or sign up with email</span>
          <div className="auth-divider-line" />
        </div>

        {/* Signup Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* First Name + Last Name */}
          <div className="auth-form-row">
            {renderInput({
              id: "firstName", label: "First Name", name: "firstName",
              placeholder: "John", autoComplete: "given-name",
              icon: <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>,
            })}
            {renderInput({
              id: "lastName", label: "Last Name", name: "lastName",
              placeholder: "Doe", autoComplete: "family-name",
              icon: <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>,
            })}
          </div>

          {/* Email */}
          {renderInput({
            id: "email", label: "Email Address", name: "email",
            type: "email", placeholder: "your@email.com", autoComplete: "email",
            icon: (
              <>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </>
            ),
          })}

          {/* Phone */}
          {renderInput({
            id: "phone", label: "Phone Number", name: "phone",
            type: "tel", placeholder: "+92 300 0000000", autoComplete: "tel",
            icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.37 10.8 19.79 19.79 0 01.3 2.18 2 2 0 012.28.01h3a2 2 0 012 1.72c.12.97.36 1.92.7 2.84a2 2 0 01-.45 2.11L6.17 7.63A16 16 0 0013 14.46l.88-.88a2 2 0 012.11-.45c.92.34 1.87.58 2.84.7a2 2 0 011.72 2.09z"/>,
          })}

          {/* Password */}
          {renderInput({
            id: "password", label: "Password", name: "password",
            placeholder: "Min 6 characters", autoComplete: "new-password",
            hasToggle: true, toggleValue: showPassword,
            onToggle: () => setShowPassword((p) => !p),
            icon: (
              <>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </>
            ),
          })}

          {/* Confirm Password */}
          {renderInput({
            id: "confirmPassword", label: "Confirm Password", name: "confirmPassword",
            placeholder: "Re-enter your password", autoComplete: "new-password",
            hasToggle: true, toggleValue: showConfirmPassword,
            onToggle: () => setShowConfirmPassword((p) => !p),
            icon: (
              <>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </>
            ),
          })}

          {/* Submit button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            style={{ marginTop: "6px" }}
          >
            {loading ? (
              "Creating Account…"
            ) : (
              <>
                Create Account
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>

        </form>

        {/* Switch to Login */}
        <p className="auth-switch" style={{ marginTop: "24px" }}>
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>

      </div>
    </div>
  );
}