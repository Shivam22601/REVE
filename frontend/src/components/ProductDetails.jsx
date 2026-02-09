import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productAPI } from "../config/api";
import {
  ArrowLeft,
  Star,
  Heart,
  Zap,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useWishlist } from "./LandingPage/WishlistContext";
import { useCart } from "./LandingPage/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);

    productAPI
      .getProduct(id)
      .then((res) => {
        const p = res.product;
        setProduct({
          id: p._id,
          name: p.name,
          salePrice: p.salePrice ?? p.price,
          images: p.images || [],
          rating: p.averageRating ?? 0,
          reviews: p.totalReviews ?? 0,
          features: p.features || [],
          flipkartLink: p.flipkartLink || null,
        });
        setReviews(res.reviews || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (error)
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product)
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const toggleWishlist = () => {
    isWishlisted
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      await productAPI.addReview(id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Thank you for your review 💕");

      const res = await productAPI.getProduct(id);
      setReviews(res.reviews || []);
      setShowReviewForm(false);
      setReviewComment("");
      setReviewRating(5);
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9fb] py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* ================= MAIN SECTION ================= */}
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* 🌸 IMAGE SECTION */}
          <div className="flex items-start">
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50" />
              <div className="relative p-5">
                <img
                  src={product.images[selectedImage]?.url || "/placeholder.png"}
                  alt={product.name}
                  className="w-full max-h-[420px] object-contain mx-auto"
                />

                {product.images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`w-16 h-16 rounded-lg overflow-hidden ${
                          selectedImage === i
                            ? "ring-2 ring-pink-400"
                            : "opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= DETAILS ================= */}
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-semibold mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <Star className="fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-gray-500">
                ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-3xl font-bold text-pink-600 mb-6">
              ₹{product.salePrice}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6 text-sm text-gray-700">
              {["Authentic Product", "Safe Delivery", "Easy Returns", "Women-Friendly Design"].map(
                (t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-pink-500" />
                    {t}
                  </div>
                )
              )}
            </div>

            {/* FEATURES */}
            {product.features.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-3">
                  Why you’ll love it
                </h3>
                <ul className="space-y-2 text-gray-700 mb-8">
                  {product.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4 mt-auto">

              {/* BUY NOW */}
              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:shadow-lg"
              >
                <Zap size={18} /> Buy Now
              </button>

              {/* BUY FROM FLIPKART */}
              {product.flipkartLink && (
                <a
                  href={product.flipkartLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-full flex items-center justify-center gap-2
                    px-6 py-4 rounded-xl
                    border border-blue-500 text-blue-600
                    font-semibold
                    hover:bg-blue-50 transition
                  "
                >
                  <ExternalLink size={18} />
                  Buy from Flipkart
                </a>
              )}

              {/* WISHLIST */}
              <button
                onClick={toggleWishlist}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border font-semibold ${
                  isWishlisted
                    ? "bg-pink-100 text-pink-600 border-pink-300"
                    : "border-pink-500 text-pink-600 hover:bg-pink-50"
                }`}
              >
                <Heart size={18} className={isWishlisted ? "fill-pink-600" : ""} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>

            </div>
          </div>
        </div>

        {/* ================= REVIEWS ================= */}
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">
            Customer Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 && (
            <p className="text-gray-500 text-center">
              No reviews yet. Be the first 💕
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
