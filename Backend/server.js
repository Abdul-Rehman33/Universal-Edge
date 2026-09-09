import express  from "express";
import cors     from "cors";
import dotenv   from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ── MongoDB Connect ──────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Universal Edge Backend Running! 🚀" });
});

// Server start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});