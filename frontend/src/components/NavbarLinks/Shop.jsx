import { useState, memo, useEffect } from "react";
import { Star, ArrowLeft, Sparkles, Heart } from "lucide-react";
import { useCart } from "../LandingPage/CartContext";
import { useWishlist } from "../LandingPage/WishlistContext";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../../config/api";

/* ================= PRODUCT CARD ================= */
const ProductCard = memo(
  ({
    product,
    onAddToCart,
    onToggleWishlist,
    isAdded,
    isWishlisted,
    isHovered,
    onHover,
  }) => {
    return (
      <div
        className="group relative"
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

           

            {/* WISHLIST HEART (TOGGLE) */}
            <button
              onClick={onToggleWishlist}
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

            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{product.rating ?? 0}</span>
              <span className="text-gray-500 text-sm">
                ({product.reviews ?? 0})
              </span>
            </div>

            <p className="text-2xl font-bold mb-5 text-pink-600">
              ₹
              {product.salePrice !== undefined
                ? Number(product.salePrice).toLocaleString()
                : "—"}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3">
              
              {/* ADD TO CART */}
              <button
                onClick={onAddToCart}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  isAdded
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                }`}
              >
                {isAdded ? "Added to Cart" : "Add to Cart"}
              </button>

              {/* TOGGLE WISHLIST */}
              <button
                onClick={onToggleWishlist}
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
  const [addedToCart, setAddedToCart] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    productAPI
      .getProducts({ limit: 24 })
      .then((res) => {
        if (!mounted) return;
        setItems((res && res.data) || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || String(err));
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(
      () => setAddedToCart((prev) => ({ ...prev, [product.id]: false })),
      1500
    );
  };

  // ✅ TOGGLE WISHLIST
  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    exists
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  const isWishlisted = (id) =>
    wishlist.some((item) => item.id === id);

  const normalize = (p) => ({
    id: p._id,
    name: p.name,
    salePrice: p.salePrice ?? p.price,
    image: p.images?.[0]?.url || "/placeholder.png",
    rating: p.averageRating,
    reviews: p.totalReviews,
  });

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
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <span className="font-semibold text-pink-700">
            New Collection
          </span>
        </div>

        <h2 className="text-4xl font-bold mb-3">Shop Earbuds</h2>
        <p className="text-gray-600">
          Premium sound. Minimal design. Maximum comfort.
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        {loading && <div className="text-center text-gray-600">Loading...</div>}
        {!loading && error && <div className="text-center text-red-600">{error}</div>}
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((p) => {
          const product = normalize(p);
          return (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
              onToggleWishlist={() => toggleWishlist(product)}
              isAdded={!!addedToCart[product.id]}
              isWishlisted={isWishlisted(product.id)}
              isHovered={hoveredProduct === product.id}
              onHover={setHoveredProduct}
            />
          );
        })}
      </div>
    </div>
  );
}
