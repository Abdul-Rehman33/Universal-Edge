// ============================================================
//  Universal Edge — Auth Controller
//  File: controllers/authController.js
// ============================================================

const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("❌ Register Error:", error);
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0], // pehla error message dikhao
      });
    }

    // Duplicate key error (e.g. unique email)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please login.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error. Please try again.",
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
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error. Please try again.",
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
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error("❌ GetMe Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error. Please try again.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GOOGLE AUTH — Google se login ya signup
//  Route:  POST /api/auth/google
//  Access: Public
// ─────────────────────────────────────────────────────────────
const googleAuth = async (req, res) => {
  try {
    const { email, firstName, lastName, displayName, googleId, uid, photo, photoURL } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for Google login",
      });
    }

    const gId = googleId || uid;

    // ── 1. Check karo user pehle se exist karta hai? ────────
    let user = await User.findOne({ email });

    if (user) {
      // Existing user: agar googleId nahi tha toh link karo
      let updated = false;
      if (!user.googleId && gId) {
        user.googleId = gId;
        updated = true;
      }
      if (!user.photo && (photo || photoURL)) {
        user.photo = photo || photoURL;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      // Naya user banao
      let fName = firstName;
      let lName = lastName;

      if (!fName && displayName) {
        const parts = displayName.trim().split(" ");
        fName = parts[0] || "User";
        lName = parts.slice(1).join(" ") || "Google";
      }

      user = await User.create({
        firstName: fName || "Google",
        lastName: lName || "User",
        email,
        googleId: gId,
        photo: photo || photoURL || "",
      });
    }

    // ── 2. JWT Token generate karo ─────────────────────────
    const token = generateToken(user._id);

    // ── 3. Response bhejo ──────────────────────────────────
    res.status(200).json({
      success: true,
      message: "Google login successful!",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        photo: user.photo || "",
      },
    });
  } catch (error) {
    console.error("❌ Google Auth Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during Google authentication.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  EXPORT
// ─────────────────────────────────────────────────────────────
module.exports = { register, login, googleAuth, getMe };