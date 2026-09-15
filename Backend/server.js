// ============================================================
//  Universal Edge — Server
//  File: server.js
// ============================================================

const express       = require("express");
const cors          = require("cors");
const dotenv        = require("dotenv");
const mongoose      = require("mongoose");
const rateLimit     = require("express-rate-limit");
const helmet        = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

// ── Routes ───────────────────────────────────────────────────
const authRoutes    = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes   = require("./routes/orderRoutes");
const adminRoutes   = require("./routes/adminRoutes");

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ───────────────────────────────────────
app.use(helmet());

// Rate Limiting — sab APIs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100,
  message: { success: false, message: "Too many requests. Try again after 15 minutes." },
});
app.use("/api/", limiter);

// Auth routes ke liye strict limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      20,
  message: { success: false, message: "Too many attempts. Try again after 15 minutes." },
});
app.use("/api/auth/", authLimiter);

// ── General Middleware ────────────────────────────────────────
app.use(cors({
  origin:      process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));

// NoSQL Injection prevent karo — Express 5 compatible
// req.query is read-only in Express 5, so sanitize copies instead of mutating
app.use((req, res, next) => {
  if (req.body)   req.body   = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
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
app.use("/api/admin",    adminRoutes);   // ← naya

// ── Test Route ────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ success: true, message: "Universal Edge Backend Running! 🚀" });
});

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
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