import React, { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // 🔝 BACK TO TOP (MANUAL)
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔁 NAV + SCROLL TO TOP
  const navigateWithTop = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-gray-300 py-12 px-6 relative">

      {/* 🔝 BACK TO TOP BUTTON */}
      <button
        onClick={handleBackToTop}
        className="absolute top-6 right-6
                   flex items-center gap-2
                   bg-white text-black
                   px-4 py-2 rounded-full
                   font-semibold text-sm
                   shadow-lg
                   hover:scale-105 hover:bg-gray-200
                   transition"
      >
        <ArrowUp size={16} />
        Back to Top
      </button>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-2xl font-semibold mb-4">REVE CULT</h1>

        {/* EMAIL */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-12">
          <p className="text-gray-400 mb-2 md:mb-0">
            Receive the latest updates from Reve Cult
          </p>

          <div className="flex items-center bg-gray-900 border border-gray-700 px-3 py-2 rounded-full w-full md:w-64">
            <input
              type="text"
              placeholder="Email Address"
              className="bg-transparent text-white outline-none flex-1"
            />
            <button className="text-white font-semibold">→</button>
          </div>
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:grid grid-cols-4 gap-12 border-t border-gray-800 pt-10 pb-10">

          {/* SHOP */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {[
                "All Products",
                "Wireless Earbuds",
                "Sports Collection",
                "Premium Series",
              ].map((item) => (
                <li
                  key={item}
                  onClick={() => navigateWithTop("/shop")}
                  className="cursor-pointer hover:text-white transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {[
                "Contact Us",
                "FAQs",
                "Shipping Info",
                "Returns & Exchanges",
                "Warranty",
                "Size Guide",
              ].map((item) => (
                <li
                  key={item}
                  onClick={() => navigateWithTop("/support")}
                  className="cursor-pointer hover:text-white transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* OFFERS */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop by Offers</h3>
            <ul className="space-y-2">
              {[
                "Reve Exclusive Offers",
                "Festival Deals",
                "Gift Store",
              ].map((item) => (
                <li
                  key={item}
                  onClick={() => navigateWithTop("/shop")}
                  className="cursor-pointer hover:text-white transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CATEGORY */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop by Category</h3>
            <ul className="space-y-2">
              {[
                "Wireless Earbuds",
              ].map((item) => (
                <li
                  key={item}
                  onClick={() => navigateWithTop("/shop")}
                  className="cursor-pointer hover:text-white transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden border-t border-gray-800">
          {[1, 2, 3].map((menu) => (
            <div
              key={menu}
              onClick={() => toggleMenu(menu)}
              className="py-4 border-b border-gray-800 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-white text-lg">
                  {menu === 1 && "Our Products"}
                  {menu === 2 && "About Reve Cult"}
                  {menu === 3 && "Support"}
                </h3>
                <span>{openMenu === menu ? "−" : "+"}</span>
              </div>

              {openMenu === menu && (
                <ul className="pl-3 mt-3 space-y-2">
                  {menu !== 3 &&
                    ["Wireless Earbuds", "Headphones", "Accessories"].map(
                      (item) => (
                        <li
                          key={item}
                          onClick={() => navigateWithTop("/shop")}
                          className="hover:text-white transition"
                        >
                          {item}
                        </li>
                      )
                    )}

                  {menu === 3 &&
                    ["Contact Us", "FAQs", "Warranty"].map((item) => (
                      <li
                        key={item}
                        onClick={() => navigateWithTop("/support")}
                        className="hover:text-white transition"
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* COPYRIGHT */}
        <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-800 pt-6">
          © {new Date().getFullYear()} REVE CULT. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
