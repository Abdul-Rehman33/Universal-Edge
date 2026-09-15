// ============================================================
//  Universal Edge — Admin Middleware
//  File: middleware/adminMiddleware.js
//  Kaam: Sirf admin users ko allow karo
// ============================================================

const User = require("../models/User");

// ─────────────────────────────────────────────────────────────
//  ADMIN MIDDLEWARE
//
//  Yeh middleware hamesha "protect" ke BAAD lagao
//  protect  → JWT verify karta hai → req.user set karta hai
//  isAdmin  → role check karta hai → sirf admin allow karta hai
//
//  Usage in routes:
//  router.get("/test", protect, isAdmin, controller);
// ─────────────────────────────────────────────────────────────
const isAdmin = async (req, res, next) => {
  try {
    // ── req.user protect middleware ne set kiya hoga ───────
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please login first.",
      });
    }

    // ── Database se FRESH user lo ──────────────────────────
    // IMPORTANT: Frontend se role trust mat karo
    // Hamesha database se current role check karo
    // Agar kisi ne database mein role change ki toh
    // purana token kaam nahi karega
    const user = await User.findById(req.user._id).select("role email firstName");

    // ── User exist karta hai? ──────────────────────────────
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists. Please login again.",
      });
    }

    // ── Role check karo ────────────────────────────────────
    // Sirf database se check karo — frontend pe trust nahi
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // ── Admin hai — aage jao ───────────────────────────────
    next();

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during admin verification.",
    });
  }
};

module.exports = { isAdmin };