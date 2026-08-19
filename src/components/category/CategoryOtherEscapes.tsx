import React from "react";
import { Resort } from "../../types/resort";

interface CategoryOtherEscapesProps {
  allResorts: Resort[];
  currentSlug: string;
  onNavigateToSlug: (slug: string) => void;
}

export const CategoryOtherEscapes: React.FC<CategoryOtherEscapesProps> = ({
  allResorts,
  currentSlug,
  onNavigateToSlug,
}) => {
  const otherResorts = allResorts.filter(
    (r) => r.is_active && r.slug !== currentSlug
  );

  if (otherResorts.length === 0) return null;

  return (
    <section 
      id="category-other-escapes-section"
      className="relative pt-12 bg-[#F2F4F2] font-['Montserrat',sans-serif] text-gray-900"
    >
      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#11221A] tracking-tight">
          Handpicked Dandeli Escapes
        </h2>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          Discover other verified river retreats, elevated treehouses, and jungle safari lodges.
        </p>
      </div>

      {/* Clean Minimalist Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-16">
        {otherResorts.slice(0, 3).map((card) => {
          const cardSlug =
            card.slug ||
            card.category_slug ||
            card.id ||
            card.title?.toLowerCase().replace(/\s+/g, "-") ||
            card.name?.toLowerCase().replace(/\s+/g, "-") ||
            "resort";

          return (
            <div
              key={card.id || cardSlug}
              onClick={() => onNavigateToSlug(cardSlug)}
              className="relative rounded-2xl overflow-hidden h-80 sm:h-96 group shadow-md cursor-pointer"
            >
              {/* Background Image */}
              <img
                src={card.image_url}
                alt={`${card.title || card.name || "Resort"} - Dandeli Riverfront & Safari Stay`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Card Bottom Content (Name + View Button Only) */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex justify-between items-center text-white gap-2">
                <h3 className="text-lg sm:text-xl font-bold leading-tight line-clamp-2">
                  {card.title || card.name || "Resort"}
                </h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToSlug(cardSlug);
                  }}
                  className="bg-white/20 hover:bg-[#FF5722] backdrop-blur-md text-white px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-colors duration-300 flex items-center gap-2 border border-white/30 hover:border-[#FF5722] cursor-pointer min-h-[44px] shrink-0"
                >
                  <span>VIEW</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

