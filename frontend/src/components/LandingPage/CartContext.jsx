import { createContext, useContext, useMemo, useState } from "react";
import { userAPI } from "../../config/api";

/* ================= CONTEXT ================= */
const CartContext = createContext(null);

/* ================= PROVIDER ================= */
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [referralCode, setReferralCode] = useState("");
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [referralError, setReferralError] = useState("");

  /* ================= CONFIG ================= */
  const GST_PERCENT = 0; // GST percentage
  const SHIPPING_CHARGE = 0; // Flat shipping charge

  /* ================= CART ACTIONS ================= */

  // ➕ Add to cart
  const addToCart = (product) => {
    if (!product?.id) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // ❌ Remove item
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // ➕ Increase quantity
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ➖ Decrease quantity (minimum 1)
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  // 🧹 Clear cart (after order success)
  const clearCart = () => {
    setCart([]);
    setReferralCode("");
    setReferralDiscount(0);
    setReferralError("");
  };

  // 🎫 Apply referral code
  const applyReferralCode = async (code) => {
    if (!code.trim()) return { success: false, message: "Code is required" };

    try {
      const data = await userAPI.validateReferral(code.trim());

      if (data.valid) {
        let discount = 0;
        if (data.type === 'admin') {
          if (data.discountType === 'percentage') {
            discount = Math.round(cartSummary.subtotal * (data.discountValue / 100));
          } else {
            discount = Math.min(data.discountValue, cartSummary.subtotal);
          }
        } else {
          discount = Math.round(cartSummary.subtotal * 0.05); // 5% for user codes
        }
        setReferralCode(code.toUpperCase());
        setReferralDiscount(discount);
        setReferralError("");
        return { success: true, discount };
      } else {
        setReferralError(data.message);
        setReferralDiscount(0);
        return { success: false, message: data.message };
      }
    } catch (error) {
      const message = error.message || "Invalid referral code";
      setReferralError(message);
      setReferralDiscount(0);
      return { success: false, message };
    }
  };

  /* ================= CALCULATIONS (AMAZON STYLE) ================= */

  const cartSummary = useMemo(() => {
    const totalItems = cart.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    const subtotal = cart.reduce(
      (sum, item) =>
        sum + (item.salePrice || 0) * (item.quantity || 1),
      0
    );

    const gstAmount = (subtotal * GST_PERCENT) / 100;

    const shipping = subtotal > 500 ? 0 : SHIPPING_CHARGE;

    const discount = referralDiscount;

    const grandTotal = subtotal + gstAmount + shipping - discount;

    return {
      totalItems,
      subtotal,
      gstPercent: GST_PERCENT,
      gstAmount,
      shipping,
      discount,
      grandTotal,
    };
  }, [cart, referralDiscount]);

  /* ================= CONTEXT VALUE ================= */
  const value = {
    // DATA
    cart,
    referralCode,
    referralDiscount,
    referralError,

    // ACTIONS
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    applyReferralCode,

    // SUMMARY
    cartSummary,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
