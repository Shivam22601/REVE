import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DebitCard() {
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    // ✅ Basic validation
    if (!cardNumber || !expiry || !cvv) {
      toast.error("Please fill all card details");
      return;
    }

    if (cardNumber.length < 12 || cvv.length < 3) {
      toast.error("Invalid card details");
      return;
    }

    // 🔄 Simulate payment processing
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/order-success", { state: { orderNumber: `ORD-${Date.now().toString().slice(-6)}` } });
    }, 1500);
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

        {/* 💳 Header */}
        <div className="flex flex-col items-center mb-6">
          <CreditCard size={44} className="text-pink-600 mb-2" />
          <h2 className="text-2xl font-bold">Debit Card Payment</h2>
          <p className="text-gray-500 text-sm">
            Secure card payment
          </p>
        </div>

        {/* 🧾 Card Form */}
        <input
          type="text"
          placeholder="Card Number"
          maxLength={16}
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
          className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="MM / YY"
            maxLength={5}
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <input
            type="password"
            placeholder="CVV"
            maxLength={3}
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            className="w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        {/* 💳 Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`
            w-full py-3 rounded-xl font-semibold text-white
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:opacity-90"}
            transition
          `}
        >
          {loading ? "Processing Payment..." : "Pay Now"}
        </button>

        {/* 🔐 Trust Text */}
        <p className="text-xs text-gray-400 text-center mt-4">
          🔒 Your card details are securely encrypted
        </p>
      </div>
    </div>
  );
}
