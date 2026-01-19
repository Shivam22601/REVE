import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productAPI } from "../config/api";
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Check,
} from "lucide-react";
import { useWishlist } from "./LandingPage/WishlistContext";
import { useCart } from "./LandingPage/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Cart & Wishlist
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } =
    useWishlist();

  // ✅ SAME AS SHOP.JSX
  const [addedToCart, setAddedToCart] = useState(false);

  // Scroll to top and fetch product
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    let mounted = true;
    setLoading(true);
    productAPI
      .getProduct(id)
      .then((res) => {
        if (!mounted) return;
        const p = res && res.product ? res.product : res;
        // Client-side fallback parsing: use p.features if present, otherwise try description or tags
        const parseDescToFeatures = (desc) => {
          if (!desc) return [];
          const byNewline = desc.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
          if (byNewline.length > 1) return byNewline;
          const byComma = desc.split(',').map(s => s.trim()).filter(Boolean);
          if (byComma.length > 1) return byComma;
          return desc.split(/[.?!]\s+/).map(s => s.trim()).filter(Boolean);
        };

        setProduct({
          id: p._id,
          name: p.name,
          salePrice: p.salePrice ?? p.price,
          image: p.images?.[0]?.url || "/placeholder.png",
          rating: p.averageRating,
          reviews: p.totalReviews,
          features: Array.isArray(p.features) && p.features.length ? p.features : (p.description ? parseDescToFeatures(p.description) : (p.tags || [])),
          description: p.description,
        });
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || String(err));
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
    );
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Product not found ❌
      </div>
    );
  }

  const isWishlisted = wishlist.some(
    (item) => item.id === product.id
  );

  // ✅ ADD TO CART (SHOP STYLE)
  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 1500);
  };

  // ✅ TOGGLE WISHLIST
  const toggleWishlist = () => {
    isWishlisted
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 max-w-6xl mx-auto">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10 md:gap-14">
        {/* IMAGE GALLERY */}
        <div className="bg-gray-100 p-6 sm:p-10 rounded-3xl">
          <div className="flex flex-col items-center">
            {/* Main Image */}
            <img
              src={product.images?.[selectedImage]?.url || product.image || "/placeholder.png"}
              alt={product.name}
              className="w-full max-h-[400px] object-contain mb-4"
            />
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                      selectedImage === index ? 'border-pink-600' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {product.name}
          </h1>

          {/* RATING */}
          <div className="flex items-center gap-2 mb-4">
            <Star className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">
              {product.rating ?? 0}
            </span>
            <span className="text-gray-500">
              ({product.reviews ?? 0} reviews)
            </span>
          </div>

          {/* PRICE */}
          <p className="text-2xl sm:text-3xl font-bold text-pink-600 mb-6">
            ₹{product.salePrice}
          </p>

          {/* FEATURES */}
          {product.features && (
            <>
              <h3 className="font-semibold text-lg sm:text-xl mb-3">
                Features
              </h3>
              <ul className="space-y-2 mb-8 text-gray-700">
                {product.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto w-full">
            {/* ADD TO CART (SHOP STYLE) */}
            <button
              onClick={handleAddToCart}
              className={`
                w-full sm:w-auto
                flex items-center justify-center gap-2
                px-6 sm:px-10 py-4
                rounded-xl font-semibold
                transition-all duration-200
                ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-[1.02] hover:shadow-lg active:scale-95"
                }
              `}
            >
              {addedToCart ? (
                <>
                  <Check size={20} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  Add to Cart
                </>
              )}
            </button>

            {/* WISHLIST */}
            <button
              onClick={toggleWishlist}
              className={`
                w-full sm:w-auto
                flex items-center justify-center gap-2
                px-6 sm:px-10 py-4
                rounded-xl font-semibold border
                transition-all
                ${
                  isWishlisted
                    ? "bg-pink-100 text-pink-600 border-pink-300"
                    : "border-pink-500 text-pink-600 hover:bg-pink-50"
                }
              `}
            >
              <Heart
                size={20}
                className={
                  isWishlisted ? "fill-pink-600" : ""
                }
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
