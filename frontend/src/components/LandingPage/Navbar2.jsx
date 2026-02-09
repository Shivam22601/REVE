import {
  Search,
  User,
  ShoppingCart,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.jpg";
import { productAPI } from "../../config/api";
import { useAuth } from "../../context/AuthContext";

const Navbar2 = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    let mounted = true;
    productAPI
      .getProducts({ limit: 100, sort: 'sortOrder -createdAt _id' })
      .then((res) => {
        // 🔴 IMPORTANT: backend ke hisaab se adjust kar sakte ho
        setItems(res?.data?.products || res?.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredProducts =
    query.trim().length > 0
      ? items
          .filter((p) =>
            p?.name?.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 6)
      : [];

  /* ================= HANDLERS ================= */
  const handleSelect = (id) => {
    setQuery("");
    setMobileSearch(false);
    navigate(`/product/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b shadow-md">
        <div className="flex items-center justify-between px-4 md:px-14 py-2">

          {/* LEFT */}
          <div className="flex items-center gap-4 md:gap-8">
            <button
              className="md:hidden"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={24} />
            </button>

            <Link to="/" onClick={scrollTop}>
              <img
                src={Logo}
                alt="REVE CULT"
                className="h-10 md:h-12 hover:scale-105 transition"
              />
            </Link>

            <ul className="hidden md:flex gap-10 text-[13px] font-semibold tracking-wide text-gray-700">
              {[
                ["/", "HOME"],
                ["/shop", "SHOP"],
                ["/aboutAs", "ABOUT US"],
                ["/support", "SUPPORT"],
                ["/feedback", "FEEDBACK"],
              ].map(([path, label]) => (
                <Link
                  key={path}
                  to={path}
                  onClick={scrollTop}
                  className="hover:text-pink-600 transition"
                >
                  {label}
                </Link>
              ))}
            </ul>
          </div>

          {/* ================= DESKTOP SEARCH ================= */}
          <div className="hidden md:block relative w-72 z-50">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent flex-1 outline-none text-sm"
              />
              <Search size={16} />
            </div>

            {filteredProducts.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-xl border overflow-hidden">
                {filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => handleSelect(p._id)}
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <img
                      src={p.images?.[0]?.url || "/placeholder.png"}
                      alt={p.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span className="text-sm">{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                className="md:hidden"
                onClick={() => setMobileSearch(!mobileSearch)}
              >
                <Search size={20} />
              </button>

              <Heart
                onClick={() => navigate("/wishlist")}
                className="cursor-pointer hover:text-pink-600"
              />
                <User onClick={() => {
                if (user) {
                  navigate("/profile");
                } else {
                  navigate("/login");
                }
                scrollTop();
              }} className="cursor-pointer hover:text-pink-600 transition" />
              <ShoppingCart
                onClick={() => navigate("/cart")}
                className="cursor-pointer hover:text-pink-600"
              />
            </div>

            {/* POWERED BY (VISIBLE EVERYWHERE) */}
            <span className="text-[9px] md:text-[10px] text-gray-400 tracking-wider">
              Powered by Triman Cult Tech Pvt. Ltd.
            </span>
          </div>
        </div>
      </nav>

      {/* NAVBAR SPACE */}
      <div className="h-[64px]" />

      {/* ================= MOBILE SEARCH ================= */}
      {mobileSearch && (
        <div className="md:hidden bg-white px-4 py-3 shadow-md relative z-50">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-gray-100 rounded-full px-4 py-2 outline-none"
          />

          {filteredProducts.length > 0 && (
            <div className="mt-2 bg-white rounded-xl shadow-xl border overflow-hidden">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  onClick={() => handleSelect(p._id)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100"
                >
                  <img
                    src={p.images?.[0]?.url || "/placeholder.png"}
                    alt={p.name}
                    className="w-8 h-8 rounded"
                  />
                  <span className="text-sm">{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MOBILE MENU ================= */}
      {mobileMenu && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
          <div className="w-64 bg-white h-full p-6">
            <button onClick={() => setMobileMenu(false)}>
              <X size={24} />
            </button>

            <ul className="mt-8 flex flex-col gap-6 font-medium">
              {[
                ["/", "HOME"],
                ["/shop", "SHOP"],
                ["/aboutAs", "ABOUT US"],
                ["/support", "SUPPORT"],
                 ["/feedback", "FEEDBACK"],
              ].map(([path, label]) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => {
                    scrollTop();
                    setMobileMenu(false);
                  }}
                >
                  {label}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar2;
