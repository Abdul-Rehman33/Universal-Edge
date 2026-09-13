// ============================================================
//  Universal Edge — Order Controller
//  File: controllers/orderController.js
// ============================================================

const Order = require("../models/Order");

// PLACE ORDER
const placeOrder = async (req, res) => {
  try {
    const { orderItems, deliveryAddress, paymentMethod, subtotal, deliveryCharge, discount, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }
    if (!deliveryAddress) {
      return res.status(400).json({ success: false, message: "Delivery address is required" });
    }
    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: "Payment method is required" });
    }

    // Normalize payment method to match schema enum (COD, JazzCash, EasyPaisa)
    let normalizedPaymentMethod = paymentMethod;
    if (typeof paymentMethod === "string") {
      const lower = paymentMethod.toLowerCase();
      if (lower === "cod") normalizedPaymentMethod = "COD";
      else if (lower === "jazzcash") normalizedPaymentMethod = "JazzCash";
      else if (lower === "easypaisa") normalizedPaymentMethod = "EasyPaisa";
    }

    // Normalize order items to ensure product reference is present
    const normalizedOrderItems = orderItems.map((item) => ({
      product:  item.product || item.id || item._id,
      name:     item.name,
      image:    item.image,
      price:    item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      user:           req.user?._id,
      orderItems:     normalizedOrderItems,
      deliveryAddress,
      paymentMethod:  normalizedPaymentMethod,
      subtotal:       subtotal       || 0,
      deliveryCharge: deliveryCharge || 0,
      discount:       discount       || 0,
      totalPrice,
      status:         "pending",
    });

    res.status(201).json({ success: true, message: "Order placed successfully!", order });

  } catch (error) {
    console.error("Place order error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: "Server error. Could not place order.", error: error.message });
  }
};

// MY ORDERS
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ success: false, message: "Server error. Could not fetch orders." });
  }
};

// GET ORDER BY ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "firstName lastName email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user && order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    res.status(200).json({ success: true, order });

  } catch (error) {
    console.error("Get order by id error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ success: false, message: "Order not found — invalid ID" });
    }
    res.status(500).json({ success: false, message: "Server error. Could not fetch order." });
  }
};

// GET ALL ORDERS — Admin
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const pageNum  = parseInt(page);
    const limitNum = parseInt(limit);
    const skip     = (pageNum - 1) * limitNum;

    const orders = await Order
      .find(filter)
      .populate("user", "firstName lastName email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalOrders = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      count:   orders.length,
      total:   totalOrders,
      page:    pageNum,
      pages:   Math.ceil(totalOrders / limitNum),
      orders,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Could not fetch orders." });
  }
};

// UPDATE ORDER STATUS — Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;

    if (status === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    if (status === "processing" && order.paymentMethod !== "COD") {
      order.isPaid = true;
      order.paidAt = new Date();
    }

    await order.save();

    res.status(200).json({ success: true, message: `Order status updated to "${status}"`, order });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ success: false, message: "Order not found — invalid ID" });
    }
    res.status(500).json({ success: false, message: "Server error. Could not update order." });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };