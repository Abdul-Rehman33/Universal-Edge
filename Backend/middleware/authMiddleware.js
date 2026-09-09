// ============================================================
//  Universal Edge — Auth Middleware
//  File: middleware/authMiddleware.js
//  Kaam: JWT token verify karo — private routes protect karo
// ============================================================

const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// ─────────────────────────────────────────────────────────────
//  PROTECT MIDDLEWARE
//  Private routes pe lagao — token verify karta hai
//  Token sahi ho toh req.user set karta hai
// ─────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token;

    // ── Token header se lo ────────────────────────────────
    // Frontend "Authorization: Bearer TOKEN" bhejta hai
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ── Token nahi hai? ───────────────────────────────────
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login first.",
      });
    }

    // ── Token verify karo ─────────────────────────────────
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ── User find karo token ki id se ─────────────────────
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    // ── req.user set karo — agle middleware/controller mein use hoga
    req.user = user;

    next(); // agle step pe jao

  } catch (error) {
    // Token invalid ya expire ho gaya
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  ADMIN MIDDLEWARE
//  Sirf admin access ke liye — protect ke baad lagao
// ─────────────────────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // admin hai — aage jao
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  EXPORT
// ─────────────────────────────────────────────────────────────
module.exports = { protect, adminOnly };