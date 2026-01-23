import React, { useState, useEffect } from "react";
import { productAPI } from "../../config/api";

export default function Manual() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded product ID for the manual - in a real app, this could come from props or config
  const manualProductId = "6792a8b8c8b8b8b8b8b8b8b8"; // Replace with actual product ID

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productAPI.getProductBasic(manualProductId);
        setProduct({
          name: data.name,
          image: data.images && data.images.length > 0 ? data.images[0].url : "",
          tagline: "Sound that feels as beautiful as it looks.",
          intro: "Designed for women who love elegance in every detail, Reve Cult Air Pro blends refined aesthetics with powerful performance — making every moment sound effortlessly beautiful.",
          features: [
            "Soft, balanced sound with rich bass that never overwhelms",
            "Active Noise Cancellation for calm, focused listening",
            "Up to 40 hours of graceful, uninterrupted playback",
            "Fast charging — 10 minutes for hours of listening",
            "Feather-light design for all-day comfort",
          ],
          usage: [
            "Gently charge your earbuds fully before first use.",
            "Open the case to activate pairing mode automatically.",
            "Select 'Reve Cult Air Pro' from your Bluetooth settings.",
            "Use soft touch gestures to control music and calls.",
            "Place earbuds back in the case after use for care.",
          ],
          care: [
            "Keep away from water, heat, and harsh environments.",
            "Clean delicately using a soft, dry cloth.",
            "Avoid prolonged use at high volume levels.",
            "Store safely in the charging case when not in use.",
          ],
        });
      } catch (err) {
        setError("Failed to load product information");
        console.error("Error fetching product:", err);
        // Fallback to hardcoded data if API fails
        setProduct({
          name: "Reve Cult Air Pro",
          tagline: "Sound that feels as beautiful as it looks.",
          image: "https://cdn.shopify.com/s/files/1/0680/4150/7113/products/airpro-1_800x.png?v=1697054861",
          intro: "Designed for women who love elegance in every detail, Reve Cult Air Pro blends refined aesthetics with powerful performance — making every moment sound effortlessly beautiful.",
          features: [
            "Soft, balanced sound with rich bass that never overwhelms",
            "Active Noise Cancellation for calm, focused listening",
            "Up to 40 hours of graceful, uninterrupted playback",
            "Fast charging — 10 minutes for hours of listening",
            "Feather-light design for all-day comfort",
          ],
          usage: [
            "Gently charge your earbuds fully before first use.",
            "Open the case to activate pairing mode automatically.",
            "Select 'Reve Cult Air Pro' from your Bluetooth settings.",
            "Use soft touch gestures to control music and calls.",
            "Place earbuds back in the case after use for care.",
          ],
          care: [
            "Keep away from water, heat, and harsh environments.",
            "Clean delicately using a soft, dry cloth.",
            "Avoid prolonged use at high volume levels.",
            "Store safely in the charging case when not in use.",
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-lavender-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product manual...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-lavender-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-lavender-50">

      {/* ================= HERO ================= */}
      <div className="relative py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200/40 to-purple-200/40 blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-wide text-gray-800">
            Product Manual
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Crafted with care. Designed for comfort. Styled for you.
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 pb-28 grid md:grid-cols-2 gap-24 items-start">

        {/* ================= LEFT : CONTENT ================= */}
        <div className="bg-white/80 backdrop-blur rounded-[2.5rem] p-12 shadow-xl">

          <span className="inline-block text-sm tracking-widest text-pink-500 mb-3">
            USER GUIDE
          </span>

          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            {product.name}
          </h2>

          <p className="text-gray-500 italic mb-6">
            {product.tagline}
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            {product.intro}
          </p>

          {/* FEATURES */}
          <div className="mb-10">
            <h3 className="text-xl font-medium text-rose-600 mb-5">
              ✨ Designed for Everyday Elegance
            </h3>
            <ul className="space-y-3 text-gray-600">
              {product.features.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-pink-400 text-lg">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* USAGE */}
          <div className="mb-10">
            <h3 className="text-xl font-medium text-purple-600 mb-5">
              🌸 How to Enjoy Your Sound
            </h3>
            <ol className="list-decimal pl-5 space-y-3 text-gray-600">
              {product.usage.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          {/* CARE */}
          <div>
            <h3 className="text-xl font-medium text-rose-500 mb-5">
              💖 Care & Love
            </h3>
            <ul className="space-y-3 text-gray-600">
              {product.care.map((rule, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-rose-400 text-lg">•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ================= RIGHT : IMAGE ================= */}
        <div className="flex justify-center md:justify-end">
          <div className="relative bg-white/70 backdrop-blur rounded-[3rem] px-14 py-24 shadow-2xl w-full max-w-md">

            {/* Decorative glow */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-60" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-60" />

            <img
              src={product.image}
              alt={product.name}
              className="
                relative z-10
                h-[480px] md:h-[580px]
                w-auto
                mx-auto
                object-contain
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
