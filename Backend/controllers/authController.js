// ============================================================
//  Universal Edge — Auth Controller
//  File: controllers/authController.js
// ============================================================

const User = require("../models/User");
const jwt  = require("jsonwebtoken");

// ─────────────────────────────────────────────────────────────
//  HELPER — JWT Token Generate karo
//  id le ke token banata hai
// ─────────────────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign(
    { id },                        // token ke andar user id store hogi
    process.env.JWT_SECRET,        // secret key .env se
    { expiresIn: "30d" }           // token 30 din mein expire hoga
  );
};

// ─────────────────────────────────────────────────────────────
//  REGISTER — Naya user banao
//  Route:  POST /api/auth/register
//  Access: Public
// ─────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // ── 1. Sari fields check karo ──────────────────────────
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // ── 2. Email already exist karta hai? ──────────────────
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login.",
      });
    }

    // ── 3. Naya user banao ─────────────────────────────────
    // Password yahan plain text hai — User model ka
    // pre("save") middleware automatically hash karega
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    // ── 4. JWT Token generate karo ─────────────────────────
    const token = generateToken(user._id);

    // ── 5. Response bhejo ──────────────────────────────────
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        phone:     user.phone,
        role:      user.role,
      },
    });

  } catch (error) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0], // pehla error message dikhao
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  LOGIN — User login karo
//  Route:  POST /api/auth/login
//  Access: Public
// ─────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── 1. Email aur password check karo ──────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // ── 2. User dhundo — password bhi lo (select:false hai) ─
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ── 3. Password compare karo ───────────────────────────
    // comparePassword() User model mein define ki thi
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ── 4. JWT Token generate karo ─────────────────────────
    const token = generateToken(user._id);

    // ── 5. Response bhejo ──────────────────────────────────
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        phone:     user.phone,
        role:      user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET ME — Login user ki info lo
//  Route:  GET /api/auth/me
//  Access: Private (JWT token chahiye)
// ─────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    // req.user authMiddleware se aayega
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        phone:     user.phone,
        role:      user.role,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  EXPORT
// ─────────────────────────────────────────────────────────────
module.exports = { register, login, getMe };