import { Navigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
//  ADMIN PROTECTED ROUTE
//  Sirf admin role wala user access kar sakta hai
//  Agar normal user aaye → /login redirect
//  Agar admin aaye → page dikhao
//
//  Usage in App.jsx:
//  <Route path="/admin" element={
//    <AdminRoute><AdminDashboard /></AdminRoute>
//  } />
// ─────────────────────────────────────────────────────────────
export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");

  // Token nahi → login pe bhejo
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Admin nahi → home pe bhejo
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin hai → page dikhao
  return children;
}