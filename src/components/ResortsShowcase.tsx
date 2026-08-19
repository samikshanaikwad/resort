import React, { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { PLACEHOLDERS } from "../config/placeholders";
import { Resort, getCategorySlug, getDisplayImage } from "../types/resort";
import { fetchResorts, subscribeToResortsRealtime, resolveImageUrl } from "../lib/supabaseClient";

export interface StayItem {
  id: number | string;
  image: string;
  title: string;
  tag: string;
  price: string;
  description: string;
  amenities: string[];
}

interface ResortsShowcaseProps {
  onSelectCategory?: (slug: string) => void;
  onOpenEnquiry: () => void;
}

export const ResortsShowcase: React.FC<ResortsShowcaseProps> = ({ 
  onSelectCategory, 
  onOpenEnquiry 
}) => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      const data = await fetchResorts();
      const activeResorts = data.filter((r) => r.is_active);
      setResorts(activeResorts.length > 0 ? activeResorts : data);
    } catch (e) {
      console.error("Error loading resorts", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // 1. Listen for local window events
    const handleLocalUpdate = () => {
      loadData();
    };
    window.addEventListener("dandeli_resorts_updated", handleLocalUpdate);

    // 2. Subscribe to live Supabase Realtime postgres_changes
    const unsubscribe = subscribeToResortsRealtime(() => {
      loadData();
    });

    return () => {
      window.removeEventListener("dandeli_resorts_updated", handleLocalUpdate);
      unsubscribe();
    };
  }, []);

  const handleChatWithExpert = () => {
    const text = encodeURIComponent("Hello! I am looking for the best resort and adventure package in Dandeli. Please guide me.");
    window.open(`https://wa.me/${PLACEHOLDERS.PLACEHOLDER_WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else {
      window.location.hash = `#category/${slug}`;
    }
  };

  return (
    <section id="stays" className="bg-[#EFF3EE] text-[#1F2925] py-12 sm:py-20 border-t border-[#152C22]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Heading, Subtitle, and Vibrant Orange CTA Button */}
          <div className="lg:col-span-4 flex flex-col items-start justify-center space-y-5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-['Montserrat',sans-serif] uppercase font-bold text-[#1F2925] tracking-tight leading-tight">
              {PLACEHOLDERS.PLACEHOLDER_SLIDER_HEADING || "Find Your Perfect Wilderness Escape"}
            </h2>

            <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-md font-sans">
              {PLACEHOLDERS.PLACEHOLDER_SLIDER_SUBTEXT || "Your ideal Dandeli getaway begins with the right setting. Choose from our handpicked categories to match your style of adventure and relaxation."}
            </p>

            {/* Chat With Trip Expert CTA Button (Vibrant Orange matching Navbar) */}
            <div className="pt-1">
              <button
                id="slider-chat-expert-btn"
                onClick={handleChatWithExpert}
                className="inline-flex items-center gap-2.5 bg-[#FF5722] hover:bg-[#E04818] text-white text-xs sm:text-sm md:text-base font-bold px-6 sm:px-7 py-3.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group min-h-[44px]"
              >
                <MessageCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span>{PLACEHOLDERS.PLACEHOLDER_SLIDER_CTA_BTN || "Chat With Trip Expert"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Full-Height Image Cards Carousel with Text Overlay & VIEW Pill */}
          <div className="lg:col-span-8 overflow-hidden w-full">
            {isLoading ? (
              <div className="flex gap-4 sm:gap-6 overflow-hidden py-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="min-w-[260px] sm:min-w-[320px] md:min-w-[350px] h-[400px] sm:h-[480px] rounded-2xl bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div>
                <div
                  ref={sliderRef}
                  className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
                  style={{ scrollbarWidth: "none" }}
                >
                  {resorts.map((resort, idx) => {
                    const categorySlug = getCategorySlug(resort);
                    const title = typeof resort?.title === "string" ? resort.title.trim() : (typeof resort?.name === "string" ? resort.name.trim() : String(resort?.title || resort?.name || "Resort").trim());
                    const rawCover = getDisplayImage(resort) || resort?.image_url || resort?.cover_image || "";
                    const cardImage = resolveImageUrl(rawCover);

                    return (
                      <div
                        key={resort.id || idx}
                        id={`resort-card-${resort.id || categorySlug}`}
                        onClick={() => handleCategoryClick(categorySlug)}
                        className="min-w-[260px] sm:min-w-[320px] md:min-w-[350px] h-[400px] sm:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden relative group shadow-xl snap-start shrink-0 cursor-pointer select-none"
                      >
                        {/* Full-Height Image Background */}
                        <img
                          src={cardImage}
                          alt={`${title} - Dandeli Riverfront Resort & Jungle Stay`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                          referrerPolicy="no-referrer"
                        />

                        {/* Smooth Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />

                        {/* Lower Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 flex flex-col items-center text-center space-y-4">
                          {/* Resort / Category Title */}
                          <h3 className="text-lg sm:text-2xl font-bold text-white font-['Montserrat',sans-serif] tracking-tight leading-snug drop-shadow-md">
                            {title}
                          </h3>

                          {/* VIEW CTA: Clean semi-transparent pill */}
                          <button
                            id={`view-btn-${resort.id || categorySlug}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryClick(categorySlug);
                            }}
                            className="border border-white/60 bg-black/20 text-white hover:bg-white hover:text-[#1F2925] text-xs font-bold uppercase tracking-widest px-7 py-3 rounded-full backdrop-blur-sm transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer min-h-[44px] flex items-center justify-center"
                          >
                            VIEW
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
