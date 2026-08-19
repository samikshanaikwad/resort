import React from "react";
import { PLACEHOLDERS } from "../config/placeholders";

interface SpotsGridProps {
  onOpenEnquiry: (spotTitle?: string) => void;
}

export const SpotsGrid: React.FC<SpotsGridProps> = ({ onOpenEnquiry }) => {
  const spots = [
    {
      id: 1,
      image: PLACEHOLDERS.PLACEHOLDER_SPOT_1_IMG,
      title: PLACEHOLDERS.PLACEHOLDER_SPOT_1_TITLE,
      desc: PLACEHOLDERS.PLACEHOLDER_SPOT_1_DESC,
    },
    {
      id: 2,
      image: PLACEHOLDERS.PLACEHOLDER_SPOT_2_IMG,
      title: PLACEHOLDERS.PLACEHOLDER_SPOT_2_TITLE,
      desc: PLACEHOLDERS.PLACEHOLDER_SPOT_2_DESC,
    },
    {
      id: 3,
      image: PLACEHOLDERS.PLACEHOLDER_SPOT_3_IMG,
      title: PLACEHOLDERS.PLACEHOLDER_SPOT_3_TITLE,
      desc: PLACEHOLDERS.PLACEHOLDER_SPOT_3_DESC,
    },
    {
      id: 4,
      image: PLACEHOLDERS.PLACEHOLDER_SPOT_4_IMG,
      title: PLACEHOLDERS.PLACEHOLDER_SPOT_4_TITLE,
      desc: PLACEHOLDERS.PLACEHOLDER_SPOT_4_DESC,
    },
    {
      id: 5,
      image: PLACEHOLDERS.PLACEHOLDER_SPOT_5_IMG,
      title: PLACEHOLDERS.PLACEHOLDER_SPOT_5_TITLE,
      desc: PLACEHOLDERS.PLACEHOLDER_SPOT_5_DESC,
    },
    {
      id: 6,
      image: PLACEHOLDERS.PLACEHOLDER_SPOT_6_IMG,
      title: PLACEHOLDERS.PLACEHOLDER_SPOT_6_TITLE,
      desc: PLACEHOLDERS.PLACEHOLDER_SPOT_6_DESC,
    },
  ];

  return (
    <section id="spots" className="pt-8 md:pt-12 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F2F4F2] font-['Montserrat',sans-serif]">
      <div className="max-w-7xl mx-auto">
        
        {/* Compact Section Header without Badge */}
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#11221A] tracking-tight">
            {PLACEHOLDERS.PLACEHOLDER_SPOTS_HEADING || "Must-Explore Spots In & Around Dandeli"}
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            {PLACEHOLDERS.PLACEHOLDER_SPOTS_SUBHEADING || "Scenic viewpoints, mystical rock caves, and river sanctuaries for your bucket list."}
          </p>
        </div>

        {/* Clean Attractions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.map((place) => (
            <div
              key={place.id}
              id={`must-explore-spot-${place.id}`}
              onClick={() => onOpenEnquiry(place.title)}
              className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              {/* Clean Image Container (No Badges) */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={place.image}
                  alt={`${place.title} - Dandeli Sightseeing Attraction`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Card Body: Title + Full Unclipped Description */}
              <div className="p-6 flex-1 flex flex-col justify-start">
                <h3 className="text-xl font-bold text-[#11221A] mb-2">
                  {place.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {place.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


