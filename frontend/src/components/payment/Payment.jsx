import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../LandingPage/CartContext";
import { useAuth } from "../../context/AuthContext";
import { paymentAPI, orderAPI } from "../../config/api";
import toast from "react-hot-toast";
import logo from "../../assets/logo.jpg";

export default function Payment() {
  const navigate = useNavigate();
  const { cart, cartSummary, clearCart, referralCode } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFreeOrder = async (selectedAddress) => {
    setLoading(true);
    try {
      const payload = {
        items: cart.map((i) => ({ product: i.id, quantity: i.quantity })),
        shippingAddress: selectedAddress,
        paymentProvider: 'free',
        paymentIntentId: `free_${Date.now()}`,
        referralCode: referralCode || undefined,
        totals: {
          subtotal: cartSummary.subtotal,
          tax: cartSummary.gstAmount,
          shipping: cartSummary.shipping,
          discount: cartSummary.discount,
          grandTotal: cartSummary.grandTotal
        }
      };

      const res = await orderAPI.createOrder(payload);
      clearCart();
      navigate('/order-success', { state: { orderId: res._id, orderNumber: res.orderNumber } });
      toast.success('Order Placed Successfully!');
    } catch (err) {
      console.error('Free order creation failed:', err);
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      return navigate('/login');
    }

    if (!cart || cart.length === 0) {
      toast.error('Your cart is empty');
      return navigate('/cart');
    }

    if (!user.addresses || user.addresses.length === 0) {
       toast.error('Please add an address first');
       return navigate('/profile');
    }
    
    // Use default address or first one
    const selectedAddress = user.addresses.find(a => a.isDefault) || user.addresses[0];

    // Check for free order or invalid amount
    if (cartSummary.grandTotal <= 0 || isNaN(cartSummary.grandTotal)) {
      if (isNaN(cartSummary.grandTotal)) {
        toast.error("Invalid cart total. Please refresh.");
        return;
      }
      handleFreeOrder(selectedAddress);
      return;
    }

    setLoading(true);
    try {
      console.log('Initiating payment for amount:', cartSummary.grandTotal);
      
      // 1. Create Order on Backend (Razorpay)
      const orderData = await paymentAPI.createOrder({ 
        amount: cartSummary.grandTotal,
        currency: 'INR'
      });

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "REVE CULT",
        description: "Order Payment",
        image: logo,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 2. Verify Payment
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            // 3. Create Order in Database
            const payload = {
              items: cart.map((i) => ({ product: i.id, quantity: i.quantity })),
              shippingAddress: selectedAddress,
              paymentProvider: 'razorpay',
              paymentIntentId: response.razorpay_payment_id,
              referralCode: referralCode || undefined,
              totals: {
                subtotal: cartSummary.subtotal,
                tax: cartSummary.gstAmount,
                shipping: cartSummary.shipping,
                discount: cartSummary.discount,
                grandTotal: cartSummary.grandTotal
              }
            };

            const res = await orderAPI.createOrder(payload);
            clearCart();
            navigate('/order-success', { state: { orderId: res._id, orderNumber: res.orderNumber } });
            toast.success('Payment Successful!');
          } catch (err) {
            console.error('Payment verification failed:', err);
            toast.error('Payment verification failed. Please contact support if money was deducted.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: selectedAddress.mobile
        },
        theme: {
          color: "#db2777" // Pink-600
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        toast.error(response.error.description);
      });
      rzp1.open();

    } catch (err) {
      console.error('Payment initialization failed:', err);
      toast.error(err.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-sm text-gray-500 mb-6"
        >
          <ArrowLeft size={16} /> Back to Cart
        </button>

        <h1 className="text-3xl font-bold mb-6">Choose Payment Method</h1>

        <button
          onClick={handleRazorpayPayment}
          disabled={loading}
          className="w-full flex items-center gap-4 p-4 mb-3 rounded-xl border hover:border-pink-500 transition disabled:opacity-50"
        >
          <span className="text-pink-600"><CreditCard /></span>
          <span className="font-medium">Pay Online (UPI, Cards, NetBanking)</span>
          {loading && <span className="text-sm text-gray-500 ml-auto">Processing...</span>}
        </button>

        <button
          onClick={() => navigate("/payment/cod")}
          className="w-full flex items-center gap-4 p-4 mb-3 rounded-xl border hover:border-pink-500 transition"
        >
          <span className="text-pink-600"><Truck /></span>
          <span className="font-medium">Cash on Delivery</span>
        </button>
      </div>
    </div>
  );
}
