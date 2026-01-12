import React from 'react';
export default function GiftGuideSection() {
  const gifts = [
    {
      title: 'Birthday Bundle',
      price: '$299',
      originalPrice: '$349',
      items: 'Wireless Earbuds + Smart Watch + Premium Case',
      save: 'Save $50',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop'
    },
    {
      title: 'Work From Home Set',
      price: '$349',
      originalPrice: '$419',
      items: 'Earbuds + Laptop Stand + LED Ring Light',
      save: 'Save $70',
      image: 'https://images.unsplash.com/photo-1625019030820-e4ed970a6c95?w=400&h=300&fit=crop'
    },
    {
      title: 'Fitness Package',
      price: '$279',
      originalPrice: '$339',
      items: 'Sport Earbuds + Fitness Tracker + Sport Band',
      save: 'Save $60',
      image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent px-4">
            Perfect Gifts for Her
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Thoughtfully curated gift bundles that she'll absolutely love. Perfect for any celebration.
          </p>
        </div>
        
        {/* Gift Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gifts.map((gift, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-pink-200 hover:-translate-y-2 cursor-pointer"
            >
              {/* Save Badge */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                {gift.save}
              </div>
              
              {/* Image */}
              <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
                <img 
                  src={gift.image} 
                  alt={gift.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/40 transition-all duration-500"></div>
              </div>
              
              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                  {gift.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed min-h-[2.5rem] sm:min-h-[3rem]">
                  {gift.items}
                </p>
                
                {/* Price */}
                <div className="flex items-baseline gap-2 sm:gap-3 mb-5 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {gift.price}
                  </span>
                  <span className="text-base sm:text-lg text-gray-400 line-through">
                    {gift.originalPrice}
                  </span>
                </div>
                
                {/* Button */}
                <button className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white py-3 sm:py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95 text-sm sm:text-base">
                  Get This Bundle
                </button>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.3)]"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-10 sm:mt-12 px-4">
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            Free shipping on all bundles • 30-day returns • Gift wrapped
          </p>
          <button className="text-rose-500 font-semibold hover:text-rose-600 transition-colors text-sm sm:text-base inline-flex items-center gap-1">
            View All Gift Ideas 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
