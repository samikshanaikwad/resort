import React from "react";
import { Building2, Waves, Home, Tent, ArrowRight } from "lucide-react";
import { PLACEHOLDERS } from "../config/placeholders";

interface WelcomeSectionProps {
  onOpenEnquiry: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onOpenEnquiry }) => {
  const featureCards = [
    {
      id: "feature-resorts",
      icon: Building2,
      title: PLACEHOLDERS.PLACEHOLDER_FEATURE_1_TITLE,
      subtitle: PLACEHOLDERS.PLACEHOLDER_FEATURE_1_SUB,
    },
    {
      id: "feature-cabins",
      icon: Waves,
      title: PLACEHOLDERS.PLACEHOLDER_FEATURE_2_TITLE,
      subtitle: PLACEHOLDERS.PLACEHOLDER_FEATURE_2_SUB,
    },
    {
      id: "feature-homestays",
      icon: Home,
      title: PLACEHOLDERS.PLACEHOLDER_FEATURE_3_TITLE,
      subtitle: PLACEHOLDERS.PLACEHOLDER_FEATURE_3_SUB,
    },
    {
      id: "feature-tents",
      icon: Tent,
      title: PLACEHOLDERS.PLACEHOLDER_FEATURE_4_TITLE,
      subtitle: PLACEHOLDERS.PLACEHOLDER_FEATURE_4_SUB,
    },
  ];

  const handleWhatsAppBooking = () => {
    const text = encodeURIComponent("Hello! I would like to book a resort or adventure package with Dandeli Stay Booking.");
    window.open(`https://wa.me/${PLACEHOLDERS.PLACEHOLDER_WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <div className="relative bg-[#EFF3EE] text-[#152C22] pt-10 sm:pt-14 overflow-hidden">
      <section id="welcome" className="max-w-7xl mx-auto px-6 sm:px-10 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Side: 2 Vertical Side-by-Side Images with Vertical Offset + Compact WhatsApp CTA */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start justify-start self-start relative mt-0 z-20 w-full">
            <div className="grid grid-cols-2 gap-4 sm:gap-5 w-full max-w-md items-start">
              
              {/* Image Card 1 (Left - Higher Position) */}
              <div 
                id="intro-img-card-1"
                className="bg-white p-1 sm:p-1.5 rounded-xl shadow-xl border border-white/80 overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-full aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-emerald-950">
                  <img
                    src="https://res.cloudinary.com/ykltx8zw/image/upload/v1786266532/eaff4ecc-6fbc-4120-9b89-f0814c4ce924_vht0ve.jpg"
                    alt="Dandeli Forest Wildlife and Scenery"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Image Card 2 (Right - Vertical Offset downwards) */}
              <div 
                id="intro-img-card-2"
                className="bg-white p-1 sm:p-1 rounded-xl shadow-xl border border-white/80 overflow-hidden group hover:shadow-2xl transition-all duration-300 mt-8 sm:mt-10 lg:mt-12"
              >
                <div className="w-full aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-emerald-950">
                  <img
                    src="https://res.cloudinary.com/ykltx8zw/image/upload/v1786201765/WhatsApp_Image_2026-07-04_at_10.15.47_PM_ot1g9q.jpg"
                    alt="Dandeli Riverside Resort and Cottages"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp CTA Button: Compact, Rounded, Solid Orange with WhatsApp SVG & Arrow */}
            <div className="mt-8 sm:mt-10 flex justify-center lg:justify-center w-full">
              <button
                id="intro-whatsapp-cta-btn"
                onClick={handleWhatsAppBooking}
                className="w-fit inline-flex items-center gap-2.5 bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
              >
                {/* WhatsApp Chat Speech Bubble Icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 shrink-0 text-white"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Book on WhatsApp</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Side: Typography & 2x2 Feature Grid */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            <div className="space-y-3">
              {/* Title: Bold Dark Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#152C22] font-['Montserrat',sans-serif] tracking-tight leading-tight">
                {PLACEHOLDERS.PLACEHOLDER_SECTION2_TITLE}
              </h2>
              {/* Subtitle: Same dark charcoal color as heading */}
              <h3 className="text-base sm:text-lg font-semibold text-[#152C22] leading-snug">
                {PLACEHOLDERS.PLACEHOLDER_SECTION2_SUBTITLE}
              </h3>
              {/* Body text: Dark gray readable paragraph */}
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base pt-1">
                {PLACEHOLDERS.PLACEHOLDER_SECTION2_BODY}
              </p>
            </div>

            {/* 2x2 Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {featureCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.id}
                    id={card.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-emerald-900/5 hover:border-[#FF5500]/30 transition-all duration-200 group flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#EFF3EE] group-hover:bg-[#FF5500] text-[#FF5500] group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-inner">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#152C22] text-sm sm:text-base group-hover:text-[#FF5500] transition-colors leading-tight">
                        {card.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 leading-snug">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Smooth Organic SVG Wave Divider to Section 3 */}
      <div className="relative w-full overflow-hidden leading-none -mb-1 pointer-events-none">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-16 lg:h-20 text-white preserve-3d"
        >
          <path
            d="M0,30 C360,75 720,0 1080,45 C1260,65 1380,25 1440,35 L1440,90 L0,90 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};
