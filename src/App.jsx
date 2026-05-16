import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
//  PAGES IMPORT
// ─────────────────────────────────────────────────────────────
import Home from "./pages/Home.jsx";
import About from "./pages/About Us/AboutUs.jsx";
import Products from "./pages/Products/Products.jsx";
import ProductDetail from "./pages/Product Detail/ProductDetail.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import Login from "./pages/LogIn/SignUp/Login.jsx";
import Signup from "./pages/LogIn/SignUp/Signup.jsx";
import NotFound from "./pages/404 page/NotFound.jsx";
import Wishlist from "./pages/Wishlist/Wishlist.jsx";

// ─────────────────────────────────────────────────────────────
//  Context API
// ─────────────────────────────────────────────────────────────
import { CartProvider } from "./Context/CartContext.jsx";
import { WishlistProvider } from "./Context/WishlistContext.jsx";
import { ToastProvider } from "./Context/ToastContext.jsx";

// ─────────────────────────────────────────────────────────────
//  Components
// ───────────────────────────────────────────────────────────── 
import Toast from "./components/Toast/Toast.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ScrollButton from "./components/ScrollButton/ScrollButton.jsx";

import "./components/Page Transition/PageTransition.css"

function AnimatedRoutes() {
  const location = useLocation();

  // Route ke hisab se behtareen aur premium animations
  const getAnimationClass = (pathname) => {
    // Auth pages: 3D Flip effect
    if (pathname === "/login" || pathname === "/signup") return "page-transition-flip";
    
    // Cart/Checkout: Modal-like Sheet Slide Up
    if (pathname === "/cart" || pathname === "/checkout") return "page-transition-sheet";
    
    // Product Detail: Zoom in effect to draw focus
    if (pathname.startsWith("/products/") && pathname !== "/products") return "page-transition-zoom";
    
    // Products Grid: Modern Slide from right
    if (pathname === "/products") return "page-transition-slide";
    
    // Default (Home, About, Wishlist, etc.): Soft Blur Fade
    return "page-transition-blur"; 
  };

  return (
    <div
      key={location.pathname}
      className={getAnimationClass(location.pathname)}
    >
      <Routes>
        {/* Protected routes can be added later */}

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MAIN APP COMPONENT WITH ROUTES
// ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>

            <Toast />
            <ScrollToTop />
            <ScrollButton />

            <AnimatedRoutes />

          </BrowserRouter>
        </WishlistProvider>
      </CartProvider >
    </ToastProvider>
  );
}