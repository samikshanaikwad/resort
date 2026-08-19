import React from "react";
import { X, Check, BedDouble, Calendar, Sparkles, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { StayItem } from "./AccommodationSlider";
import { PLACEHOLDERS } from "../config/placeholders";

interface StayModalProps {
  stay: StayItem | null;
  onClose: () => void;
  onBook: (stayTitle: string) => void;
}

export const StayModal: React.FC<StayModalProps> = ({ stay, onClose, onBook }) => {
  if (!stay) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stay-modal-title"
    >
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl w-[95%] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-950/10 relative text-[#152C22]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Min 44x44px touch area) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#FF5722] text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer min-w-[44px] min-h-[44px]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-56 sm:h-72 w-full bg-emerald-950">
          <img
            src={stay.image}
            alt={stay.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="inline-block bg-[#FF5722] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full shadow mb-1">
                {stay.tag}
              </span>
              <h3 id="stay-modal-title" className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-serif-luxury leading-tight">
                {stay.title}
              </h3>
            </div>
            <span className="text-base sm:text-lg font-bold text-white bg-[#152C22]/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 self-start sm:self-auto">
              {stay.price}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-[#FF5722] uppercase tracking-wider mb-1">
              Sanctuary Overview
            </h4>
            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
              {stay.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="text-xs font-bold text-[#152C22] uppercase tracking-wider mb-3">
              Included In This Villa
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stay.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-[#EFF3EE] p-3 rounded-xl text-xs font-semibold text-[#152C22]">
                  <Check className="w-4 h-4 text-[#FF5722] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features highlight */}
          <div className="bg-emerald-900/5 p-4 rounded-2xl border border-emerald-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF5722] shrink-0" />
              <span>Full Board Meals & Afternoon High Tea Included</span>
            </div>
            <div className="font-semibold text-[#152C22]">Permit Assistance</div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => onBook(stay.title)}
              className="w-full sm:flex-1 bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-orange-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px] text-xs sm:text-sm uppercase tracking-wider"
            >
              <span>Reserve This Accommodation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer min-h-[48px]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
