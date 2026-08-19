import React from "react";
import { ShieldCheck, Tag, Compass } from "lucide-react";
import { PLACEHOLDERS } from "../config/placeholders";

export const EverythingHandled: React.FC = () => {
  return (
    <section id="handled-features" className="relative pt-6 md:pt-10 pb-6 bg-[#F2F4F2] font-['Montserrat',sans-serif]">
      {/* Main White Canvas Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-gray-100">
            
            {/* Feature 1 */}
            <div id="handled-card-1" className="flex flex-col items-center text-center px-4 md:px-8">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF2EE] flex items-center justify-center text-[#FF5722] mb-5 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#11221A] mb-3">
                {PLACEHOLDERS.PLACEHOLDER_CARD_1_TITLE || "Best Price & Value Guarantee"}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                {PLACEHOLDERS.PLACEHOLDER_CARD_1_DESC || "Direct ties with resort owners ensure unbeatable group rates with all buffet meals included."}
              </p>
            </div>

            {/* Feature 2 */}
            <div id="handled-card-2" className="flex flex-col items-center text-center px-4 md:px-8">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF2EE] flex items-center justify-center text-[#FF5722] mb-5 shadow-sm">
                <Tag className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#11221A] mb-3">
                {PLACEHOLDERS.PLACEHOLDER_CARD_2_TITLE || "Custom Adventure Packages"}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                {PLACEHOLDERS.PLACEHOLDER_CARD_2_DESC || "Bundle rafting, kayaking, jungle safari, and zipline into an all-in-one stress-free booking."}
              </p>
            </div>

            {/* Feature 3 */}
            <div id="handled-card-3" className="flex flex-col items-center text-center px-4 md:px-8">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF2EE] flex items-center justify-center text-[#FF5722] mb-5 shadow-sm">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#11221A] mb-3">
                {PLACEHOLDERS.PLACEHOLDER_CARD_3_TITLE || "Dedicated Local Concierge"}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                {PLACEHOLDERS.PLACEHOLDER_CARD_3_DESC || "Instant WhatsApp support from check-in to check-out with on-ground local staff."}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};



