// ============================================================
//  Universal Edge — Order Model
//  File: models/Order.js
// ============================================================

const mongoose = require("mongoose");

// ─────────────────────────────────────────────────────────────
//  ORDER ITEM SCHEMA — har product ka data
//  (Product delete ho jaye toh bhi order safe rahe)
// ─────────────────────────────────────────────────────────────
const orderItemSchema = new mongoose.Schema(
  {
    // Product ka reference — MongoDB ID
    product: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Product",
      required: [true, "Product reference is required"],
    },

    // Product details — snapshot at time of order
    // (agar baad mein product ka price change ho toh bhi order sahi rahe)
    name: {
      type:     String,
      required: [true, "Product name is required"],
    },

    image: {
      type:     String,
      required: [true, "Product image is required"],
    },

    price: {
      type:     Number,
      required: [true, "Product price is required"],
    },

    quantity: {
      type:     Number,
      required: [true, "Quantity is required"],
      min:      [1, "Quantity must be at least 1"],
    },
  },
  { _id: false } // alag ID nahi chahiye har item ke liye
);

// ─────────────────────────────────────────────────────────────
//  DELIVERY ADDRESS SCHEMA
//  Checkout page ke form se aata hai
// ─────────────────────────────────────────────────────────────
const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type:     String,
      required: [true, "Full name is required"],
      trim:     true,
    },

    email: {
      type:     String,
      required: [true, "Email is required"],
      trim:     true,
      lowercase: true,
    },

    phone: {
      type:     String,
      required: [true, "Phone number is required"],
      trim:     true,
    },

    address: {
      type:     String,
      required: [true, "Address is required"],
      trim:     true,
    },

    city: {
      type:     String,
      required: [true, "City is required"],
      trim:     true,
    },

    postalCode: {
      type:  String,
      trim:  true,
      default: "",
    },

    notes: {
      type:    String,
      trim:    true,
      default: "", // optional field
    },
  },
  { _id: false }
);

// ─────────────────────────────────────────────────────────────
//  MAIN ORDER SCHEMA
// ─────────────────────────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    // ── User Reference ─────────────────────────────────────
    // Kaun ne order kiya — logged in user ka ID
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
      // required nahi — guest checkout bhi ho sakta hai baad mein
    },

    // ── Order Items ────────────────────────────────────────
    // Cart se aaya data
    orderItems: {
      type:     [orderItemSchema],
      required: [true, "Order items are required"],
      validate: {
        validator: function (arr) {
          return arr.length >= 1;
        },
        message: "Order must have at least one item",
      },
    },

    // ── Delivery Address ───────────────────────────────────
    // Checkout form se aaya data
    deliveryAddress: {
      type:     addressSchema,
      required: [true, "Delivery address is required"],
    },

    // ── Payment Method ─────────────────────────────────────
    // Site pe 3 options the: COD, JazzCash, EasyPaisa
    paymentMethod: {
      type:     String,
      required: [true, "Payment method is required"],
      enum: {
        values:  ["COD", "JazzCash", "EasyPaisa"],
        message: "Payment method must be COD, JazzCash, or EasyPaisa",
      },
      default: "COD",
    },

    // ── Pricing ────────────────────────────────────────────
    subtotal: {
      type:     Number,
      required: [true, "Subtotal is required"],
      min:      [0, "Subtotal cannot be negative"],
    },

    deliveryCharge: {
      type:    Number,
      default: 0, // FREE delivery agar 5000+ order ho
    },

    discount: {
      type:    Number,
      default: 0, // coupon discount
    },

    totalPrice: {
      type:     Number,
      required: [true, "Total price is required"],
      min:      [0, "Total price cannot be negative"],
    },

    // ── Order Status ───────────────────────────────────────
    // Admin panel se update hoga
    status: {
      type:    String,
      enum: {
        values: [
          "pending",     // order abhi aaya
          "processing",  // order confirm ho gaya
          "shipped",     // order bhej diya
          "delivered",   // order mil gaya
          "cancelled",   // order cancel
        ],
        message: "Invalid order status",
      },
      default: "pending",
    },

    // ── Order ID ───────────────────────────────────────────
    // Human readable order ID — site pe "UE-XXXXXX" format
    orderId: {
      type:    String,
      unique:  true,
      default: () =>
        "UE-" +
        Math.random().toString(36).substring(2, 8).toUpperCase(),
    },

    // ── Payment Status ─────────────────────────────────────
    isPaid: {
      type:    Boolean,
      default: false,
    },

    paidAt: {
      type: Date, // jab payment ho jaye
    },

    // ── Delivery Date ──────────────────────────────────────
    isDelivered: {
      type:    Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date, // jab deliver ho jaye
    },
  },

  // ── Timestamps ─────────────────────────────────────────────
  {
    timestamps: true, // createdAt aur updatedAt automatic
  }
);

// ─────────────────────────────────────────────────────────────
//  PRE-SAVE — Auto generate orderId if not already present
//  "UE-" + random 6 characters
//  Example: "UE-A3F8K2"
// ─────────────────────────────────────────────────────────────
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId =
      "UE-" +
      Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  if (typeof next === "function") {
    next();
  }
});

// ─────────────────────────────────────────────────────────────
//  ORDER MODEL — Export karo
// ─────────────────────────────────────────────────────────────
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;