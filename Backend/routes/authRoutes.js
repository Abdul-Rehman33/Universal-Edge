// ============================================================
//  Universal Edge — Auth Routes
//  File: routes/authRoutes.js
// ============================================================

const express = require("express");
const router  = express.Router();

// Controllers
const { register, login, getMe } = require("../controllers/authController");

// Middleware
const { protect } = require("../middleware/authMiddleware");

// ─────────────────────────────────────────────────────────────
//  ROUTES
//
//  POST /api/auth/register  → Naya account banao
//  POST /api/auth/login     → Login karo
//  GET  /api/auth/me        → Apni info lo (login hona zaroori)
// ─────────────────────────────────────────────────────────────

router.post("/register", register);  // Public
router.post("/login",    login);     // Public
router.get ("/me",       protect, getMe); // Private — token chahiye

module.exports = router;