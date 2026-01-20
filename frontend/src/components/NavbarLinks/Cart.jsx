import { useCart } from "../LandingPage/CartContext";
import { ShoppingCart, Plus, Minus, Trash2, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Cart() {
  const cartContext = useCart();
  const navigate = useNavigate();

  // ✅ SAFEST WAY TO ACCESS CART
  const cart =
    cartContext?.cart ??
    cartContext?.cartItems ??
    [];

  const {
    removeFromCart,
    increaseQty,
    decreaseQty,
    referralCode,
    referralDiscount,
    referralError,
    applyReferralCode,
    cartSummary
  } = cartContext || {};

  const [localReferralCode, setLocalReferralCode] = useState(referralCode || "");
  const [isValidating, setIsValidating] = useState(false);

  // 🔝 Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 💰 Total Amount from context
  const totalAmount = cartSummary?.subtotal || 0;
  const finalAmount = cartSummary?.grandTotal || 0;

  // 🎫 Apply Referral Code
  const handleApplyReferralCode = async () => {
    if (!localReferralCode.trim()) return;

    setIsValidating(true);

    const result = await applyReferralCode?.(localReferralCode.trim());

    setIsValidating(false);

    if (result?.success) {
      // Update local state to match context
      setLocalReferralCode(localReferralCode.toUpperCase());
    }
  };

  // ❌ EMPTY CART
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <ShoppingCart size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          Your Cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Add products to see them here 🛒
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="px-8 py-3 bg-black text-white rounded-lg font-semibold"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">My Cart 🛒</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* ================= CART ITEMS ================= */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-2xl shadow-md"
            >
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name || "Product"}
                className="h-32 w-32 object-contain"
              />

              <div className="flex-1">
                <h3 className="text-xl font-semibold">
                  {item.name}
                </h3>

                <p className="text-pink-600 font-bold mt-1">
                  ₹{item.salePrice}
                </p>

                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={() => decreaseQty?.(item.id)}
                    className="p-2 border rounded-lg"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="font-semibold">
                    {item.quantity || 1}
                  </span>

                  <button
                    onClick={() => increaseQty?.(item.id)}
                    className="p-2 border rounded-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart?.(item.id)}
                className="text-red-500 hover:scale-110 transition"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-md h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Total Items</span>
            <span>{cartSummary?.totalItems || cart.length}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>

          {/* 🎫 REFERRAL CODE SECTION */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Referral Code (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={localReferralCode}
                onChange={(e) => setLocalReferralCode(e.target.value.toUpperCase())}
                placeholder="Enter referral code"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                maxLength={8}
              />
              <button
                onClick={handleApplyReferralCode}
                disabled={isValidating || !localReferralCode.trim()}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? "..." : "Apply"}
              </button>
            </div>
            {referralError && (
              <p className="text-red-500 text-sm mt-1">{referralError}</p>
            )}
            {referralDiscount > 0 && (
              <p className="text-green-600 text-sm mt-1">
                ✓ Referral discount applied: ₹{referralDiscount}
              </p>
            )}
          </div>

          {cartSummary?.gstAmount > 0 && (
            <div className="flex justify-between mb-2">
              <span>Tax (GST {cartSummary.gstPercent}%)</span>
              <span>₹{cartSummary.gstAmount}</span>
            </div>
          )}

          {cartSummary?.shipping > 0 && (
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹{cartSummary.shipping}</span>
            </div>
          )}

          {cartSummary?.discount > 0 && (
            <div className="flex justify-between mb-2 text-green-600">
              <span>Discount</span>
              <span>-₹{cartSummary.discount}</span>
            </div>
          )}

          <div className="flex justify-between mb-4">
            <span>Total Amount</span>
            <span className="font-bold text-pink-600">
              ₹{finalAmount}
            </span>
          </div>

          {/* ✅ PAYMENT NAVIGATION */}
          <button
            onClick={() => navigate("/payment")}
            className="
              w-full py-3
              bg-gradient-to-r from-pink-500 to-purple-600
              text-white rounded-xl font-bold
              hover:scale-[1.02] transition
            "
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
