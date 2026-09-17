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
// module.exports = { testAdmin, getDashboardStats };

// ─────────────────────────────────────────────────────────────
//  LOW STOCK PRODUCTS
//  Route:  GET /api/admin/low-stock?threshold=10
//  Access: Admin only
// ─────────────────────────────────────────────────────────────
const getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;

    const products = await Product
      .find({ stock: { $lte: threshold } })
      .sort({ stock: 1 })
      .limit(20)
      .select("name images stock inStock category price");

    res.status(200).json({
      success: true,
      threshold,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("❌ Low Stock Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch low stock products.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  SALES OVERVIEW
//  Route:  GET /api/admin/sales
//  Access: Admin only
// ─────────────────────────────────────────────────────────────
const getSalesOverview = async (req, res) => {
  try {
    const now = new Date();

    // Today: midnight → now
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // This week: Monday → now
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // Monday = 0
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - dayOfWeek);

    // This month: 1st → now
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayResult, weekResult, monthResult] = await Promise.all([
      Order.aggregate([
        { $match: { status: "delivered", createdAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { status: "delivered", createdAt: { $gte: weekStart } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { status: "delivered", createdAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      sales: {
        today: {
          revenue: todayResult[0]?.total || 0,
          orders:  todayResult[0]?.count || 0,
        },
        thisWeek: {
          revenue: weekResult[0]?.total || 0,
          orders:  weekResult[0]?.count || 0,
        },
        thisMonth: {
          revenue: monthResult[0]?.total || 0,
          orders:  monthResult[0]?.count || 0,
        },
      },
    });
  } catch (error) {
    console.error("❌ Sales Overview Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch sales overview.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET ALL USERS
//  Route:  GET /api/admin/users
//  Access: Admin only
// ─────────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("❌ Get Users Error:", error);
    res.status(500).json({ success: false, message: "Could not fetch users." });
  }
};

// ─────────────────────────────────────────────────────────────
//  UPDATE USER ROLE
//  Route:  PUT /api/admin/users/:id/role
//  Access: Admin only
// ─────────────────────────────────────────────────────────────
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role specified." });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, message: `User role updated to ${role}`, user });
  } catch (error) {
    console.error("❌ Update Role Error:", error);
    res.status(500).json({ success: false, message: "Could not update user role." });
  }
};

// ─────────────────────────────────────────────────────────────
//  DELETE USER
//  Route:  DELETE /api/admin/users/:id
//  Access: Admin only
// ─────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User account deleted successfully." });
  } catch (error) {
    console.error("❌ Delete User Error:", error);
    res.status(500).json({ success: false, message: "Could not delete user account." });
  }
};

// ─────────────────────────────────────────────────────────────
//  EXPORT (updated)
// ─────────────────────────────────────────────────────────────
module.exports = {
  testAdmin,
  getDashboardStats,
  getLowStockProducts,
  getSalesOverview,
  getAllUsers,
  updateUserRole,
  deleteUser,
};

