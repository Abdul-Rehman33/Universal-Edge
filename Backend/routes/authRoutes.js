// ============================================================
//  Universal Edge — Auth Routes
//  File: routes/authRoutes.js
// ============================================================

const express = require("express");
const router = express.Router();

// Controllers
const { register, login, googleAuth, getMe } = require("../controllers/authController");


// Middleware
const { protect } = require("../middleware/authMiddleware");

// ─────────────────────────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────────────────────────

router.post("/register", register);  // Public
router.post("/google", googleAuth);  // Google se login
router.post("/login",    login);     // Public
router.get ("/me",       protect, getMe); // Private — token chahiye

module.exports = router;