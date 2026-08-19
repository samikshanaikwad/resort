import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Home, MessageSquare, Phone, RefreshCw, Compass, Building2, AlertCircle } from "lucide-react";
import { Resort, PackageTier } from "../../types/resort";
import { fetchResortBySlug, fetchResorts, subscribeToResortsRealtime } from "../../lib/supabaseClient";
import { CategoryHeroBanner } from "./CategoryHeroBanner";
import { CategoryOverviewBooking } from "./CategoryOverviewBooking";
import { CategoryExploration } from "./CategoryExploration";
import { CategoryPackagesIncluded } from "./CategoryPackagesIncluded";
import { CategoryGallery } from "./CategoryGallery";
import { CategoryOtherEscapes } from "./CategoryOtherEscapes";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { FloatingWhatsApp } from "../FloatingWhatsApp";
import { EnquiryModal } from "../EnquiryModal";
import { SEOHead } from "../SEOHead";

interface CategoryDetailPageProps {
  slug: string;
  onNavigateHome: () => void;
  onNavigateToCategory: (slug: string) => void;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  slug,
  onNavigateHome,
  onNavigateToCategory,
}) => {
  const [resort, setResort] = useState<Resort | null>(null);
  const [allResorts, setAllResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState("");

  const loadData = useCallback(async (isRetry = false) => {
    if (isRetry) setIsRetrying(true);
    else setLoading(true);

    try {
      const [foundResort, list] = await Promise.all([
        fetchResortBySlug(slug),
        fetchResorts(),
      ]);

      if (foundResort) {
        setResort(foundResort);
      } else {
        // Fallback search across list if direct fetch returned null
        const normalized = decodeURIComponent(slug).toLowerCase().trim();
        const fallbackMatch = list.find((r) => {
          const rSlug = (r.slug || "").toLowerCase().trim();
          const rId = (r.id || "").toLowerCase().trim();
          const rTitle = (r.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return rSlug === normalized || rId === normalized || rTitle === normalized;
        });
        setResort(fallbackMatch || null);
      }

      setAllResorts(list || []);
    } catch (err) {
      console.error("Error loading category detail page:", err);
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [slug]);

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const handleLocalUpdate = () => {
      loadData();
    };
    window.addEventListener("dandeli_resorts_updated", handleLocalUpdate);

    const unsubscribe = subscribeToResortsRealtime(() => {
      loadData();
    });

    return () => {
      window.removeEventListener("dandeli_resorts_updated", handleLocalUpdate);
      unsubscribe();
    };
  }, [loadData]);

  const handleOpenEnquiryModal = (customSubject?: string) => {
    setEnquirySubject(
      customSubject || `Booking Reservation: ${resort?.title || "Resort Stay"}`
    );
    setIsEnquiryOpen(true);
  };

  const handleBookPackage = (pkg: PackageTier) => {
    setEnquirySubject(
      `Package Booking: ${pkg.name} (${pkg.price_per_person}) at ${resort?.title}`
    );
    setIsEnquiryOpen(true);
  };

  // 1. Asynchronous Data Fetching & Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#11221A] flex flex-col items-center justify-center text-white px-4">
        {/* Animated Brand Ring Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="w-16 h-16 border-4 border-white/10 border-t-[#FF5722] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass className="w-6 h-6 text-[#FF5722] animate-pulse" />
          </div>
        </div>
        <h2 className="text-lg sm:text-xl font-bold font-['Montserrat',sans-serif] tracking-tight text-white mb-2">
          Loading Wilderness Experience
        </h2>
        <p className="text-white/60 font-sans tracking-wide text-xs sm:text-sm text-center max-w-sm">
          Retrieving live resort rates, Kali River suites, and verified safari itineraries...
        </p>
      </div>
    );
  }

  // 2. Resilience Guard: Resort Category Not Found with Suggested Escapes
  if (!resort) {
    return (
      <div className="min-h-screen bg-[#11221A] flex flex-col justify-between text-white font-['Montserrat',sans-serif]">
        <Header 
          onNavigateHome={onNavigateHome}
          onNavigateCategory={onNavigateToCategory}
        />

        <div className="max-w-4xl mx-auto px-4 py-16 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/30 flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-[#FF5722]" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Resort Category Not Found
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
            The stay or category <span className="text-[#FF5722] font-semibold font-mono">"{slug}"</span> could not be located. It might have been renamed or relocated.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button
              onClick={() => loadData(true)}
              disabled={isRetrying}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
              <span>{isRetrying ? "Retrying..." : "Refresh / Retry"}</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="px-7 py-3 rounded-full bg-[#FF5722] hover:bg-[#E04818] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg shadow-[#FF5722]/25 cursor-pointer min-h-[44px]"
            >
              <Home className="w-4 h-4" />
              <span>Explore All Dandeli Stays</span>
            </button>
          </div>

          {/* Quick Select from Available Resorts */}
          {allResorts.length > 0 && (
            <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
              <h3 className="text-xs uppercase tracking-widest text-[#FF5722] font-bold mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Available Handpicked Dandeli Resorts</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allResorts.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onNavigateToCategory(r.slug)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-white group-hover:text-[#FF5722] transition-colors truncate">
                      {r.title}
                    </span>
                    <span className="text-xs text-[#FF5722] shrink-0 font-bold ml-2">
                      View →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer onOpenEnquiry={() => handleOpenEnquiryModal("Custom Dandeli Stay Inquiry")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#EFF3EE] text-[#152C22] font-sans antialiased selection:bg-[#FF5722] selection:text-white">
      {/* Dynamic SEO Head with Specific Category & Lodging Schema */}
      <SEOHead
        title={`${resort.title} - Dandeli River Resort & Safari Booking | Best Price`}
        description={`Book ${resort.title} in Dandeli starting from ${resort.price_per_night}. ${resort.short_description} Includes all buffet meals & water activities. WhatsApp Instant Booking.`}
        keywords={`${resort.title}, ${resort.category}, Dandeli resorts, Dandeli stay booking, ${resort.title} prices, Dandeli river rafting package, homestay Dandeli`}
        canonicalUrl={`https://dandelistaybooking.com/#category/${resort.slug}`}
        ogImage={resort.image_url}
        ogType="hotel"
        breadcrumbs={[
          { name: "Home", url: "https://dandelistaybooking.com/" },
          { name: "Stays & Resorts", url: "https://dandelistaybooking.com/#stays" },
          { name: resort.title, url: `https://dandelistaybooking.com/#category/${resort.slug}` },
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          "name": resort.title,
          "description": resort.full_description || resort.short_description,
          "image": [resort.image_url, ...(resort.gallery_images || [])],
          "url": `https://dandelistaybooking.com/#category/${resort.slug}`,
          "telephone": resort.contact_phone || "+918123715275",
          "priceRange": resort.price_per_night || "₹₹",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dandeli",
            "addressRegion": "Karnataka",
            "postalCode": "581325",
            "addressCountry": "IN"
          },
          "amenityFeature": (resort.amenities || []).map((amenity) => ({
            "@type": "LocationFeatureSpecification",
            "name": amenity,
            "value": "True"
          })),
          "checkinTime": resort.check_in_time || "11:00",
          "checkoutTime": resort.check_out_time || "10:00"
        }}
      />

      {/* Dynamic Navbar Synchronized with live database */}
      <Header
        activeSection="stays"
        onOpenEnquiry={() => handleOpenEnquiryModal(`Itinerary Inquiry: ${resort.title}`)}
        onNavigateHome={onNavigateHome}
        onNavigateCategory={onNavigateToCategory}
      />

      <main className="w-full overflow-x-hidden">
        {/* SS1: Hero Header Banner */}
        <CategoryHeroBanner resort={resort} />

        {/* SS2: Overview & Direct Booking Bar */}
        <CategoryOverviewBooking 
          resort={resort} 
          onBookNow={() => handleOpenEnquiryModal(`Direct Reservation: ${resort.title}`)} 
        />

        {/* SS3: Exploration & Highlights */}
        <CategoryExploration resort={resort} />

        {/* SS4: Packages & What's Included */}
        <CategoryPackagesIncluded 
          resort={resort} 
          onBookPackage={handleBookPackage} 
        />

        {/* SS5: Photo Gallery ("A Glimpse into Luxury Stays") */}
        <CategoryGallery resort={resort} />

        {/* SS6 & SS7: Handpicked Dandeli Escapes Carousel */}
        <CategoryOtherEscapes 
          allResorts={allResorts} 
          currentSlug={resort.slug} 
          onNavigateToSlug={onNavigateToCategory} 
        />
      </main>

      {/* SS8: Footer */}
      <Footer 
        onOpenEnquiry={() => handleOpenEnquiryModal(`Custom Excursion: ${resort.title}`)} 
      />

      {/* Floating Global Contact Button */}
      <FloatingWhatsApp onOpenEnquiry={() => handleOpenEnquiryModal(`WhatsApp Priority: ${resort.title}`)} />

      {/* Booking Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialSubject={enquirySubject}
      />
    </div>
  );
};
