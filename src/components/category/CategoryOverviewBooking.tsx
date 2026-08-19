import React from "react";
import { Phone, Clock, MessageCircle } from "lucide-react";
import { Resort } from "../../types/resort";
import { PLACEHOLDERS } from "../../config/placeholders";

interface CategoryOverviewBookingProps {
  resort: Resort;
  onBookNow: () => void;
}

export const CategoryOverviewBooking: React.FC<CategoryOverviewBookingProps> = ({
  resort,
  onBookNow,
}) => {
  const title = typeof resort?.title === "string" ? resort.title.trim() : (typeof resort?.name === "string" ? resort.name.trim() : String(resort?.title || resort?.name || "Dandeli Stay").trim());
  const description = typeof resort?.full_description === "string" && resort.full_description.trim()
    ? resort.full_description.trim()
    : (typeof resort?.short_description === "string" && resort.short_description.trim()
      ? resort.short_description.trim()
      : String(resort?.full_description || resort?.short_description || "Experience the best of Dandeli nature, water sports, and tranquil riverfront views.").trim());
  const checkIn = typeof resort?.check_in_time === "string" && resort.check_in_time.trim() ? resort.check_in_time.trim() : "11:00 AM";
  const checkOut = typeof resort?.check_out_time === "string" && resort.check_out_time.trim() ? resort.check_out_time.trim() : "10:00 AM";
  const rawPrice = typeof resort?.price_per_night === "string" ? resort.price_per_night : String(resort?.price_per_night || "1800");
  const rateText = String(rawPrice || "1800").replace(/^FROM\s*/i, "").trim() || "1800";
  const phone = typeof resort?.contact_phone === "string" && resort.contact_phone.trim() ? resort.contact_phone.trim() : (PLACEHOLDERS.PLACEHOLDER_NAV_PHONE || "+91 8123715275");

  return (
    <section 
      id="category-overview-booking"
      className="bg-[#F2F4F2] text-[#1F2925] py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-black/5 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[#1F2925] font-['Montserrat',sans-serif] items-center">
          
          {/* Left Column: Description & Check-in/out Details */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1F2925]">
              Welcome to {title}
            </h1>

            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {description}
            </p>

            {/* Badges for Check In / Check Out / Price */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 bg-white text-[#1F2925] px-4 py-2 rounded-lg text-sm border border-black/10 shadow-sm">
                <Clock className="w-4 h-4 text-[#FF5722]" />
                <span>Check In: <strong>{checkIn}</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-white text-[#1F2925] px-4 py-2 rounded-lg text-sm border border-black/10 shadow-sm">
                <Clock className="w-4 h-4 text-[#FF5722]" />
                <span>Check Out: <strong>{checkOut}</strong></span>
              </div>
              <div className="bg-[#B84218] px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm">
                FROM {rateText} / night
              </div>
            </div>
          </div>

          {/* Right Column: Clean Integrated Contact & Booking Action */}
          <div className="flex flex-col justify-center space-y-4">
            <a
              href={`tel:${String(phone || "").replace(/\s+/g, "")}`}
              className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-black/10 p-4 rounded-xl text-lg font-bold transition-colors text-[#1F2925] shadow-sm"
            >
              <Phone className="w-5 h-5 text-[#FF5722]" />
              <span>{phone}</span>
            </a>

            <button 
              id="category-book-now-btn"
              onClick={onBookNow}
              className="w-full bg-[#FF5722] hover:bg-[#E04818] text-white font-bold py-4 rounded-xl text-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>BOOK NOW</span>
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
