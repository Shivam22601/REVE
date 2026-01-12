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

const Navbar2 = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    productAPI
      .getProducts({ limit: 100 })
      .then((res) => {
        if (!mounted) return;
        setItems((res && res.data) || []);
      })
      .catch(() => {})

    return () => (mounted = false);
  }, []);

  // 🔍 FILTER PRODUCTS
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

  // 🔝 scroll helper
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-16 py-4">

          {/* LEFT */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Mobile Menu */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={26} />
            </button>

            {/* LOGO */}
            <Link to="/" onClick={scrollTop}>
              <img
                src={Logo}
                alt="REVE CULT"
                className="h-12 md:h-16 w-auto object-contain transition hover:scale-105"
              />
            </Link>

            {/* Desktop Links */}
            <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-800">
              <Link to="/" onClick={scrollTop} className="hover:text-pink-600">
                HOME
              </Link>

              <Link
                to="/shop"
                onClick={scrollTop}
                className="hover:text-pink-600"
              >
                SHOP
              </Link>

              <Link to="/about" onClick={scrollTop} className="hover:text-pink-600">
                ABOUT US
              </Link>

              <Link to="/support" onClick={scrollTop} className="hover:text-pink-600">
                SUPPORT
              </Link>
            </ul>
          </div>

          {/* ================= DESKTOP SEARCH ================= */}
          <div className="relative hidden md:block w-80">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent flex-1 outline-none text-sm"
              />
              <Search size={18} />
            </div>

            {/* SEARCH SUGGESTIONS */}
            {filteredProducts.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-xl overflow-hidden z-50">
                {filteredProducts.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Rs. {item.salePrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden"
              onClick={() => setMobileSearch(!mobileSearch)}
            >
              <Search />
            </button>

            <Heart
              onClick={() => {
                navigate("/wishlist");
                scrollTop();
              }}
              className="cursor-pointer hover:text-pink-600"
            />

            <User
              onClick={() => {
                navigate("/profile");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="cursor-pointer hover:text-pink-600"
            />

            <ShoppingCart
              onClick={() => {
                navigate("/cart");
                scrollTop();
              }}
              className="cursor-pointer hover:text-pink-600"
            />
          </div>
        </div>

        {/* ================= MOBILE SEARCH ================= */}
        {mobileSearch && (
          <div className="md:hidden px-4 pb-4">
            <div className="relative">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent flex-1 outline-none text-sm"
                />
                <Search size={18} />
              </div>

              {filteredProducts.length > 0 && (
                <div className="absolute mt-2 w-full bg-white shadow-lg rounded-xl overflow-hidden z-50">
                  {filteredProducts.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-contain"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Rs. {item.salePrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* NAVBAR HEIGHT SPACER */}
      <div className="h-[80px]" />

      {/* ================= MOBILE MENU ================= */}
      {mobileMenu && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
          <div className="w-64 bg-white h-full p-6">
            <button onClick={() => setMobileMenu(false)}>
              <X size={26} />
            </button>

            <ul className="mt-8 flex flex-col gap-6 font-medium">
              <Link to="/" onClick={() => { scrollTop(); setMobileMenu(false); }}>
                HOME
              </Link>

              <Link to="/shop" onClick={() => { scrollTop(); setMobileMenu(false); }}>
                SHOP
              </Link>

              <Link to="/about" onClick={() => { scrollTop(); setMobileMenu(false); }}>
                ABOUT US
              </Link>

              <Link to="/support" onClick={() => { scrollTop(); setMobileMenu(false); }}>
                SUPPORT
              </Link>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar2;
