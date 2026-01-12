import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../../config/api";

// 🎥 VIDEOS
import video1 from "../../assets/v1.mp4";
import video2 from "../../assets/v2.mp4";
import video3 from "../../assets/v3.mp4";

export default function FeaturedProduct() {
  const Motion = motion;
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    productAPI
      .getProducts({ limit: 4 })
      .then((res) => {
        if (!mounted) return;
        setItems((res && res.data) || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || String(err));
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  const normalize = (p) => ({
    id: p._id,
    name: p.name,
    salePrice: p.salePrice ?? p.price,
    image: p.images?.[0]?.url || "/placeholder.png",
  });

  return (
    <div className="w-full mt-10 px-6 py-10">

      {/* ================= FEATURED PRODUCTS ================= */}
      <h1 className="text-4xl font-bold mb-10">Recommended</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {loading && <div className="text-center">Loading...</div>}
        {!loading && error && <div className="text-red-500">{error}</div>}
        {!loading && !error && items.map((item) => {
          const it = normalize(item);
          return (
            <Motion.div
              key={it.id}
              onClick={() => navigate(`/product/${it.id}`)}
              className="group p-6 rounded-xl border bg-white cursor-pointer"
              whileHover={{ y: -6 }}
            >
              <div className="w-full h-40 flex items-center justify-center mb-4">
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="text-lg font-semibold">{it.name}</p>

              <p className="text-md font-bold mt-2 text-pink-600">
                Rs. {it.salePrice}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${it.id}`);
                }}
                className="hidden group-hover:block w-full mt-3 py-2 rounded-lg font-semibold border hover:bg-black hover:text-white"
              >
                VIEW DETAILS
              </button>
            </Motion.div>
          );
        })}
      </div>

      {/* ================= 3 VIDEO SECTIONS (SIDE BY SIDE) ================= */}
      <div className="mt-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        <VideoCard
          video={video1}
          title="Where Sound Meets Soul"
          subtitle="Premium sound. Bold identity."
          onClick={() => navigate("/shop")}
        />

        <VideoCard
          video={video2}
          title="Designed for Comfort"
          subtitle="All-day wear. Zero compromise."
          onClick={() => navigate("/shop")}
        />

        <VideoCard
          video={video3}
          title="Sound That Defines You"
          subtitle="Not just audio. An attitude."
          onClick={() => navigate("/shop")}
        />

      </div>

    </div>
  );
}

/* ================= VIDEO CARD COMPONENT ================= */
function VideoCard({ video, title, subtitle, onClick }) {
  return (
    <div className="relative h-[260px] rounded-2xl overflow-hidden bg-black group">

      {/* 🎥 VIDEO */}
      <video
        src={video}
        autoPlay
        loop
        muted
        playsInline
        className="
          absolute inset-0
          w-full h-full
          object-cover
          scale-110
          group-hover:scale-125
          transition duration-700
        "
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/45 group-hover:bg-black/55 transition" />

      {/* CONTENT */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-white/80 mb-4">{subtitle}</p>

        <button
          onClick={onClick}
          className="w-fit px-5 py-2 bg-white text-black rounded-lg font-semibold hover:scale-105 transition"
        >
          SHOP NOW
        </button>
      </div>

    </div>
  );
}
