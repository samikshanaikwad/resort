import React, { useState, useEffect } from "react";
import { X, Send, Calendar, Users, Phone, MessageSquare } from "lucide-react";
import { PLACEHOLDERS } from "../config/placeholders";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ 
  isOpen, 
  onClose, 
  initialSubject = "" 
}) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [adultsCount, setAdultsCount] = useState("2 Adults");
  const [childrenCount, setChildrenCount] = useState("0 Children");

  // Reset form or set defaults on open
  useEffect(() => {
    if (isOpen) {
      // Set min date to today
      const today = new Date().toISOString().split("T")[0];
      if (!checkInDate) {
        setCheckInDate(today);
      }
    }
  }, [isOpen]);

  // Keyboard accessibility: Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean phone number
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");

    // Construct pre-written WhatsApp message
    const message = `Hello Dandeli Stay Booking! I would like to submit a booking enquiry with the following details:

*Name:* ${fullName || "Traveler"}
*WhatsApp:* +91 ${cleanPhone || phoneNumber}
*Travel Date:* ${checkInDate || "Flexible"}
*Guests:* ${adultsCount}, ${childrenCount}

Please confirm availability and share best package details.`;

    const targetNumber = "918123715275";
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new window/tab
    window.open(whatsappUrl, "_blank");

    // Close modal after initiating contact
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl w-[95%] max-w-lg mx-auto shadow-2xl border border-emerald-950/10 overflow-hidden relative text-[#152C22] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Accessible Close Button (Min 44x44px touch area) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-11 h-11 rounded-full bg-black/30 hover:bg-[#FF5722] text-white/90 hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5722] flex items-center justify-center min-w-[44px] min-h-[44px]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header Bar */}
        <div className="bg-[#1F1511] p-5 sm:p-6 text-white text-center relative overflow-hidden">
          <div className="mx-auto mb-2 flex justify-center">
            <svg width={42} height={42} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[46px] sm:h-[46px]">
              <circle cx="50" cy="50" r="42" fill="#EAEFEA" />
              <circle cx="50" cy="50" r="32" fill="#C85A17" opacity="0.15" />
              <path d="M10 75 C 30 70, 70 75, 90 70 C 80 80, 20 80, 10 75 Z" fill="#3D2314" />
              <path d="M 28 73 C 32 62, 38 52, 42 46 C 45 42, 48 40, 52 42 C 55 43, 58 48, 60 52 C 63 58, 66 65, 72 71 C 74 73, 76 74, 78 72 C 80 70, 77 65, 75 60 C 72 52, 68 45, 62 38 C 56 32, 48 30, 42 33 C 38 35, 34 32, 31 28 C 28 24, 25 21, 22 25 C 19 29, 21 34, 24 38 C 26 42, 28 46, 27 51 C 26 56, 22 62, 18 68 C 16 71, 14 74, 18 75 C 22 76, 25 75, 28 73 Z" fill="#3D2314" />
              <circle cx="28" cy="30" r="1.5" fill="#FF5A00" />
              <path d="M 72 71 C 78 76, 85 78, 88 74 C 91 70, 86 64, 82 66" stroke="#3D2314" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <h3 id="enquiry-modal-title" className="text-lg sm:text-xl font-bold font-['Montserrat',sans-serif]">
            Dandeli Stay Booking Concierge
          </h3>
          <p className="text-xs text-white/75 mt-1 max-w-xs mx-auto">
            Reserve verified resort packages, riverfront chalets & adventure activities.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4 text-left font-['Montserrat',sans-serif]">
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 block uppercase tracking-wider">
              Full Name <span className="text-[#FF5722]">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] text-sm text-gray-900 outline-none transition-all min-h-[44px]"
            />
          </div>

          {/* WhatsApp Phone Number Field with +91 Prefix */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 block uppercase tracking-wider">
              WhatsApp Phone Number <span className="text-[#FF5722]">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-sm font-semibold text-gray-500 select-none">
                +91
              </span>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="81237 15275"
                className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] text-sm text-gray-900 outline-none transition-all min-h-[44px]"
              />
            </div>
          </div>

          {/* Check-In / Travel Date Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 block uppercase tracking-wider">
              Check-In / Travel Date <span className="text-[#FF5722]">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="date"
                required
                value={checkInDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] text-sm text-gray-900 outline-none transition-all min-h-[44px]"
              />
            </div>
          </div>

          {/* Adults & Children Selection Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Adults (12+ Yrs) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 block uppercase tracking-wider">
                Adults (12+ Yrs)
              </label>
              <select
                value={adultsCount}
                onChange={(e) => setAdultsCount(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-300 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] text-sm text-gray-900 outline-none bg-white transition-all cursor-pointer min-h-[44px]"
              >
                <option value="1 Adult">1 Adult</option>
                <option value="2 Adults">2 Adults</option>
                <option value="3 Adults">3 Adults</option>
                <option value="4 Adults">4 Adults</option>
                <option value="5 Adults">5 Adults</option>
                <option value="6+ Adults">6+ Adults (Group)</option>
              </select>
            </div>

            {/* Children (5-11 Yrs) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 block uppercase tracking-wider">
                Children (5-11 Yrs)
              </label>
              <select
                value={childrenCount}
                onChange={(e) => setChildrenCount(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-300 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] text-sm text-gray-900 outline-none bg-white transition-all cursor-pointer min-h-[44px]"
              >
                <option value="0 Children">0 Children</option>
                <option value="1 Child">1 Child</option>
                <option value="2 Children">2 Children</option>
                <option value="3 Children">3 Children</option>
                <option value="4+ Children">4+ Children</option>
              </select>
            </div>
          </div>

          {/* Primary CTA Submit Button with Paper Plane Send Icon */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-3.5 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-orange-500/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider text-xs sm:text-sm min-h-[48px]"
            >
              <Send className="w-4 h-4 shrink-0 rotate-45" />
              <span>SEND BOOKING REQUEST VIA WHATSAPP</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;


