// ============================================================
//  Universal Edge — Product Model
//  File: models/Product.js
// ============================================================

const mongoose = require("mongoose");

// ─────────────────────────────────────────────────────────────
//  PRODUCT SCHEMA
// ─────────────────────────────────────────────────────────────
const productSchema = new mongoose.Schema(
  {
    // ── Basic Info ─────────────────────────────────────────
    name: {
      type:      String,
      required:  [true, "Product name is required"],
      trim:      true,
      minlength: [2,   "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    description: {
      type:      String,
      required:  [true, "Product description is required"],
      trim:      true,
      minlength: [10,   "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    // ── Pricing ────────────────────────────────────────────
    price: {
      type:     Number,
      required: [true, "Product price is required"],
      min:      [0,    "Price cannot be negative"],
    },

    oldPrice: {
      type:    Number,
      default: null,  // null matlab sale nahi hai
      min:     [0, "Old price cannot be negative"],
    },

    // ── Category ───────────────────────────────────────────
    // Sirf yeh 4 categories allowed hain — site ke hisaab se
    category: {
      type:     String,
      required: [true, "Category is required"],
      enum: {
        values:  ["Shoes", "Perfumes", "Clothing", "Accessories"],
        message: "Category must be Shoes, Perfumes, Clothing, or Accessories",
      },
    },

    // ── Badge ──────────────────────────────────────────────
    // Site pe: new, sale, hot badges dikh rahe the
    badge: {
      type:    String,
      enum:    ["new", "sale", "hot", null],
      default: null,
    },

    // ── Images ─────────────────────────────────────────────
    // Array of image URLs — multiple images per product
    images: {
      type:     [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: function (arr) {
          return arr.length >= 1; // kam az kam 1 image honi chahiye
        },
        message: "Product must have at least one image",
      },
    },

    // ── Stock ──────────────────────────────────────────────
    stock: {
      type:    Number,
      default: 0,
      min:     [0, "Stock cannot be negative"],
    },

    inStock: {
      type:    Boolean,
      default: true,
    },

    // ── Sold Count ─────────────────────────────────────────
    // Site pe "1.2k+ Sold" dikh raha tha
    sold: {
      type:    Number,
      default: 0,
    },

    // ── Rating ─────────────────────────────────────────────
    // Site pe "4.5 / 5  128 Reviews" dikh raha tha
    rating: {
      type:    Number,
      default: 0,
      min:     [0, "Rating cannot be less than 0"],
      max:     [5, "Rating cannot be more than 5"],
    },

    numReviews: {
      type:    Number,
      default: 0,
    },

    // ── Specifications ─────────────────────────────────────
    // Site pe specifications table dikh rahi thi:
    // Brand, Model, Material, Sole, Closure, Sizes, Color, Weight
    // Mixed type use kiya — har category ki specs alag hoti hain
    specs: {
      type:    mongoose.Schema.Types.Mixed,
      default: {},
      // Example for Shoes:
      // {
      //   Brand: "Nike",
      //   Model: "Air Max 270",
      //   Material: "Mesh + Synthetic",
      //   Sole: "Rubber",
      //   Closure: "Lace-Up",
      //   "Available Sizes": "38-46",
      //   Color: "White / Black",
      //   Weight: "310g"
      // }
    },
  },

  // ── Timestamps ─────────────────────────────────────────────
  {
    timestamps: true, // createdAt aur updatedAt automatic
  }
);

// ─────────────────────────────────────────────────────────────
//  VIRTUAL — Discount Percentage
//  Automatically calculate karo — database mein save nahi hoga
//  Site pe "-17% OFF" dikh raha tha
// ─────────────────────────────────────────────────────────────
productSchema.virtual("discountPercent").get(function () {
  if (this.oldPrice && this.oldPrice > this.price) {
    return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  }
  return 0;
});

// ─────────────────────────────────────────────────────────────
//  PRODUCT MODEL — Export karo
// ─────────────────────────────────────────────────────────────
const Product = mongoose.model("Product", productSchema);

module.exports = Product;