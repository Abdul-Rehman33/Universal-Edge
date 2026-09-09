// ============================================================
//  Universal Edge — Product Controller
//  File: controllers/productController.js
// ============================================================

const Product = require("../models/Product");

// ─────────────────────────────────────────────────────────────
//  GET ALL PRODUCTS
//  Route:  GET /api/products
//  Access: Public
//  Features: Search, Filter by category, Sort, Pagination
// ─────────────────────────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    // URL se query params lo
    // Example: /api/products?category=Shoes&search=nike&sort=price&page=1
    const {
      category,
      search,
      sort,
      page  = 1,
      limit = 12,
    } = req.query;

    // ── Filter object banao ────────────────────────────────
    const filter = {};

    // Category filter
    if (category && category !== "All") {
      filter.category = category;
    }

    // Search filter — name mein search karo
    if (search) {
      filter.name = {
        $regex:   search,  // partial match
        $options: "i",     // case insensitive
      };
    }

    // ── Sort option ────────────────────────────────────────
    let sortOption = { createdAt: -1 }; // default: newest first

    if (sort === "price-asc")  sortOption = { price:  1 };  // price low to high
    if (sort === "price-desc") sortOption = { price: -1 };  // price high to low
    if (sort === "rating")     sortOption = { rating: -1 }; // top rated
    if (sort === "newest")     sortOption = { createdAt: -1 };

    // ── Pagination ─────────────────────────────────────────
    const pageNum  = parseInt(page);
    const limitNum = parseInt(limit);
    const skip     = (pageNum - 1) * limitNum;

    // ── Database se products lo ────────────────────────────
    const products = await Product
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Total count — pagination ke liye
    const totalProducts = await Product.countDocuments(filter);
    const totalPages    = Math.ceil(totalProducts / limitNum);

    res.status(200).json({
      success:  true,
      count:    products.length,
      total:    totalProducts,
      page:     pageNum,
      pages:    totalPages,
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch products.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET SINGLE PRODUCT
//  Route:  GET /api/products/:id
//  Access: Public
// ─────────────────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // Product nahi mila
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    // Invalid MongoDB ID format
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Product not found — invalid ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch product.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  CREATE PRODUCT
//  Route:  POST /api/products
//  Access: Admin only
// ─────────────────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      category,
      badge,
      images,
      stock,
      specs,
    } = req.body;

    // ── Zaroori fields check karo ──────────────────────────
    if (!name || !description || !price || !category || !images) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // ── Product banao ──────────────────────────────────────
    const product = await Product.create({
      name,
      description,
      price,
      oldPrice:  oldPrice  || null,
      category,
      badge:     badge     || null,
      images,
      stock:     stock     || 0,
      inStock:   stock > 0,
      specs:     specs     || {},
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product,
    });

  } catch (error) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Could not create product.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  UPDATE PRODUCT
//  Route:  PUT /api/products/:id
//  Access: Admin only
// ─────────────────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    // Agar stock update ho raha hai toh inStock bhi update karo
    if (req.body.stock !== undefined) {
      req.body.inStock = req.body.stock > 0;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new:          true,  // updated product return karo
        runValidators: true, // schema validation chalao
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product,
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Product not found — invalid ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Could not update product.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  DELETE PRODUCT
//  Route:  DELETE /api/products/:id
//  Access: Admin only
// ─────────────────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Product not found — invalid ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Could not delete product.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  GET PRODUCTS BY CATEGORY
//  Route:  GET /api/products/category/:category
//  Access: Public
// ─────────────────────────────────────────────────────────────
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product
      .find({ category })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success:  true,
      count:    products.length,
      category,
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch products.",
    });
  }
};

// ─────────────────────────────────────────────────────────────
//  EXPORT
// ─────────────────────────────────────────────────────────────
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};