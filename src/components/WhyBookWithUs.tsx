import React from "react";
import { PLACEHOLDERS } from "../config/placeholders";

export const WhyBookWithUs: React.FC = () => {
  return (
    <section id="why-us" className="pt-8 md:pt-12 pb-12 px-4 sm:px-6 lg:px-8 bg-[#F2F4F2] font-['Montserrat',sans-serif]">
      {/* Section Title */}
      <div className="max-w-7xl mx-auto text-center mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#11221A]">
          Why Book with Us
        </h2>
      </div>

      {/* 3-Column Layout Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Heading + Expanded Description for Visual Balance */}
        <div className="pt-1 space-y-3">
          <h3 className="text-xl sm:text-2xl font-bold text-[#11221A]">
            Adventure Activities
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            Discover unforgettable Dandeli adventures with exhilarating river rafting, white-water kayaking, and immersive wildlife treks through pristine Western Ghats trails.
          </p>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            Our expert-led outdoor experiences cater to thrill-seekers and family groups alike, offering certified safety gear, trained local guides, and seamless itinerary planning for every trip.
          </p>
        </div>

        {/* Center Column: Clean Straight Rafting Card */}
        <div className="flex justify-center w-full">
          <div className="bg-white p-3 rounded-3xl shadow-md border border-gray-100 w-full max-w-sm">
            <img
              src={PLACEHOLDERS.PLACEHOLDER_ACTIVITY_1_IMG || "https://res.cloudinary.com/ykltx8zw/image/upload/v1786455303/dandeli-adventure-trip-1-qumm3w0yvi37f968p7h109roo11u3lg0gbtczerm9s_yjq2nu.webp"}
              alt="Dandeli River Rafting"
              className="w-full h-[240px] sm:h-[280px] object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Right Column: Description & Balanced 2-Column Attractions List */}
        <div className="space-y-4 pt-1 md:col-span-2 lg:col-span-1">
          <p className="text-gray-600 text-sm leading-relaxed">
            When you're ready to explore the enchanting beauty of Dandeli, choosing the right travel partner is key. At Dandeli Adventure, we're committed to making your experience truly unforgettable.
          </p>

          <div>
            <h4 className="font-bold text-[#11221A] text-sm mb-3">
              Some of the major attractions of Dandeli include:
            </h4>

            {/* 2 Equal Columns (4 Items Each) */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs sm:text-sm font-medium text-gray-800">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0" />
                  <span>Whitewater Rafting</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0" />
                  <span>Birdwatching</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0" />
                  <span>Jungle Safari</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0" />
                  <span>Trekking</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0" />
                  <span>Kayaking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0" />
                  <span>Nature Walks</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0" />
                  <span>Camping</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0" />
                  <span>Ziplining</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};


