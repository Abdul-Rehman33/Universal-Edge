import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeaturedProducts.css";
import { useCart } from "../../Context/CartContext";

// ─────────────────────────────────────────────────────────────
//  DUMMY PRODUCT DATA  (replace images with your own assets)
//  To use local images:
//  import shoeImg from "../assets/shoe1.jpg"
//  then use  image: shoeImg
// ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "Nike Air Max 270",
    category: "Shoes",
    price: "PKR 12,500",
    oldPrice: "PKR 15,000",
    badge: "sale",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  },
  {
    id: 2,
    name: "Dior Sauvage EDP",
    category: "Perfumes",
    price: "PKR 8,900",
    oldPrice: null,
    badge: "new",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80",
  },
  {
    id: 3,
    name: "Classic White Tee",
    category: "Clothing",
    price: "PKR 1,800",
    oldPrice: "PKR 2,400",
    badge: "sale",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    id: 4,
    name: "Casio G-Shock Watch",
    category: "Accessories",
    price: "PKR 6,200",
    oldPrice: null,
    badge: "new",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  },
  {
    id: 5,
    name: "Adidas Ultraboost",
    category: "Shoes",
    price: "PKR 14,000",
    oldPrice: "PKR 17,500",
    badge: "sale",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
  },
  {
    id: 6,
    name: "Leather Crossbody Bag",
    category: "Accessories",
    price: "PKR 3,500",
    oldPrice: null,
    badge: null,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  },
  {
    id: 7,
    name: "Slim Fit Chinos",
    category: "Clothing",
    price: "PKR 2,900",
    oldPrice: "PKR 3,800",
    badge: "sale",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
  },
  {
    id: 8,
    name: "Versace Eros EDT",
    category: "Perfumes",
    price: "PKR 11,200",
    oldPrice: null,
    badge: "new",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4f2b?w=600&q=80",
  },
];

// Filter tab options
const FILTERS = ["All", "Shoes", "Perfumes", "Clothing", "Accessories"];

// ─────────────────────────────────────────────────────────────
//  FEATURED PRODUCTS COMPONENT
// ─────────────────────────────────────────────────────────────
export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [cartAdded,    setCartAdded]    = useState([]); // track added to cart
  const [wishlist,     setWishlist]     = useState([]); // track wishlist

  // Filter products based on selected tab
  const filtered = activeFilter === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeFilter);

  // Add to cart — show green "Added!" for 1.5s then reset
  const handleAddToCart = (e, Product) => {
    e.stopPropagation(); // prevent card click
    addToCart(Product);   

    setCartAdded((prev) => [...prev, Product.id]);
    setTimeout(() => {
      setCartAdded((prev) => prev.filter((x) => x !== Product.id));
    }, 1500);
    console.log(`Added product ${Product.id} to cart`);
  };

  // Toggle wishlist
  const handleWishlist = (e, id) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section className="products-section" id="products">

      {/* ── Section Header ── */}
      <div className="products-header">
        <span className="products-tag">Hand Picked</span>
        <h2 className="products-title">
          Featured <span>Products</span>
        </h2>
        <div className="products-divider" />
      </div>

      {/* ── Filter Tabs ── */}
      <div className="products-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Products Grid ── */}
      <div className="products-grid">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/products/${product.id}`)}
          >

            {/* Image Area */}
            <div className="card-img-wrap">
              <img src={product.image} alt={product.name} loading="lazy" />

              {/* Badge */}
              {product.badge && (
                <span className={`card-badge ${product.badge}`}>
                  {product.badge === "new" ? "New" : "Sale"}
                </span>
              )}

              {/* Wishlist button */}
              <button
                className={`card-wishlist ${wishlist.includes(product.id) ? "active" : ""}`}
                onClick={(e) => handleWishlist(e, product.id)}
                aria-label="Add to wishlist"
              >
                <svg viewBox="0 0 24 24" fill="none"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
            </div>

            {/* Card Body */}
            <div className="card-body">
              <span className="card-category">{product.category}</span>
              <h3 className="card-title">{product.name}</h3>

              {/* Price */}
              <div className="card-price-row">
                <span className="card-price">{product.price}</span>
                {product.oldPrice && (
                  <span className="card-old-price">{product.oldPrice}</span>
                )}
              </div>

              {/* Add to Cart button */}
              <button
                className={`add-to-cart-btn ${cartAdded.includes(product.id) ? "added" : ""}`}
                onClick={(e) => handleAddToCart(e, product.id)}
              >
                {cartAdded.includes(product.id) ? (
                  <>
                    {/* Checkmark icon */}
                    <svg viewBox="0 0 24 24" fill="none"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Added!
                  </>
                ) : (
                  <>
                    {/* Cart icon */}
                    <svg viewBox="0 0 24 24" fill="none"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ── View All Button ── */}
      <div className="products-footer">
        <button className="products-view-all" onClick={() => navigate("/products")}>
          View All Products
          <svg viewBox="0 0 24 24" fill="none"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

    </section>
  );
}