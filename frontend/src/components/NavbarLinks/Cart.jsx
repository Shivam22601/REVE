import { useCart } from "../LandingPage/CartContext";
import { ShoppingCart, Plus, Minus, Trash2, Tag, MapPin, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { pincodeAPI } from "../../config/api";

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

  // Pincode State
  const [pincode, setPincode] = useState("");
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [serviceableLocation, setServiceableLocation] = useState(null);

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

  const handleCheckPincode = async () => {
    if (!pincode.trim() || pincode.length < 6) {
      setPincodeError("Please enter a valid 6-digit pincode");
      return;
    }
    setCheckingPincode(true);
    setPincodeError("");
    setServiceableLocation(null);
    setIsPincodeVerified(false);
    
    try {
      const res = await pincodeAPI.verify(pincode);
      if (res.serviceable) {
        setIsPincodeVerified(true);
        if (res.city && res.state) {
          setServiceableLocation(`${res.city}, ${res.state}`);
        } else {
          setServiceableLocation('your location');
        }
      }
    } catch (err) {
      setIsPincodeVerified(false);
      setPincodeError(err.message || "Delivery not available in this area");
      setServiceableLocation(null);
    } finally {
      setCheckingPincode(false);
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
          {/* Pincode Check */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Check Delivery Availability
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPincode(val);
                    if (val.length < 6) {
                      setIsPincodeVerified(false);
                      setServiceableLocation(null);
                      setPincodeError("");
                    }
                  }}
                  placeholder="Enter Pincode"
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isPincodeVerified ? 'border-green-500 focus:ring-green-500' : 
                    pincodeError ? 'border-red-500 focus:ring-red-500' : 
                    'focus:ring-pink-500'
                  }`}
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleCheckPincode}
                disabled={checkingPincode || pincode.length !== 6}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {checkingPincode ? "Checking..." : "Check"}
              </button>
            </div>
            
            {pincodeError && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                <XCircle className="w-4 h-4" />
                <span>{pincodeError}</span>
              </div>
            )}
            
            {isPincodeVerified && serviceableLocation && (
              <div className="flex items-center gap-2 text-green-600 text-sm mt-2 bg-green-50 p-2 rounded">
                <CheckCircle className="w-4 h-4" />
                <span>Delivery available to <b>{serviceableLocation}</b></span>
              </div>
            )}
            
            {!isPincodeVerified && !pincodeError && (
              <p className="text-xs text-gray-500 mt-2">
                * Please verify your pincode to proceed
              </p>
            )}
          </div>

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
            disabled={!isPincodeVerified}
            title={!isPincodeVerified ? "Please verify delivery pincode first" : ""}
            className={`
              w-full py-3
              text-white rounded-xl font-bold
              transition
              ${!isPincodeVerified 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              }
            `}
          >
            {isPincodeVerified ? "Proceed to Checkout" : "Verify Pincode to Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
}
