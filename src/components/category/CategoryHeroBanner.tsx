import React from "react";
import { Sparkles } from "lucide-react";
import { Resort } from "../../types/resort";

interface CategoryHeroBannerProps {
  resort: Resort;
}

export const CategoryHeroBanner: React.FC<CategoryHeroBannerProps> = ({ resort }) => {
  const badgeText = resort.package_badge || `FROM 1 Night Package ${resort.price_per_night || "₹1,300/-"}`;

  return (
    <section 
      id="category-hero-banner"
      className="relative w-full h-[65vh] min-h-[480px] max-h-[680px] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with Dark Vignette Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('${resort.image_url}')` }}
      >
        {/* Multilayer gradient overlay for legibility (No green tint) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6">
        {/* Category Title Overlay in Montserrat Display Font */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-['Montserrat',sans-serif] uppercase font-bold text-white tracking-tight drop-shadow-lg max-w-4xl mx-auto leading-[1.15]">
          {resort.title}
        </h1>
      </div>
    </section>
  );
};
