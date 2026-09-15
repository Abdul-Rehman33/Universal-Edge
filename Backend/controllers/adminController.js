// ============================================================
//  Universal Edge — Admin Controller
//  File: controllers/adminController.js
// ============================================================

const User    = require("../models/User");
const Product = require("../models/Product");
const Order   = require("../models/Order");

// ─────────────────────────────────────────────────────────────
//  TEST ROUTE — Admin access verify karo
//  Route:  GET /api/admin/test
//  Access: Admin only
// ─────────────────────────────────────────────────────────────
const testAdmin = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted ✅",
    admin: {
      id:        req.user._id,
      firstName: req.user.firstName,
      email:     req.user.email,
      role:      req.user.role,
    },
  });
};

// ─────────────────────────────────────────────────────────────
//  DASHBOARD STATS
//  Route:  GET /api/admin/dashboard
//  Access: Admin only
// ─────────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    // Sab stats ek saath lo — parallel queries
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: "pending"    }),
      Order.countDocuments({ status: "processing" }),
      Order.countDocuments({ status: "shipped"    }),
      Order.countDocuments({ status: "delivered"  }),
      Order.countDocuments({ status: "cancelled"  }),

      // Total revenue — sirf delivered orders ka
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

    // Revenue result
    const totalRevenue = revenueResult[0]?.total || 0;

    // Recent 5 orders
    const recentOrders = await Order
      .find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderId status totalPrice paymentMethod createdAt");

    // Recent 5 users
    const recentUsers = await User
      .find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstName lastName email createdAt");

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        ordersByStatus: {
          pending:    pendingOrders,
          processing: processingOrders,
          shipped:    shippedOrders,
          delivered:  deliveredOrders,
          cancelled:  cancelledOrders,
        },
      },
      recentOrders,
      recentUsers,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch dashboard stats.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  EXPORT
// ─────────────────────────────────────────────────────────────
module.exports = { testAdmin, getDashboardStats };