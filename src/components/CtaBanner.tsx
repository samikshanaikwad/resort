import React from "react";
import { ArrowRight } from "lucide-react";
import { PLACEHOLDERS } from "../config/placeholders";

interface CtaBannerProps {
  onOpenEnquiry: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenEnquiry }) => {
  return (
    <section 
      id="cta-wildlife-banner"
      className="relative overflow-hidden py-12 md:py-16 px-4 sm:px-6 lg:px-8 text-center font-['Montserrat',sans-serif]"
    >
      {/* Background Image with Lightened Overlay so Tiger is Visible */}
      <div className="absolute inset-0 z-0">
        <img
          src={PLACEHOLDERS.PLACEHOLDER_CTA_BANNER_IMG}
          alt="Dandeli Wildlife Tiger"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Lightened Overlay for Clear Background Visibility */}
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/70 via-black/30 to-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-5 sm:space-y-6">
        
        {/* Main Headline (Positioned Higher) */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight">
          Ready To Experience Dandeli's Wild Rivers & Jungles?
        </h2>

        {/* Updated Fresh Subtitle Copy */}
        <p className="text-gray-100 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed drop-shadow-sm">
          Plan your dream escape to Dandeli's lush rainforests. From premium resort stays to thrilling jungle safaris and water sports, we customize complete hassle-free vacation packages for you.
        </p>

        {/* Call-to-Action Button */}
        <div className="pt-2">
          <a
            id="banner-whatsapp-cta-btn"
            href="https://wa.me/918123715275"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer min-h-[44px] text-sm sm:text-base"
          >
            <span>Book Your Stay on WhatsApp</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

      </div>
    </section>
  );
};

