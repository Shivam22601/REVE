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

  useEffect(() => {
    let mounted = true;
    productAPI
      .getProducts({ limit: 100 })
      .then((res) => mounted && setItems(res?.data || []))
      .catch(() => {});
    return () => (mounted = false);
  }, []);

  const filteredProducts =
    query.length > 0
      ? items
          .map((p) => ({
            id: p._id,
            name: p.name,
            salePrice: p.salePrice ?? p.price,
            image: p.images?.[0]?.url || "/placeholder.png",
          }))
          .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      : [];

  const handleSelect = (id) => {
    setQuery("");
    setMobileSearch(false);
    navigate(`/product/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-md">
        <div className="flex items-center justify-between px-4 md:px-14 py-2">

          {/* LEFT */}
          <div className="flex items-center gap-4 md:gap-8">
            <button className="md:hidden" onClick={() => setMobileMenu(true)}>
              <Menu size={24} />
            </button>

            <Link to="/" onClick={scrollTop}>
              <img src={Logo} alt="REVE CULT" className="h-10 md:h-12 hover:scale-105 transition" />
            </Link>

            <ul className="hidden md:flex gap-10 text-[13px] font-semibold tracking-wide text-gray-700">
              {[
                ["/", "HOME"],
                ["/shop", "SHOP"],
                ["/about", "ABOUT US"],
                ["/support", "SUPPORT"],
              ].map(([path, label]) => (
                <Link key={path} to={path} onClick={scrollTop} className="hover:text-pink-600 transition">
                  {label}
                </Link>
              ))}
            </ul>
          </div>

          {/* SEARCH DESKTOP */}
          <div className="hidden md:block w-72">
            <div className="flex items-center bg-gray-100/80 rounded-full px-4 py-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent flex-1 outline-none text-sm"
              />
              <Search size={16} />
            </div>
          </div>

          {/* RIGHT ICONS + POWERED BY */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3 md:gap-4">
              <button className="md:hidden" onClick={() => setMobileSearch(!mobileSearch)}>
                <Search size={20} />
              </button>

              <Heart onClick={() => navigate("/wishlist")} className="cursor-pointer hover:text-pink-600 transition" />
              <User onClick={() => user ? navigate("/profile") : navigate("/login")} className="cursor-pointer hover:text-pink-600 transition" />
              <ShoppingCart onClick={() => navigate("/cart")} className="cursor-pointer hover:text-pink-600 transition" />
            </div>

            <span className="hidden lg:block text-[10px] text-gray-400 tracking-wider">
              Powered by Triman Culttech Pvt. Ltd.
            </span>
          </div>
        </div>
      </nav>

      <div className="h-[64px]" />

      {/* MOBILE MENU */}
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
                ["/about", "ABOUT US"],
                ["/support", "SUPPORT"],
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

      {/* MOBILE SEARCH */}
      {mobileSearch && (
        <div className="md:hidden bg-white px-4 py-3 shadow-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-gray-100 rounded-full px-4 py-2 outline-none"
          />
        </div>
      )}
    </>
  );
};

export default Navbar2;
