import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// ✅ PRODUCTS DATA IMPORT
import products from "../../components/products";

export default function Earbuds() {
  const Motion = motion;
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* 🔥 AESTHETIC HEADER BANNER */}
      <section className="relative py-24 px-6 text-center bg-gradient-to-tr from-[#EDE9FF] via-[#FFE8F7] to-[#F7F4FF] overflow-hidden">

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-pink-300 opacity-20 blur-[200px] rounded-full" />

        <Motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Earbuds by <span className="text-purple-600">REVE CULT</span>
        </Motion.h1>

        <Motion.p
          className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Aesthetic. Soft. Feminine. Designed for modern women who love identity in technology.
        </Motion.p>

        {/* Banner Image → first product image */}
        {products[0] && (
          <Motion.div
            className="relative z-10 mt-10 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <img
              src={products[0].image}
              alt={products[0].name}
              className="w-[350px] md:w-[460px] drop-shadow-2xl"
            />
          </Motion.div>
        )}
      </section>

      {/* PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">
          Choose Your Aesthetic 🎧
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((item) => (
            <Motion.div
              key={item.id}
              className="rounded-3xl overflow-hidden border bg-white shadow-md hover:shadow-xl transition cursor-pointer"
              whileHover={{ scale: 1.04 }}
            >
              <div className="bg-[#F7F4FF] p-8 flex justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-40 h-40 object-contain"
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500 mt-1">
                  ₹{item.salePrice.toLocaleString()}
                </p>

                <button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white w-full py-3 rounded-full font-medium hover:opacity-90 transition">
                  View Details
                </button>
              </div>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="px-6 py-24 bg-gradient-to-r from-[#F6F4FF] to-[#FFE8F7]">
        <div className="max-w-5xl mx-auto text-center">

          <Motion.h2
            className="text-4xl font-extrabold text-gray-900"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Aesthetic Sound Designed for Her
          </Motion.h2>

          <Motion.p
            className="text-gray-600 mt-6 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Every REVE CULT earbud is shaped with softness, identity,
            and feminine comfort in mind.
          </Motion.p>

          <Motion.p
            className="text-gray-700 mt-4 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            🎀 <i>Her vibe. Her sound. Her identity.</i>
          </Motion.p>
        </div>
      </section>
    </div>
  );
}
