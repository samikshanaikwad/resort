import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { PLACEHOLDERS } from "../config/placeholders";

interface FloatingWhatsAppProps {
  onOpenEnquiry?: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onOpenEnquiry }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleWhatsAppClick = () => {
    const defaultMsg = encodeURIComponent("Hello! I would like to enquire about luxury jungle safaris and resort accommodations.");
    const url = `https://wa.me/${PLACEHOLDERS.PLACEHOLDER_WHATSAPP_NUMBER}?text=${defaultMsg}`;
    window.open(url, "_blank");
  };

  return (
    <aside 
      id="floating-whatsapp-container"
      aria-label="Contact via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 select-none"
    >
      {/* Greeting Tooltip: Dark brown (#2F211A) floating pill reading [PLACEHOLDER_FLOATING_CHAT_TEXT] with a small white x close button */}
      {showTooltip && (
        <div
          id="whatsapp-greeting-tooltip"
          className="bg-[#2F211A] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full shadow-2xl border border-white/15 flex items-center gap-3 backdrop-blur-md animate-fadeIn max-w-[280px] sm:max-w-xs cursor-pointer hover:border-[#FF5500]/50 transition-colors"
          onClick={handleWhatsAppClick}
        >
          <span className="truncate">{PLACEHOLDERS.PLACEHOLDER_FLOATING_CHAT_TEXT}</span>
          <button
            id="close-whatsapp-tooltip-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white shrink-0 transition-colors cursor-pointer"
            aria-label="Close tooltip"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      )}

      {/* WhatsApp Button: Circular green (#25D366) chat icon fixed at the bottom-right corner */}
      <button
        id="whatsapp-floating-btn"
        onClick={handleWhatsAppClick}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20b859] text-white flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-8 h-8 fill-current group-hover:scale-105 transition-transform" />
      </button>
    </aside>
  );
};
