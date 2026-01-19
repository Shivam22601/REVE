import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "../../assets/f1.jpg";
import img2 from "../../assets/f2.jpg";
import img3 from "../../assets/f3.jpg";
import img4 from "../../assets/f4.jpg";
import v1 from "../../assets/v1.mp4";
import v2 from "../../assets/v2.mp4";
import v3 from "../../assets/v3.mp4";

const Hero2 = () => {
  const Motion = motion;
  const media = [
    { type: 'image', src: img1 },
    { type: 'video', src: v1 },
    { type: 'image', src: img2 },
    { type: 'video', src: v2 },
    { type: 'image', src: img3 },
    { type: 'video', src: v3 },
    { type: 'image', src: img4 }
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % media.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [media.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % media.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + media.length) % media.length);

  return (
    <section className="relative w-full bg-white overflow-hidden object-cover">
      {/* Slider Container */}
      <div className="relative w-full h-[300px] sm:h-[550px] lg:h-[680px]">
        <AnimatePresence>
          {media[current].type === 'image' ? (
            <Motion.img
              key={current}
              src={media[current].src}
              alt={`banner-${current}`}
              className="absolute w-full h-full object-contain overflow-hidden sm:rounded-xl"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          ) : (
            <Motion.video
              key={current}
              src={media[current].src}
              className="absolute w-full h-full object-cover overflow-hidden sm:rounded-xl"
              autoPlay
              muted
              loop
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>

        {/* Gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-4 sm:p-5 rounded-full shadow-md transition"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-4 sm:p-5 rounded-full shadow-md transition"
        >
          <ChevronRight size={32} />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-6 w-full flex justify-center gap-3">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full ${
                current === i ? "bg-blue-500" : "bg-gray-300"
              } transition-all`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero2;
