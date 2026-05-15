import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
//  PAGES IMPORT
// ─────────────────────────────────────────────────────────────
import ScrollToTop from "./components/ScrollToTop.jsx";
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
import Toast from "./components/Toast/Toast.jsx";

// ── Cart Context ───────────────────────────────────────────
// CartProvider wraps the ENTIRE app so every page and
// component can access cart state using useCart()
import { CartProvider } from "./Context/CartContext.jsx";
import { WishlistProvider } from "./Context/WishlistContext.jsx";
import { ToastProvider } from "./Context/ToastContext.jsx";

// ─────────────────────────────────────────────────────────────
//  MAIN APP COMPONENT WITH ROUTES
// ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
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
            <Toast />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider >
    </ToastProvider>
  );
}