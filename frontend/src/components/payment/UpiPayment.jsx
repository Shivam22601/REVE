import { useNavigate } from "react-router-dom";
import { ArrowLeft, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../LandingPage/CartContext";
import { useAuth } from "../../context/AuthContext";
import { orderAPI } from "../../config/api";

export default function UpiPayment() {
  const navigate = useNavigate();

  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { cart, cartSummary, clearCart, referralCode } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.addresses?.length) {
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddress(def);
    }
  }, [user]);
  const isValidUpi = (upi) => {
    // basic UPI validation
    return /^[\w.-]+@[\w.-]+$/.test(upi);
  };

  const handlePayment = async () => {
    if (!upiId) {
      alert("Please enter your UPI ID");
      return;
    }

    if (!isValidUpi(upiId)) {
      alert("Please enter a valid UPI ID (example@bank)");
      return;
    }

    if (!user) {
      alert('Please login to place an order');
      return navigate('/login');
    }

    if (!selectedAddress) {
      alert('Please add or select a shipping address in your profile before placing an order.');
      return navigate('/profile');
    }

    // 🔄 Simulate payment processing
    setLoading(true);

    // In a real integration you'd call your payment provider to get a paymentIntentId; here we simulate one
    const fakePaymentIntentId = `upi_${Date.now()}`;

    const payload = {
      items: cart.map((i) => ({ product: i.id, quantity: i.quantity })),
      shippingAddress: selectedAddress,
      paymentProvider: 'upi',
      paymentIntentId: fakePaymentIntentId,
      referralCode: referralCode || undefined,
      totals: {
        subtotal: cartSummary.subtotal,
        tax: cartSummary.gstAmount,
        shipping: cartSummary.shipping,
        discount: cartSummary.discount,
        grandTotal: cartSummary.grandTotal
      }
    };

    try {
      const res = await orderAPI.createOrder(payload);
      clearCart();
      navigate('/order-success', { state: { orderId: res._id, orderNumber: res.orderNumber } });
    } catch (err) {
      console.error('Order creation failed:', err);
      alert(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">

        {/* 🔙 Back */}
        <button
          onClick={() => navigate("/payment")}
          className="text-sm text-gray-500 mb-4 flex gap-2"
        >
          <ArrowLeft size={16} /> Back to Payment
        </button>

        {/* 📱 Header */}
        <div className="flex flex-col items-center mb-6">
          <Smartphone size={44} className="text-pink-600 mb-2" />
          <h2 className="text-2xl font-bold">UPI Payment</h2>
          <p className="text-gray-500 text-sm">
            Pay using Paytm / PhonePe / Google Pay
          </p>
        </div>

        {/* 🔑 UPI Input */}
        <input
          type="text"
          placeholder="example@bank"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="
            w-full p-3 border rounded-lg mb-4
            focus:outline-none focus:ring-2 focus:ring-pink-400
          "
        />

        {/* 🏷 Shipping Address Selector */}
        <div className="mb-4 text-left">
          <h3 className="font-medium mb-2">Shipping Address</h3>
          {user?.addresses?.length ? (
            <div className="space-y-2">
              {user.addresses.map((addr) => (
                <label key={addr._id || addr.line1} className={`flex items-start gap-3 p-3 border rounded ${selectedAddress?._id === addr._id ? 'border-pink-500 bg-pink-50' : 'border-gray-100'}`}>
                  <input type="radio" name="shipping" checked={selectedAddress?._id === addr._id} onChange={() => setSelectedAddress(addr)} />
                  <div className="text-sm">
                    <div className="font-medium">{addr.name} {addr.isDefault && <span className="text-xs text-gray-500 ml-2">(Default)</span>}</div>
                    <div>{addr.line1}{addr.line2 && `, ${addr.line2}`}</div>
                    <div>{addr.city}, {addr.state} {addr.zip}</div>
                    <div className="text-xs text-gray-500">{addr.country} • Phone: {addr.phone}</div>
                  </div>
                </label>
              ))}
              <button onClick={() => navigate('/profile')} className="text-sm text-pink-600 hover:underline">Add / Edit addresses</button>
            </div>
          ) : (
            <div className="text-sm text-gray-600">No address found. <button onClick={() => navigate('/profile')} className="text-pink-600 hover:underline">Add address</button></div>
          )}
        </div>

        {/* 💳 Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`
            w-full py-3 rounded-xl font-semibold text-white
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
            }
            transition
          `}
        >
          {loading ? "Processing Payment..." : "Pay Now"}
        </button>

        {/* 🔐 Trust Text */}
        <p className="text-xs text-gray-400 text-center mt-4">
          🔒 UPI payments are 100% secure and encrypted
        </p>
      </div>
    </div>
  );
}
