import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { Resort, PackageTier } from "../../types/resort";

interface CategoryPackagesIncludedProps {
  resort: Resort;
  onBookPackage: (pkg: PackageTier) => void;
}

function normalizePackageTier(item: any, index: number, defaultPrice: unknown): PackageTier {
  const safeDefaultPrice = String(defaultPrice || "₹1,300 / head").trim();
  if (!item) {
    return {
      id: `pkg-${index}`,
      name: `Stay Package ${index + 1}`,
      price_per_person: safeDefaultPrice,
      capacity_badge: "2-4 Guests",
      description: "Includes accommodation, buffet meals, and activities.",
    };
  }
  if (typeof item === "string") {
    const parts = item.split("|").map((p: string) => String(p || "").trim());
    return {
      id: `pkg-${index}`,
      name: parts[0] || `Package ${index + 1}`,
      price_per_person: parts[1] || safeDefaultPrice,
      capacity_badge: parts[2] || "2-4 Guests",
      description: parts[3] || "Includes standard accommodation, meals, and activities.",
    };
  }
  return {
    id: String(item.id || `pkg-${index}`).trim(),
    name: typeof item.name === "string" ? item.name.trim() : String(item.name || `Package ${index + 1}`).trim(),
    price_per_person: typeof item.price_per_person === "string" ? item.price_per_person.trim() : String(item.price_per_person || safeDefaultPrice).trim(),
    capacity_badge: typeof item.capacity_badge === "string" ? item.capacity_badge.trim() : String(item.capacity_badge || "Min 2 - Max 4 Guests").trim(),
    description: typeof item.description === "string" ? item.description.trim() : String(item.description || "Includes accommodation and amenities.").trim(),
  };
}

export const CategoryPackagesIncluded: React.FC<CategoryPackagesIncludedProps> = ({
  resort,
  onBookPackage,
}) => {
  // Default packages if not specified
  const rawPackages = resort.packages && resort.packages.length > 0 ? resort.packages : [];
  const packagesList: PackageTier[] = rawPackages.length > 0
    ? rawPackages.map((p, idx) => normalizePackageTier(p, idx, resort.price_per_night))
    : [
        {
          id: "pkg-std",
          name: "Standard Forest Stay Package",
          price_per_person: resort.price_per_night || "₹1,300 / head",
          capacity_badge: "Min 2 - Max 4 Guests",
          description: "Comfortable ensuite room/cottage with garden patio and all standard buffet meals included."
        },
        {
          id: "pkg-dlx",
          name: "Deluxe Riverview Package",
          price_per_person: "₹2,200 / head",
          capacity_badge: "Min 2 - Max 4 Guests",
          description: "Air-conditioned premium wooden chalet featuring scenic river view windows and private balcony."
        }
      ];

  const whatsIncludedList: string[] = resort.whats_included && resort.whats_included.length > 0
    ? resort.whats_included
    : [
        "3 Unlimited Buffet Meals (Breakfast, Lunch & Dinner)",
        "4 Water Adventure Activities (Kayaking, Boating, Zorbing, River Jacuzzi)",
        "Campfire & Evening Relaxation with Music",
        "Guided Morning Nature & Bird Watching Trail",
        "Swimming Pool & Outdoor Lawn Game Access",
        "Free High-Speed Wi-Fi & Reserved Parking"
      ];

  const [selectedPkgId, setSelectedPkgId] = useState<string>(packagesList[0]?.id || "");

  const handleSelect = (pkg: PackageTier) => {
    setSelectedPkgId(pkg.id);
  };

  const currentSelectedPkg = packagesList.find(p => p.id === selectedPkgId) || packagesList[0];

  return (
    <section 
      id="category-packages-section"
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#F2F4F2] font-['Montserrat',sans-serif] text-gray-800 border-t border-black/5"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Compact Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#11221A]">
            Packages & What's Included
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-2">
            Choose your preferred stay configuration with guaranteed lowest pricing and complete itinerary support.
          </p>
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left Column: Available Package Tiers */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg text-[#11221A]">Available Package Tiers</h3>
              <span className="text-xs font-semibold text-[#FF5722] tracking-wider uppercase">
                PER HEAD / NIGHT
              </span>
            </div>

            <div className="space-y-3.5">
              {packagesList.map((tier) => {
                const isSelected = tier.id === selectedPkgId;
                return (
                  <div
                    key={tier.id}
                    onClick={() => handleSelect(tier)}
                    className={`p-4 sm:p-5 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white border-2 border-[#FF5722] shadow-md"
                        : "bg-white border border-gray-200 shadow-sm hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? "border-[#FF5722]" : "border-gray-400"
                          }`}>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-[#FF5722]" />}
                          </span>
                          <h4 className="font-bold text-base text-gray-900 leading-tight">
                            {tier.name}
                          </h4>
                        </div>
                        {tier.capacity_badge && (
                          <span className="inline-block mt-1.5 ml-6 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded font-medium">
                            {tier.capacity_badge}
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-lg text-[#FF5722]">{tier.price_per_person}</span>
                        <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Taxes Included</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 pl-6 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onBookPackage(currentSelectedPkg)}
              className="w-full bg-[#FF5722] hover:bg-[#E04818] text-white font-bold py-3.5 rounded-xl text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <span>RESERVE SELECTED PACKAGE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: What's Included in Every Stay */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-[#11221A] flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <ShieldCheck className="w-5 h-5 text-[#FF5722]" />
              <span>What's Included in Every Stay</span>
            </h3>

            <ul className="space-y-3 pt-1">
              {whatsIncludedList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-[#FF5722] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
