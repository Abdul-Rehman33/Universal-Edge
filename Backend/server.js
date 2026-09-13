// ============================================================
//  Universal Edge — Server
//  File: server.js
// ============================================================

const express        = require("express");
const cors           = require("cors");
const dotenv         = require("dotenv");
const mongoose       = require("mongoose");
const rateLimit      = require("express-rate-limit");
const helmet         = require("helmet");
const mongoSanitize  = require("express-mongo-sanitize");

// ── Routes ───────────────────────────────────────────────────
const authRoutes    = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes   = require("./routes/orderRoutes");

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ───────────────────────────────────────

// 1. Helmet — security headers lagata hai
app.use(helmet());

// 2. Rate Limiting — brute force attacks rokta hai
//    15 minutes mein max 100 requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});
app.use("/api/", limiter);

// 3. Auth routes ke liye strict limit — login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      20, // sirf 20 attempts per 15 min
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});
app.use("/api/auth/", authLimiter);

// ── General Middleware ────────────────────────────────────────

// CORS — React frontend ko allow karo
app.use(cors({
  origin:      process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// JSON body parse karo
app.use(express.json({ limit: "10mb" }));

// 4. NoSQL Injection rokta hai (Express 5 compatible)
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  if (req.query) {
    const cleanQuery = mongoSanitize.sanitize({ ...req.query });
    for (const key of Object.keys(req.query)) {
      delete req.query[key];
    }
    Object.assign(req.query, cleanQuery);
  }
  next();
});

// ── MongoDB Connect ───────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ── API Routes ────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);

// ── Test Route ────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Universal Edge Backend Running! 🚀",
    version: "1.0.0",
  });
});

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ── Server Start ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
});