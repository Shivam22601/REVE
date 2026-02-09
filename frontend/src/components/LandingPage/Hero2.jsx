import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "../../assets/f1.jpeg";
import img2 from "../../assets/f2.jpeg";
import img3 from "../../assets/f3.jpeg";

const Hero2 = () => {
  const media = [
    { src: img1 },
    { src: img2 },
    { src: img3 },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % media.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [media.length]);

  const next = () =>
    setCurrent((prev) => (prev + 1) % media.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + media.length) % media.length);

  return (
    <section className="w-full bg-[#f7f3f2]">
      {/* MOBILE SAFE CONTAINER */}
      <div
        className="
          relative w-full overflow-hidden
          aspect-[3/4]
          sm:aspect-auto
          sm:h-[80vh]
          lg:h-screen
        "
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* BACKGROUND BLUR (mobile aesthetic fill) */}
            <img
              src={media[current].src}
              alt=""
              className="
                absolute inset-0 w-full h-full
                object-cover blur-2xl scale-110
                opacity-40
                sm:hidden
              "
            />

            {/* MAIN IMAGE */}
            <img
              src={media[current].src}
              alt={`banner-${current}`}
              className="
                relative
                w-full h-full
                object-contain
                sm:object-cover
              "
            />
          </motion.div>
        </AnimatePresence>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/20 sm:bg-black/25" />

        {/* LEFT */}
        <button
          onClick={prev}
          className="
            absolute left-3 sm:left-6
            top-1/2 -translate-y-1/2
            bg-white/90 hover:bg-white
            p-2 sm:p-4 rounded-full
            shadow
          "
        >
          <ChevronLeft size={22} />
        </button>

        {/* RIGHT */}
        <button
          onClick={next}
          className="
            absolute right-3 sm:right-6
            top-1/2 -translate-y-1/2
            bg-white/90 hover:bg-white
            p-2 sm:p-4 rounded-full
            shadow
          "
        >
          <ChevronRight size={22} />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-5 w-full flex justify-center gap-2">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`
                w-2.5 h-2.5 rounded-full
                transition
                ${
                  current === i
                    ? "bg-white scale-110"
                    : "bg-white/60"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero2;
