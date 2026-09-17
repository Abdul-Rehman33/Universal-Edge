// ============================================================
//  Universal Edge — Admin Routes
//  File: routes/adminRoutes.js
// ============================================================

const express = require("express");
const router  = express.Router();

// Controllers
const {
  testAdmin,
  getDashboardStats,
  getLowStockProducts,
  getSalesOverview,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");

// Middleware
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ─────────────────────────────────────────────────────────────
//  All routes: protect (JWT) → adminOnly (role check)
// ─────────────────────────────────────────────────────────────

// Test route — admin access check karo
router.get("/test",            protect, adminOnly, testAdmin);

// Dashboard stats — total counts + recent orders/users
router.get("/dashboard",       protect, adminOnly, getDashboardStats);

// Low stock products
router.get("/low-stock",       protect, adminOnly, getLowStockProducts);

// Sales overview — today / week / month
router.get("/sales",           protect, adminOnly, getSalesOverview);

// User management routes
router.get("/users",           protect, adminOnly, getAllUsers);
router.put("/users/:id/role",  protect, adminOnly, updateUserRole);
router.delete("/users/:id",    protect, adminOnly, deleteUser);

module.exports = router;