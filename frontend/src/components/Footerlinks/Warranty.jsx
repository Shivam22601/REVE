import React, { useState } from "react";

export default function WarrantyPage() {
  const [activeTab, setActiveTab] = useState("activate");

  const [formData, setFormData] = useState({
    name: "",
    orderNo: "",
    phone: "",
    purchaseDate: "",
    product: "",
    issue: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleActivate = (e) => {
    e.preventDefault();
    console.log("Warranty Activated:", formData);
    alert("Warranty activated successfully 🎉");
  };

  const handleClaim = (e) => {
    e.preventDefault();
    console.log("Warranty Claim Submitted:", formData);
    alert("Warranty claim submitted 💖 Our team will contact you.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-lavender-50">

      {/* ================= HERO ================= */}
      <div className="py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-800">
          Warranty Services
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Activate or claim your product warranty easily.
        </p>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex justify-center gap-6 mb-12">
        <button
          onClick={() => setActiveTab("activate")}
          className={`px-8 py-3 rounded-full font-semibold transition
            ${activeTab === "activate"
              ? "bg-pink-500 text-white shadow-lg"
              : "bg-white text-gray-600 border"}`}
        >
          Activate Warranty
        </button>

        <button
          onClick={() => setActiveTab("claim")}
          className={`px-8 py-3 rounded-full font-semibold transition
            ${activeTab === "claim"
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-white text-gray-600 border"}`}
        >
          Claim Warranty
        </button>
      </div>

      {/* ================= FORM ================= */}
      <div className="max-w-3xl mx-auto px-6 pb-28">
        <form
          onSubmit={activeTab === "activate" ? handleActivate : handleClaim}
          className="bg-white/80 backdrop-blur rounded-[2.5rem] shadow-2xl p-10 md:p-14 space-y-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border"
          />

          <input
            type="text"
            name="orderNo"
            placeholder="Order Number"
            required
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Contact Number"
            required
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border"
          />

          <input
            type="date"
            name="purchaseDate"
            required
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border"
          />

          <input
            type="text"
            name="product"
            placeholder="Product Name"
            required
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-xl border"
          />

          {/* ISSUE ONLY FOR CLAIM */}
          {activeTab === "claim" && (
            <textarea
              name="issue"
              placeholder="Describe the issue"
              rows="4"
              required
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border"
            />
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-full text-white font-semibold text-lg
                       bg-gradient-to-r from-pink-500 to-purple-600
                       hover:scale-[1.02] transition shadow-lg"
          >
            {activeTab === "activate"
              ? "Activate Warranty"
              : "Submit Warranty Claim"}
          </button>
        </form>
      </div>
    </div>
  );
}
