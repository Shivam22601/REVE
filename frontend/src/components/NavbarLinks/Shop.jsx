import { useState, memo, useEffect } from "react";
import { Star, ArrowLeft, Sparkles, Heart, Zap } from "lucide-react";
import { useCart } from "../LandingPage/CartContext";
import { useWishlist } from "../LandingPage/WishlistContext";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../../config/api";

/* ================= PRODUCT CARD ================= */
const ProductCard = memo(
  ({
    product,
    onClick,
    onBuyNow,
    onToggleWishlist,
    isWishlisted,
    isHovered,
    onHover,
  }) => {
    return (
      <div
        className="group relative cursor-pointer"
        onClick={onClick}
        onMouseEnter={() => onHover(product.id)}
        onMouseLeave={() => onHover(null)}
      >
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition overflow-hidden">
          {/* IMAGE */}
          <div className="relative aspect-square p-6 bg-gradient-to-br from-pink-50/30 via-purple-50/30 to-blue-50/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain transition-transform group-hover:scale-110"
            />

            {/* WISHLIST ICON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist();
              }}
              className={`absolute top-3 left-3 bg-white p-2.5 rounded-full shadow transition ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted
                    ? "fill-pink-600 text-pink-600"
                    : "text-pink-600"
                }`}
              />
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>

            {/* RATING */}
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-gray-500 text-sm">
                ({product.reviews})
              </span>
            </div>

            {/* PRICE */}
            <p className="text-2xl font-bold mb-5 text-pink-600">
              ₹{(product.salePrice || 0).toFixed(2)}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3">
              {/* BUY NOW BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyNow();
                }}
                className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-95"
              >
                <Zap size={20} />
                Buy Now
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist();
                }}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border transition
                  ${
                    isWishlisted
                      ? "bg-pink-100 text-pink-600 border-pink-300"
                      : "border-pink-500 text-pink-600 hover:bg-pink-50"
                  }`}
              >
                <Heart
                  size={18}
                  className={isWishlisted ? "fill-pink-600" : ""}
                />
                {isWishlisted
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

/* ================= SHOP PAGE ================= */
export default function Shop() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } =
    useWishlist();
  const navigate = useNavigate();

  /* ================= HELPERS ================= */
  const normalizeProduct = (p) => {
    const rawPrice = p.salePrice ?? p.price ?? p.mrp ?? 0;

    return {
      id: p._id,
      name: p.name,
      salePrice: Number(rawPrice) || 0,
      image: p.images?.[0]?.url || "/placeholder.png",
      rating: Number(p.averageRating) || 0,
      reviews: Number(p.totalReviews) || 0,

      // 🔥 normalized category for filter buttons
      category:
        typeof p.category === "string"
          ? p.category
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace("-", "")
          : p.category?.slug?.toLowerCase() ||
            p.category?.name
              ?.toLowerCase()
              .replace(/\s+/g, "")
              .replace("-", "") ||
            "other",
    };
  };

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setLoading(true);
    productAPI
      .getProducts({ limit: 50, sort: 'sortOrder -createdAt _id' })
      .then((res) => {
        const products =
          res?.data?.products || res?.data || [];
        setItems(products);
      })
      .catch((err) => setError(err.message || String(err)))
      .finally(() => setLoading(false));
  }, []);

  /* ================= FILTER ================= */
  const filteredItems =
    activeCategory === "all"
      ? items.map(normalizeProduct)
      : items
          .map(normalizeProduct)
          .filter((p) => p.category === activeCategory);

  /* ================= ACTIONS ================= */
  const handleBuyNow = (product) => {
    addToCart(product);
    navigate('/cart');
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some(
      (item) => item.id === product.id
    );
    exists
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  const isWishlisted = (id) =>
    wishlist.some((item) => item.id === id);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-pink-600"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Shop
          </h1>
        </div>
      </div>

      {/* HERO */}
      <div className="text-center py-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <span className="font-semibold text-pink-700">
            New Collection
          </span>
        </div>

        <h2 className="text-4xl font-bold mb-3">
          Shop Products
        </h2>

        {/* CATEGORIES */}
        <div className="flex justify-center flex-wrap gap-3 mt-6">
          {[
            { key: "all", label: "All" },
            { key: "earbuds", label: "🎧 Earbuds" },
            { key: "tshirts", label: "👕 T-Shirts" },
            { key: "bags", label: "🎒 Mini Bags & Cases" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2 rounded-full font-semibold border transition ${
                activeCategory === cat.key
                  ? "bg-pink-600 text-white border-pink-600"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && (
          <p className="text-center col-span-full">
            Loading...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600 col-span-full">
            {error}
          </p>
        )}

        {!loading && filteredItems.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No products found in this category.
          </p>
        )}

        {!loading &&
          filteredItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() =>
                navigate(`/product/${product.id}`)
              }
              onBuyNow={() =>
                handleBuyNow(product)
              }
              onToggleWishlist={() =>
                toggleWishlist(product)
              }
              isWishlisted={isWishlisted(product.id)}
              isHovered={hoveredProduct === product.id}
              onHover={setHoveredProduct}
            />
          ))}
      </div>
    </div>
  );
}
