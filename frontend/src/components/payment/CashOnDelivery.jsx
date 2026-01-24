import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../LandingPage/CartContext";
import { useAuth } from "../../context/AuthContext";
import { orderAPI } from "../../config/api";
import toast from "react-hot-toast";

export default function CashOnDelivery() {
  const navigate = useNavigate();
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

  const handleConfirm = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      return navigate('/login');
    }

    if (!selectedAddress) {
      toast.error('Please add or select a shipping address in your profile before placing an order.');
      return navigate('/profile');
    }

    setLoading(true);

    const payload = {
      items: cart.map((i) => ({ product: i.id, quantity: i.quantity })),
      shippingAddress: selectedAddress,
      paymentProvider: 'cod',
      paymentIntentId: null,
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
      // navigate to success and pass order id
      clearCart();
      navigate('/order-success', { state: { orderId: res._id, orderNumber: res.orderNumber } });
    } catch (err) {
      console.error('Order creation failed:', err);
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">

        {/* 🔙 Back */}
        <button
          onClick={() => navigate("/payment")}
          className="flex items-center gap-2 text-sm text-gray-500 mb-4"
        >
          <ArrowLeft size={16} /> Back to Payment
        </button>

        {/* 🚚 Icon */}
        <Truck size={52} className="mx-auto text-green-600 mb-4" />

        {/* 🧾 Content */}
        <h2 className="text-2xl font-bold mb-2">Cash on Delivery</h2>
        <p className="text-gray-500 mb-6">
          Pay when your order arrives at your doorstep.
        </p>

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

        {/* ✅ Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`
            w-full py-3 rounded-xl font-semibold text-white
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:opacity-90"
            }
            transition
          `}
        >
          {loading ? "Placing Order..." : "Confirm Order"}
        </button>

        {/* 🔐 Trust */}
        <p className="text-xs text-gray-400 mt-4">
          🚚 Cash will be collected at delivery time
        </p>
      </div>
    </div>
  );
}
