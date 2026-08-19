import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { PLACEHOLDERS } from "../config/placeholders";

interface HeroCarouselProps {
  onOpenEnquiry: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onOpenEnquiry }) => {
  const slides = [
    {
      id: 1,
      image: "https://res.cloudinary.com/ykltx8zw/image/upload/v1786201763/A-Complete-Guide-to-White-Water-Rafting-In-Dandeli_ech9ip.webp",
      title: "THRILLING RIVER ADVENTURES",
      subtitle: "Experience white water rafting on the Kali River with certified guides and safety gear.",
      ctaText: "BOOK ON WHATSAPP",
    },
    {
      id: 2,
      image: "https://res.cloudinary.com/ykltx8zw/image/upload/v1786263992/da_vx9nbm.jpg",
      title: "ESCAPE INTO THE WILDS OF DANDELI",
      subtitle: "Spot wild deer, exotic birds, and rare wildlife in their natural forest habitat.",
      ctaText: "BOOK ON WHATSAPP",
    },
    {
      id: 3,
      image: "https://res.cloudinary.com/ykltx8zw/image/upload/v1786201765/river-edge-dandeli-river-resort-27-2000x1334_xhvltt.jpg",
      title: "WAKE UP TO NATURE",
      subtitle: "Handpicked riverside cottages, tents, and chalets with all-inclusive meals.",
      ctaText: "BOOK ON WHATSAPP",
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = slides.length;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide, slideCount]);

  return (
    <section 
      id="home"
      className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col justify-between bg-black overflow-hidden select-none"
    >
      {/* Slides Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{ transitionProperty: "opacity, transform", transitionDuration: "1200ms" }}
        >
          <img
            src={slide.image}
            alt={`Dandeli Resort & Safari - ${slide.title}`}
            width={1600}
            height={900}
            loading={index === 0 ? "eager" : "lazy"}
            decoding={index === 0 ? "sync" : "async"}
            className="w-full h-full object-cover object-center brightness-[0.95]"
            referrerPolicy="no-referrer"
          />
          {/* Neutral Dark Charcoal/Black Gradient Overlay (No Green Tint) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
      ))}

      {/* Main Centered Content */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 sm:px-10 flex-1 flex flex-col justify-center items-center text-center pt-32 sm:pt-36 pb-16 sm:pb-24">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 flex flex-col items-center">
          
          {/* 1. Heading: Massive, bold, all-caps white text centered horizontally */}
          <h1 
            key={`title-${currentSlide}`}
            className="font-['Montserrat',sans-serif] uppercase font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white leading-[1.08] drop-shadow-2xl animate-fadeIn"
          >
            {slides[currentSlide].title}
          </h1>

          {/* 2. Subheading: Medium-weight white/off-white text centered directly under the main heading */}
          <p 
            key={`sub-${currentSlide}`}
            className="text-base sm:text-lg md:text-xl text-white/95 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg animate-fadeIn"
          >
            {slides[currentSlide].subtitle}
          </p>

          {/* 3. Single Solid Bright Orange CTA Button Centered */}
          <div className="pt-2 sm:pt-4">
            <button
              id={`hero-cta-btn-${currentSlide}`}
              onClick={onOpenEnquiry}
              className="bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold text-sm sm:text-base tracking-wider uppercase px-8 sm:px-10 py-4 sm:py-4.5 rounded-full shadow-2xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 group"
            >
              <span>{slides[currentSlide].ctaText}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>

      {/* 4. Organic Smooth SVG Wave Divider: Filled with soft light sage green (#EFF3EE) */}
      <div className="relative z-20 w-full overflow-hidden leading-none -mb-1 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-14 sm:h-20 lg:h-28 text-[#EFF3EE] preserve-3d"
        >
          <path
            d="M0,45 C320,115 540,25 800,75 C1080,125 1280,35 1440,55 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};
