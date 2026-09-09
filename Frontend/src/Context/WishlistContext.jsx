import { createContext, useContext, useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
//  CREATE CONTEXT
// ─────────────────────────────────────────────────────────────
const WishlistContext = createContext();

// ─────────────────────────────────────────────────────────────
//  CUSTOM HOOK
//  Use in any component: const { wishlistItems, addToWishlist } = useWishlist();
// ─────────────────────────────────────────────────────────────
export function useWishlist() {
  return useContext(WishlistContext);
}

// ─────────────────────────────────────────────────────────────
//  WISHLIST PROVIDER
// ─────────────────────────────────────────────────────────────
export function WishlistProvider({ children }) {

  // Load from localStorage on first render
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("ue-wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("ue-wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // ── ADD TO WISHLIST ──────────────────────────────────────
  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev; // already in wishlist
      return [...prev, {
        id:       product.id,
        name:     product.name,
        price:    product.price,
        oldPrice: product.oldPrice || null,
        image:    product.image,
        category: product.category || "",
        rating:   product.rating || null,
      }];
    });
  };

  // ── REMOVE FROM WISHLIST ─────────────────────────────────
  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ── TOGGLE — add if not in wishlist, remove if already in ─
  const toggleWishlist = (product) => {
    const exists = wishlistItems.find((item) => item.id === product.id);
    if (exists) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // ── CHECK IF ITEM IS IN WISHLIST ─────────────────────────
  const isWishlisted = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };

  // ── CLEAR ALL ────────────────────────────────────────────
  const clearWishlist = () => setWishlistItems([]);

  // Total wishlist items count
  const totalWishlist = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      clearWishlist,
      totalWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}