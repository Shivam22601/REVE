import React from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Truck,
  HeadphonesIcon,
  UserCircle2,
  Sparkles,
  Waves,
  BatteryFull,
  Wifi,
} from "lucide-react";

/* ================= AESTHETIC + MINIMAL ANIMATION ================= */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.96,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const iconVariants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function TrustBadges() {
  const features = [
    {
      icon: <BadgeCheck size={38} strokeWidth={1.5} />,
      title: "100% Authentic Products",
      desc: "Every product is thoughtfully sourced and 100% genuine — so you can shop with complete peace of mind.",
    },
    {
      icon: <UserCircle2 size={38} strokeWidth={1.5} />,
      title: "Trusted & Authorized",
      desc: "Officially authorized products that come with assured quality and reliable warranty support.",
    },
    {
      icon: <Truck size={38} strokeWidth={1.5} />,
      title: "Safe & Careful Delivery",
      desc: "Fast, secure, and carefully handled delivery — because your comfort and trust matter to us.",
    },
    {
      icon: <HeadphonesIcon size={38} strokeWidth={1.5} />,
      title: "Friendly Support",
      desc: "Warm and responsive assistance whenever you need help with orders or queries.",
    },
    {
      icon: <Sparkles size={38} strokeWidth={1.5} />,
      title: "Elegant & Thoughtful Design",
      desc: "Minimal, graceful designs crafted to blend beautifully with your everyday style.",
    },
    {
      icon: <Waves size={38} strokeWidth={1.5} />,
      title: "Soothing Sound Experience",
      desc: "Balanced, calming audio that feels just right — whether you're relaxing or on the move.",
    },
    {
      icon: <BatteryFull size={38} strokeWidth={1.5} />,
      title: "All-Day Comfort",
      desc: "Reliable battery life that supports your routine from morning to night without interruptions.",
    },
    {
      icon: <Wifi size={38} strokeWidth={1.5} />,
      title: "Effortless to Use",
      desc: "Simple, intuitive controls designed to make your experience smooth and stress-free.",
    },
  ];

  return (
    <div className="w-full py-36 bg-white">

      {/* ================= HEADING ================= */}
      <motion.h2
        className="
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl
          font-semibold mb-20
          text-center md:text-left
          px-4 md:ml-40
        "
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        Designed with Care, Chosen by Women
      </motion.h2>

      {/* ================= FEATURES GRID ================= */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 px-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            className="flex flex-col items-center text-center px-4"
            whileHover={{
              y: -4,
              boxShadow: "0 18px 36px rgba(0,0,0,0.06)",
            }}
          >
            {/* ICON */}
            <motion.div
              variants={iconVariants}
              className="
                w-36 h-36 rounded-full
                bg-rose-50
                flex items-center justify-center
                mb-6
              "
            >
              <div className="text-rose-600">
                {f.icon}
              </div>
            </motion.div>

            {/* TITLE */}
            <p className="text-lg font-semibold mb-3 text-gray-900">
              {f.title}
            </p>

            {/* DESCRIPTION */}
            <p className="text-gray-600 leading-relaxed text-sm">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
