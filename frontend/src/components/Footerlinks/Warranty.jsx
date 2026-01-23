import React, { useState } from "react";

export default function WarrantyClaim() {
  const [formData, setFormData] = useState({
    name: "",
    orderNo: "",
    phone: "",
    purchaseDate: "",
    product: "",
    issue: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 Later backend verification yahin hoga
    console.log("Warranty Claim Submitted:", formData);

    alert(
      "Your warranty claim has been submitted successfully. Our team will contact you shortly 💖"
    );

    setFormData({
      name: "",
      orderNo: "",
      phone: "",
      purchaseDate: "",
      product: "",
      issue: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-lavender-50">

      {/* ================= HERO ================= */}
      <div className="relative py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200/40 to-purple-200/40 blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-800">
            Warranty Claim
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            We’re here to take care of your product — gently and reliably.
          </p>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <div className="max-w-3xl mx-auto px-6 pb-28">
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur rounded-[2.5rem] shadow-2xl p-10 md:p-14 space-y-6"
        >
          {/* NAME */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* ORDER NO */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Order Number
            </label>
            <input
              type="text"
              name="orderNo"
              value={formData.orderNo}
              onChange={handleChange}
              required
              placeholder="e.g. RC12345678"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* CONTACT */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="10-digit mobile number"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* DATE */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Date of Purchase
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* PRODUCT */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleChange}
              required
              placeholder="e.g. Reve Cult Air Pro"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* ISSUE */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Describe the Issue
            </label>
            <textarea
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              required
              placeholder="Briefly describe the issue you are facing"
              rows="4"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full mt-4 py-4 rounded-full text-white font-semibold text-lg
                       bg-gradient-to-r from-pink-500 to-purple-600
                       hover:scale-[1.02] transition shadow-lg"
          >
            Submit Warranty Claim
          </button>

          {/* NOTE */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Your details will be securely verified before approving the claim.
          </p>
        </form>
      </div>
    </div>
  );
}
