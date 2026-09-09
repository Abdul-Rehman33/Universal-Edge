// ============================================================
//  Universal Edge — User Model
//  File: models/User.js
// ============================================================

const mongoose = require("mongoose"); // MongoDB se connect karne ke liye
const bcrypt   = require("bcryptjs"); // Password hash karne ke liye

// ─────────────────────────────────────────────────────────────
//  USER SCHEMA
// ─────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    // ── First Name ─────────────────────────────────────────
    firstName: {
      type:      String,
      required:  [true, "First name is required"],
      trim:      true,           // spaces hata do start/end se
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [30, "First name cannot exceed 30 characters"],
    },

    // ── Last Name ──────────────────────────────────────────
    lastName: {
      type:      String,
      required:  [true, "Last name is required"],
      trim:      true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [30, "Last name cannot exceed 30 characters"],
    },

    // ── Email ──────────────────────────────────────────────
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,           // database mein duplicate email nahi hogi
      lowercase: true,           // hamesha lowercase mein save hoga
      trim:      true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please enter a valid email address",
      ],
    },

    // ── Phone ──────────────────────────────────────────────
    // Pakistani number formats:
    // 03001234567 / +923001234567 / 923001234567
    phone: {
      type:     String,
      required: [true, "Phone number is required"],
      trim:     true,
      match: [
        /^(\+92|92|0)(3\d{9})$/,
        "Please enter a valid Pakistani phone number (e.g. 03001234567)",
      ],
    },

    // ── Password ───────────────────────────────────────────
    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select:    false, // password kabhi bhi response mein nahi aayega
    },

    // ── Role ───────────────────────────────────────────────
    role: {
      type:    String,
      enum:    ["user", "admin"], // sirf yeh 2 values allowed hain
      default: "user",            // naya user hamesha "user" hoga
    },
  },

  // ── Timestamps ─────────────────────────────────────────────
  // Automatically createdAt aur updatedAt fields add karta hai
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────────────────────────
//  PRE-SAVE MIDDLEWARE — Password Hash karo
//  Yeh middleware save() se PEHLE chalta hai
//  Sirf tab hash karo jab password change hua ho
// ─────────────────────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  // Agar password modify nahi hua toh skip karo
  // (jaise sirf email update ho raha ho)
  if (!this.isModified("password")) return next();

  // Salt generate karo — 12 rounds = secure + fast balance
  const salt = await bcrypt.genSalt(12);

  // Password hash karo aur replace karo
  this.password = await bcrypt.hash(this.password, salt);

  next(); // agla middleware chalao
});

// ─────────────────────────────────────────────────────────────
//  INSTANCE METHOD — comparePassword()
//  Login ke waqt use hoga — entered password vs stored hash
// ─────────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (enteredPassword) {
  // bcrypt.compare() automatically hash karke compare karta hai
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─────────────────────────────────────────────────────────────
//  USER MODEL — Export karo
// ─────────────────────────────────────────────────────────────
const User = mongoose.model("User", userSchema);

module.exports = User;