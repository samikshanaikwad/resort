import React from "react";
import { 
  Waves, 
  Compass, 
  Sunset, 
  Trees, 
  Sparkles, 
  Binoculars, 
  Flame, 
  Utensils, 
  Tent, 
  Coffee,
  Wifi
} from "lucide-react";
import { Resort } from "../../types/resort";

interface CategoryExplorationProps {
  resort: Resort;
}

// Icon helper function with compact sizing
function renderAmenityIcon(iconName?: unknown) {
  const iconClass = "w-5 h-5 text-[#FF5722]";
  const safeName = String(iconName || "").toLowerCase().trim();
  switch (safeName) {
    case "waves":
    case "water":
    case "river":
      return <Waves className={iconClass} />;
    case "compass":
    case "safari":
    case "activity":
      return <Compass className={iconClass} />;
    case "sunset":
    case "sun":
    case "deck":
      return <Sunset className={iconClass} />;
    case "trees":
    case "jungle":
    case "forest":
      return <Trees className={iconClass} />;
    case "binoculars":
      return <Binoculars className={iconClass} />;
    case "flame":
    case "campfire":
      return <Flame className={iconClass} />;
    case "utensils":
    case "food":
    case "dining":
      return <Utensils className={iconClass} />;
    case "tent":
    case "camping":
      return <Tent className={iconClass} />;
    case "coffee":
      return <Coffee className={iconClass} />;
    case "wifi":
      return <Wifi className={iconClass} />;
    default:
      return <Sparkles className={iconClass} />;
  }
}

export const CategoryExploration: React.FC<CategoryExplorationProps> = ({ resort }) => {
  const title = typeof resort?.title === "string" ? resort.title.trim() : (typeof resort?.name === "string" ? resort.name.trim() : String(resort?.title || resort?.name || "Resort Experience").trim());
  const exploreImg = String(resort?.explore_image_url || resort?.image_url || "").trim();

  // Fallback highlight amenities if not present in custom object
  const highlightAmenities = resort.highlight_amenities && resort.highlight_amenities.length > 0
    ? resort.highlight_amenities
    : [
        {
          title: "Riverfront View",
          description: "Wake up to uninterrupted panoramic vistas of the pristine Kali River and mist-covered forests.",
          icon: "waves"
        },
        {
          title: "Water Sports",
          description: "Complimentary river kayaking, boating, and natural jacuzzi baths steps from your room.",
          icon: "compass"
        },
        {
          title: "Sunset Deck",
          description: "Exclusive open-air timber deck ideal for evening teas, photography, and stargazing.",
          icon: "sunset"
        },
        {
          title: "Jungle Surroundings",
          description: "Enclosed by rich teak canopies with morning Great Indian Hornbill sightings.",
          icon: "trees"
        }
      ];

  return (
    <section 
      id="category-exploration-section"
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#F2F4F2] font-['Montserrat',sans-serif]"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Responsive Heading */}
        <div className="w-full mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#11221A] leading-tight break-words">
            Explore Our {title}
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Clean Image Only */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-[4/3] sm:aspect-[16/11]">
            <img 
              src={exploreImg} 
              alt={`Explore ${title} - River Views and Jungle Landscape`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right Column: Content & Compact Inclusions Grid */}
          <div className="space-y-6">
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Designed for travelers who want complete harmony with nature without sacrificing modern conveniences. Explore handcrafted amenities, guided wilderness excursions, and riverfront leisure curated specifically for this category.
            </p>

            {/* Compact 2x2 Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlightAmenities.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Inline Icon + Activity Name */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-orange-50 text-[#FF5722] shrink-0">
                      {renderAmenityIcon(item.icon)}
                    </div>
                    <h3 className="font-bold text-sm md:text-base text-gray-900 leading-tight">
                      {typeof item.title === "string" ? item.title.trim() : String(item.title || "")}
                    </h3>
                  </div>
                  
                  {/* Description Below */}
                  <p className="text-xs text-gray-600 leading-snug pl-[3px]">
                    {typeof item.description === "string" ? item.description.trim() : String(item.description || "")}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
