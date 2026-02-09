import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../../config/api";

// 🎥 VIDEOS
import video1 from "../../assets/v1.mp4";
import video2 from "../../assets/v2.mp4";
import video3 from "../../assets/v3.mp4";

/* ================= PRODUCT ANIMATIONS ================= */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/* ================= VIDEO ANIMATIONS ================= */
const videoContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const videoCardVariants = {
  hidden: {
    opacity: 0,
    y: 80,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function FeaturedProduct() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    productAPI
      .getProducts({ limit: 8, sort: "sortOrder -createdAt _id" })
      .then((res) => {
        if (!mounted) return;
        setItems(res?.data || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || String(err));
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  // 🔹 SPLIT PRODUCTS
  const row1 = items.slice(0, 2);
  const row2 = items.slice(2, 5);
  const row3 = items.slice(5, 7);

  return (
    <div className="w-full mt-10 px-6 py-10">

      {/* ================= FEATURED PRODUCTS ================= */}
      <h1 className="text-4xl font-bold mb-14">Recommended</h1>

      {loading && <div className="text-center">Loading...</div>}
      {!loading && error && <div className="text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="space-y-16">

          {/* ROW 1 */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            {row1.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </motion.div>

          {/* ROW 2 */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            {row2.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </motion.div>

          {/* ROW 3 */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            {row3.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </motion.div>

        </div>
      )}

      {/* ================= VIDEO SECTION ================= */}
      <motion.div
        className="mt-28 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={videoContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >

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

      </motion.div>
    </div>
  );
}

/* ================= PRODUCT CARD ================= */
function ProductCard({ item }) {
  const navigate = useNavigate();

  const product = {
    id: item._id,
    name: item.name,
    price: item.salePrice ?? item.price,
    image: item.images?.[0]?.url || "/placeholder.png",
  };

  return (
    <motion.div
      variants={cardVariants}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group p-6 rounded-2xl border bg-white cursor-pointer"
      whileHover={{ y: -8 }}
    >
      <div className="w-full h-56 flex items-center justify-center mb-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      <p className="text-lg font-semibold">{product.name}</p>

      <p className="text-lg font-bold mt-2 text-pink-600">
        Rs. {product.price}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/product/${product.id}`);
        }}
        className="hidden group-hover:block w-full mt-4 py-2 rounded-lg font-semibold border hover:bg-black hover:text-white transition"
      >
        VIEW DETAILS
      </button>
    </motion.div>
  );
}

/* ================= VIDEO CARD ================= */
function VideoCard({ video, title, subtitle, onClick }) {
  return (
    <motion.div
      variants={videoCardVariants}
      className="relative h-[260px] rounded-2xl overflow-hidden bg-black group cursor-pointer"
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
    >
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

      <div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 transition" />

      <div className="relative z-10 h-full flex flex-col justify-center px-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-white/80 mb-4">{subtitle}</p>

        <button className="w-fit px-5 py-2 bg-white text-black rounded-lg font-semibold hover:scale-105 transition">
          SHOP NOW
        </button>
      </div>
    </motion.div>
  );
}
