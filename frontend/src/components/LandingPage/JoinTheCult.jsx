import React from "react";
import { useNavigate } from "react-router-dom";

// 🎥 VIDEO
import cultVideo from "../../assets/j1.mp4";

export default function JoinTheCult() {
  const navigate = useNavigate();

  return (
    <div className="w-full mt-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative h-[620px] rounded-3xl overflow-hidden">

          {/* VIDEO */}
          <video
            src={cultVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-110"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/55" />

          {/* CONTENT */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">

            {/* 🔥 MAIN HEADING */}
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Join The Cult
            </h2>

            {/* 🔥 SUB HEADING */}
            <p className="text-white/80 max-w-xl mb-6">
              Premium sound crafted with identity, comfort and emotion.  
              This is more than audio — it’s a movement.
            </p>

            {/* 🔥 CTA BUTTON */}
            <button
              onClick={() => {
                navigate("/profile");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="
                px-10 py-3
                bg-white text-black
                font-semibold rounded-full
                hover:scale-105 hover:bg-gray-200
                transition
              "
            >
              Join Now
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
