import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Background image
import aboutBg from "../../assets/logo.jpg";

/* ================= STORY SLIDES DATA ================= */

const STORY_SETS = [
  {
    key: "lifestyle", 
    title: "Lifestyle — Youth Girls",
    slides: [
      { text: "Why does tech still look boring?" },
      { text: "REVE CULT is changing the vibe." },
      { text: "Aesthetics. Comfort. Identity." },
      { text: "Earbuds that feel like YOU\n@revecult" },
    ],
  },
  {
    key: "empower",
    title: "Women Empowerment — Gen Z",
    slides: [
      { text: "Not a brand." },
      { text: "A movement." },
      { text: "Designed by women. For women." },
      { text: "Her sound. Her style. Her power.\n@revecult" },
    ],
  },
  {
    key: "launch",
    title: "General Launch",
    slides: [
      { text: "Something aesthetic is coming." },
      { text: "Clean design. Beautiful audio." },
      { text: "A brand for women & Gen Z." },
      { text: "REVE CULT — launching soon.\n@revecult" },
    ],
  },
];

export default function About() {
  const Motion = motion;
  const [activeSet, setActiveSet] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const storyRef = useRef(null);
  const trimanRef = useRef(null);

  const goNext = () => {
    const set = STORY_SETS[activeSet];
    if (activeSlide < set.slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      setActiveSet((activeSet + 1) % STORY_SETS.length);
      setActiveSlide(0);
    }
  };

  const goPrev = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    } else {
      const prevSet =
        activeSet === 0 ? STORY_SETS.length - 1 : activeSet - 1;
      setActiveSet(prevSet);
      setActiveSlide(STORY_SETS[prevSet].slides.length - 1);
    }
  };

  return (
    <div className="bg-white text-gray-900 overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6">
        <img
          src={aboutBg}
          alt="About REVE CULT"
          className="absolute inset-0 w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-white/50" />

        <div className="relative z-10 max-w-4xl text-center">
          <Motion.h1
            className="text-4xl md:text-6xl font-extrabold"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            About <span className="font-light text-gray-500">REVE CULT</span>
          </Motion.h1>

          <Motion.p
            className="mt-4 text-xl md:text-2xl text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Her Sound. Her Style. Her Story.
          </Motion.p>

          {/* ONLY OUR STORY BUTTON LEFT IN HERO */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() =>
                storyRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3 rounded-full 
                         border border-pink-300 
                         text-pink-600 font-semibold
                         hover:bg-pink-50 transition
                         text-sm sm:text-base"
            >
              Our Story
            </button>
          </div>
        </div>
      </section>

      {/* ================= FULL OUR STORY ================= */}
      <section
        ref={storyRef}
        className="max-w-5xl mx-auto px-6 py-24 space-y-20"
      >
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Our Journey
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            The dream that became REVE CULT
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">🌸 How It All Started</h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            Every idea begins with a moment.  
            For <strong>REVE CULT</strong>, that moment began with
            <strong> Atman</strong>, who simply wanted to gift his girlfriend
            a pair of earbuds that matched her personality.
            <br /><br />
            He searched everywhere — but found only bulky,
            bold, masculine designs.
            <br /><br />
            Nothing soft. Nothing aesthetic. Nothing made for her.
          </p>
        </div>

        <div>
          <p className="text-xl md:text-2xl font-semibold italic">
            “Why isn’t tech designed for women?”
          </p>
          <p className="mt-3 text-lg text-gray-700">
            That single question became the foundation of everything.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">🤝 The Dream Shared</h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            Atman shared his frustration with his closest friend
            <strong> Ayush</strong>.
            Together, they realized the tech industry had ignored women’s
            identity, style, and emotions.
            <br /><br />
            So they decided to create something different.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">✨ The Birth of REVE CULT</h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            They named it <strong>REVE</strong> — meaning “dream” in French.
            <br /><br />
            REVE CULT became a women-first, Gen Z tech movement —
            blending aesthetics, sound, emotion, and individuality.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4">🎧 From Sketch to Sound</h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            From notebook sketches to real earbuds —
            every curve, color, and detail is inspired by women.
            <br /><br />
            REVE CULT earbuds are not just gadgets —
            they are fashion, expression, and confidence.
          </p>
        </div>

        {/* QUOTE + BRAND CREDIT */}
        <div className="text-center space-y-4">
          <p className="text-2xl font-semibold">
            “Tech can be beautiful.  
            Tech can be feminine.  
            Tech can be HER style.”
          </p>

          <div
            className="inline-block px-6 py-2 rounded-full 
                       bg-gradient-to-r from-pink-100 to-purple-100 
                       text-pink-700 font-semibold text-sm"
          >
            A Brand by <strong>TRIMAN CULT TECH PVT LTD</strong>
          </div>
        </div>
      </section>

      {/* ================= STORY SLIDES ================= */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Motion.div
          key={`${activeSet}-${activeSlide}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white border rounded-3xl 
                     p-12 text-center shadow-sm"
        >
          <p className="text-3xl font-semibold whitespace-pre-line">
            {STORY_SETS[activeSet].slides[activeSlide].text}
          </p>

          <button
            onClick={goPrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 
                       bg-white p-3 rounded-full shadow"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={goNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 
                       bg-white p-3 rounded-full shadow"
          >
            <ChevronRight />
          </button>
        </Motion.div>
      </section>

      {/* ================= TRIMAN CULT ================= */}
      <section
        ref={trimanRef}
        className="max-w-5xl mx-auto px-6 py-24 border-t"
      >
        <div className="mb-10 flex justify-start">
  <button
    onClick={() =>
      trimanRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    className="px-7 py-3 rounded-full 
               bg-gradient-to-r from-pink-400 to-purple-400 
               text-white font-semibold
               hover:scale-105 transition"
  >
    Read TRIMAN CULT →
  </button>
</div>


        <h2 className="text-4xl font-bold text-center mb-10">
          TRIMAN CULT — The Legacy
        </h2>

        <p className="text-lg text-gray-700 mb-6">
          <strong>TRIMAN CULT TECH PRIVATE LIMITED</strong> is the parent company
          behind REVE CULT — built on unity, family, and vision.
        </p>

        <ul className="list-disc ml-6 text-lg text-gray-700 mb-6">
          <li><strong>TRI</strong> — Trikal (Past, Present, Future)</li>
          <li><strong>MAN</strong> — Atman (Soul & Identity)</li>
        </ul>

        <p className="text-lg text-gray-700">
          TRIMAN CULT builds aesthetic, community-driven tech brands.
          REVE CULT is its first women-first revolution.
        </p>

        <div className="mt-10 text-center">
          <p className="text-2xl font-extrabold bg-gradient-to-r 
                        from-pink-500 to-purple-500 
                        bg-clip-text text-transparent">
            Built under TRIMAN CULT TECH PVT LTD
          </p>
        </div>
      </section>
    </div>
  );
}
 