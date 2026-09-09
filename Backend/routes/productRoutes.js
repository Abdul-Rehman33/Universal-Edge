// ============================================================
//  Universal Edge — Product Routes
//  File: routes/productRoutes.js
// ============================================================

const express = require("express");
const router  = express.Router();

// Controller
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require("../controllers/productController");

// Middleware
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ─────────────────────────────────────────────────────────────
//  PUBLIC ROUTES — Koi bhi access kar sakta hai
// ─────────────────────────────────────────────────────────────

// Sab products lo — search, filter, sort, pagination ke saath
router.get("/", getAllProducts);

// Category ke hisaab se products lo
// NOTE: yeh route /:id se pehle hona chahiye
router.get("/category/:category", getProductsByCategory);

// Ek product lo ID se
router.get("/:id", getProductById);

// ─────────────────────────────────────────────────────────────
//  ADMIN ROUTES — Sirf admin access kar sakta hai
//  protect  → JWT token chahiye
//  adminOnly → role === "admin" hona chahiye
// ─────────────────────────────────────────────────────────────

// Naya product banao
router.post("/",    protect, adminOnly, createProduct);

// Product update karo
router.put("/:id",  protect, adminOnly, updateProduct);

// Product delete karo
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;