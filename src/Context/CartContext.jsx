import { createContext, useContext, useState } from "react";

// ─────────────────────────────────────────────────────────────
//  1. CREATE CONTEXT
// ─────────────────────────────────────────────────────────────
const CartContext = createContext();

// ─────────────────────────────────────────────────────────────
//  2. CUSTOM HOOK — use this in any component to access cart
//     Example: const { cartItems, addToCart } = useCart();
// ─────────────────────────────────────────────────────────────
export function useCart() {
  return useContext(CartContext);
}

// ─────────────────────────────────────────────────────────────
//  3. CART PROVIDER — wrap your entire app with this
// ─────────────────────────────────────────────────────────────
export function CartProvider({ children }) {

  // Cart state — array of cart items
  const [cartItems, setCartItems] = useState([]);

  // ── ADD TO CART ──────────────────────────────────────────
  // If product already exists → increase quantity
  // If new product → add it with quantity 1
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const exists = prevItems.find((item) => item.id === product.id);

      if (exists) {
        // Already in cart → just increase quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // New item → add with quantity 1
      return [
        ...prevItems,
        {
          id:       product.id,
          name:     product.name,
          price:    product.price,
          oldPrice: product.oldPrice || null,
          image:    product.image,
          category: product.category || "",
          quantity: 1,
        },
      ];
    });
  };

  // ── REMOVE FROM CART ─────────────────────────────────────
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // ── INCREASE QUANTITY ────────────────────────────────────
  const increaseQty = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity < 10
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ── DECREASE QUANTITY ────────────────────────────────────
  // Minimum quantity is 1 — will not go below
  const decreaseQty = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // ── CLEAR ENTIRE CART ────────────────────────────────────
  const clearCart = () => setCartItems([]);

  // ── CALCULATED VALUES ────────────────────────────────────

  // Total number of items (sum of all quantities)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Total price (sum of price × quantity for each item)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Delivery — free if order is PKR 5000+
  const delivery = subtotal >= 5000 ? 0 : 250;

  // Final total
  const total = subtotal + delivery;

  // ── PROVIDE EVERYTHING TO ALL COMPONENTS ─────────────────
  return (
    <CartContext.Provider
      value={{
        // State
        cartItems,

        // Functions
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,

        // Calculated
        totalItems,
        subtotal,
        delivery,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}