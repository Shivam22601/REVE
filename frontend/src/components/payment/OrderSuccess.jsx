import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../LandingPage/CartContext";
import { useEffect, useState } from "react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const orderNumber = location.state?.orderNumber;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Auto-redirect to home after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [clearCart, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-6">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center"
      >
        {/* ✅ Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle size={80} className="text-green-600" />
        </motion.div>

        {/* 🎉 Text */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold mb-3"
        >
          Order Placed Successfully!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-500 mb-8"
        >
          Thank you for shopping with <b>REVE CULT</b> 💖  
          <br />
          Your order will be delivered soon.
          {orderNumber && (
            <div className="mt-3 font-medium text-gray-700">Order Number: <span className="text-pink-600">{orderNumber}</span></div>
          )}
          <br />
          <span className="text-sm text-gray-400">Redirecting to home in {countdown}s...</span>
        </motion.p>

        {/* 🎯 Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() => navigate("/shop")}
            className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:scale-105 transition"
          >
            Continue Shopping
          </button>

          <Link
            to="/"
            className="w-full py-3 border rounded-xl font-semibold hover:bg-gray-100 transition text-center"
          >
            Go to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
