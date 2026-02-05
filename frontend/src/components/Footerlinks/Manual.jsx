import React, { useState, useEffect } from "react";
import { productAPI } from "../../config/api";

export default function Manual() {
  const [manualData, setManualData] = useState(null);
  const [selectedManual, setSelectedManual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Try multiple product IDs or fetch all manuals
  const productIds = [
    "6792a8b8c8b8b8b8b8b8b8b8", // Original hardcoded
    // Add more product IDs here if needed
  ];

  useEffect(() => {
    const fetchManuals = async () => {
      try {
        setLoading(true);
        
        // Fetch all manuals from public API
        const allManuals = await productAPI.getAllManuals();
        
        if (allManuals && allManuals.length > 0) {
          // Use the first manual and its product info
          const firstManual = allManuals[0];
          setManualData({
            product: {
              name: firstManual.product?.name || 'Product',
              image: firstManual.product?.images?.[0]?.url || null
            },
            manuals: allManuals
          });
          setSelectedManual(firstManual);
          return;
        }
        
        // If no manuals found, try specific product IDs as fallback
        for (const productId of productIds) {
          try {
            const data = await productAPI.getProductManuals(productId);
            
            if (data.manuals && data.manuals.length > 0) {
              setManualData(data);
              setSelectedManual(data.manuals[0]);
              return;
            }
          } catch (err) {
            // Continue to next ID
          }
        }
        
        // If still no manuals, show empty state
        setManualData({ product: { name: 'Product', image: null }, manuals: [] });
        
      } catch (err) {
        console.error("Error fetching manuals:", err);
        setError("Failed to load product manuals: " + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchManuals();
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

  if (error && !manualData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-lavender-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!manualData || !selectedManual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-lavender-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No product manuals available at this time.</p>
          <p className="text-sm text-gray-500">Please check back later or contact support if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  const { product, manuals } = manualData;
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

      {/* ================= MANUAL SELECTOR ================= */}
      {manuals.length > 1 && (
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {manuals.map((manual) => (
              <button
                key={manual._id}
                onClick={() => setSelectedManual(manual)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedManual._id === manual._id
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-pink-50 hover:text-pink-600 shadow-md'
                }`}
              >
                {manual.title}
              </button>
            ))}
          </div>
        </div>
      )}

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
            {selectedManual.tagline}
          </p>

          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            {selectedManual.intro}
          </p>

          {/* FEATURES */}
          {selectedManual.features && selectedManual.features.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-medium text-rose-600 mb-5">
                ✨ Designed for Everyday Elegance
              </h3>
              <ul className="space-y-3 text-gray-600">
                {selectedManual.features.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-pink-400 text-lg">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* USAGE */}
          {selectedManual.usage && selectedManual.usage.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-medium text-purple-600 mb-5">
                🌸 How to Enjoy Your Sound
              </h3>
              <ol className="list-decimal pl-5 space-y-3 text-gray-600">
                {selectedManual.usage.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* CARE */}
          {selectedManual.care && selectedManual.care.length > 0 && (
            <div>
              <h3 className="text-xl font-medium text-rose-500 mb-5">
                💖 Care & Love
              </h3>
              <ul className="space-y-3 text-gray-600">
                {selectedManual.care.map((rule, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-rose-400 text-lg">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ================= RIGHT : IMAGE ================= */}
        <div className="flex justify-center md:justify-end">
          <div className="relative bg-white/70 backdrop-blur rounded-[3rem] px-14 py-24 shadow-2xl w-full max-w-md">

            {/* Decorative glow */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-60" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-60" />

            <img
              src={selectedManual.images && selectedManual.images.length > 0 ? selectedManual.images[0].url : product.image}
              alt={selectedManual.title || product.name}
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
