import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
//  PAGES IMPORT
// ─────────────────────────────────────────────────────────────
import Home from "./pages/Home.jsx";
import Products from "./pages/Products/Products.jsx";
import ProductDetail from "./pages/Product Detail/ProductDetail.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import Login from "./pages/LogIn/SignUp/Login.jsx";
import Signup from "./pages/LogIn/SignUp/Signup.jsx";

// ─────────────────────────────────────────────────────────────
//  MAIN APP COMPONENT WITH ROUTES
// ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected routes can be added later */}

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}