import { useNavigate } from "react-router-dom";
import { ArrowLeft, Landmark } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NetBanking() {
  const navigate = useNavigate();

  const [bank, setBank] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    if (!bank) {
      toast.error("Please select a bank");
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

        {/* 🏦 Header */}
        <div className="flex flex-col items-center mb-6">
          <Landmark size={44} className="text-pink-600 mb-2" />
          <h2 className="text-2xl font-bold">Net Banking</h2>
          <p className="text-gray-500 text-sm">
            Secure payment via your bank
          </p>
        </div>

        {/* 🏦 Bank Select */}
        <select
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="
            w-full p-3 border rounded-lg mb-4
            focus:outline-none focus:ring-2 focus:ring-pink-400
          "
        >
          <option value="">Select Bank</option>
          <option value="SBI">State Bank of India</option>
          <option value="HDFC">HDFC Bank</option>
          <option value="ICICI">ICICI Bank</option>
          <option value="Axis">Axis Bank</option>
          <option value="PNB">Punjab National Bank</option>
        </select>

        {/* 💳 Proceed Button */}
        <button
          onClick={handlePayment}
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
          {loading ? "Redirecting to Bank..." : "Proceed"}
        </button>

        {/* 🔐 Trust Text */}
        <p className="text-xs text-gray-400 text-center mt-4">
          🔒 You will be redirected to your bank's secure page
        </p>
      </div>
    </div>
  );
}
