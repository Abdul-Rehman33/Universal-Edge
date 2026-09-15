// ============================================================
//  Universal Edge — Admin Routes
//  File: routes/adminRoutes.js
// ============================================================

const express = require("express");
const router  = express.Router();

// Controllers
const { testAdmin, getDashboardStats } = require("../controllers/adminController");

// Middleware
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// ─────────────────────────────────────────────────────────────
//  IMPORTANT:
//  Har route pe dono middleware lagate hain:
//  1. protect → JWT verify karo (Authentication)
//  2. isAdmin → role check karo  (Authorization)
//
//  Order matter karta hai:
//  protect pehle → isAdmin baad mein
// ─────────────────────────────────────────────────────────────

// Test route — admin access check karo
router.get("/test",      protect, isAdmin, testAdmin);

// Dashboard stats
router.get("/dashboard", protect, isAdmin, getDashboardStats);

module.exports = router;