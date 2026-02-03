import { useWishlist } from "../LandingPage/WishlistContext";
import { HeartOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  // ✅ ALWAYS SCROLL TO TOP
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <HeartOff size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          Your Wishlist is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Save products you love to buy later ❤️
        </p>
        <button
          onClick={() => navigate("/cart")}
          className="px-8 py-3 bg-black text-white rounded-lg font-semibold"
        >
          Buy Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">My Wishlist ❤️</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md p-6"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-40 w-full object-contain mb-4"
            />

            <h3 className="text-lg font-semibold">{item.name}</h3>

            <p className="text-pink-600 font-bold mt-2">
              Rs. {item.salePrice}
            </p>

            <button
              onClick={() => removeFromWishlist(item.id)}
              className="mt-4 w-full py-2 border rounded-lg hover:bg-red-500 hover:text-white transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
