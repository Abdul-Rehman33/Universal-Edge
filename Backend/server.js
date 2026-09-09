// ============================================================
//  Universal Edge — Server
//  File: server.js
// ============================================================

const express  = require("express");
const cors     = require("cors");
const dotenv   = require("dotenv");
const mongoose = require("mongoose");

// Routes
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json()); // JSON body parse karo

// ── MongoDB Connect ───────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ── API Routes ────────────────────────────────────────────────
app.use("/api/auth", authRoutes); // /api/auth/register, /api/auth/login

// ── Test Route ────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Universal Edge Backend Running! 🚀" });
});

// ── Server Start ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});