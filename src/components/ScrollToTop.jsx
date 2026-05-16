import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
//  SCROLL TO TOP ON ROUTE CHANGE 
//  Jab bhi route change hoga — page top pe chala jayega
// ─────────────────────────────────────────────────────────────
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}