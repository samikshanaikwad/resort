import React from "react";
import { PLACEHOLDERS } from "../config/placeholders";

interface ActivitiesGridProps {
  onOpenEnquiry: (activityTitle?: string) => void;
}

export const ActivitiesGrid: React.FC<ActivitiesGridProps> = ({ onOpenEnquiry }) => {
  const activities = [
    {
      id: 1,
      image: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_1_IMG,
      title: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_1_TITLE,
      desc: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_1_DESC,
    },
    {
      id: 2,
      image: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_2_IMG,
      title: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_2_TITLE,
      desc: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_2_DESC,
    },
    {
      id: 3,
      image: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_3_IMG,
      title: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_3_TITLE,
      desc: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_3_DESC,
    },
    {
      id: 4,
      image: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_4_IMG,
      title: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_4_TITLE,
      desc: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_4_DESC,
    },
    {
      id: 5,
      image: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_5_IMG,
      title: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_5_TITLE,
      desc: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_5_DESC,
    },
    {
      id: 6,
      image: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_6_IMG,
      title: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_6_TITLE,
      desc: PLACEHOLDERS.PLACEHOLDER_ACTIVITY_6_DESC,
    },
  ];

  return (
    <section id="activities" className="pt-8 md:pt-12 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F2F4F2] font-['Montserrat',sans-serif]">
      <div className="max-w-7xl mx-auto">
        
        {/* Compact Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#11221A] tracking-tight">
            {PLACEHOLDERS.PLACEHOLDER_ACTIVITIES_HEADING || "Unforgettable Dandeli Adventures"}
          </h2>
          <p className="text-gray-600 text-sm md:text-base mt-2">
            {PLACEHOLDERS.PLACEHOLDER_ACTIVITIES_SUBHEADING || "Experience heart-pumping water sports, wildlife safaris, and nature trails in the heart of Karnataka."}
          </p>
        </div>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => (
            <div
              key={act.id}
              id={`activity-card-${act.id}`}
              className="group relative rounded-2xl overflow-hidden h-[340px] sm:h-[360px] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              onClick={() => onOpenEnquiry(act.title)}
            >
              {/* Zooming Background Image */}
              <img
                src={act.image}
                alt={`${act.title} - Dandeli Adventure Activity`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

              {/* Minimal Bottom Content Container (Name + 2-Line Content Only) */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white flex flex-col justify-end">
                <h3 className="text-lg sm:text-xl font-bold mb-1.5 group-hover:text-[#FF5722] transition-colors duration-200">
                  {act.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 leading-relaxed">
                  {act.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


