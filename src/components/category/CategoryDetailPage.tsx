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
  id?: string;
  slug?: string;
  categorySlug?: string;
  onNavigateHome: () => void;
  onNavigateToCategory: (slug: string) => void;
}

/**
 * Custom hook to safely extract route parameters from pathname, hash, or query string
 * Supports /category/:id, /category/:categorySlug, #category/:id, /#category/:id, etc.
 */
export function useParams<T extends Record<string, string | undefined>>(): T {
  const hash = typeof window !== "undefined" ? window.location.hash || "" : "";
  const path = typeof window !== "undefined" ? window.location.pathname || "" : "";
  const search = typeof window !== "undefined" ? window.location.search || "" : "";

  let extractedParam = "";

  // 1. Check pathname: /category/:id, /category/:categorySlug, /stay/:id
  const pathMatch = path.match(/^\/(?:category|stay|resort)\/([^\/?#]+)/i);
  if (pathMatch && pathMatch[1]) {
    extractedParam = decodeURIComponent(pathMatch[1]).trim();
  }

  // 2. Check hash: #category/:id, /#category/:id, #/category/:id, #stay/:id
  if (!extractedParam && hash) {
    const cleanHash = hash.replace(/^#\/?/, "");
    const hashMatch = cleanHash.match(/^(?:category|stay|resort)\/([^\/?#]+)/i);
    if (hashMatch && hashMatch[1]) {
      extractedParam = decodeURIComponent(hashMatch[1]).trim();
    }
  }

  // 3. Check query string: ?id=:id, ?category=:id, ?categorySlug=:slug
  if (!extractedParam && search) {
    const params = new URLSearchParams(search);
    const qParam =
      params.get("id") ||
      params.get("categorySlug") ||
      params.get("category") ||
      params.get("slug") ||
      params.get("stay") ||
      params.get("resort");
    if (qParam) {
      extractedParam = decodeURIComponent(qParam).trim();
    }
  }

  return {
    id: extractedParam || undefined,
    categorySlug: extractedParam || undefined,
    slug: extractedParam || undefined,
  } as unknown as T;
}

export const useCategoryParams = useParams;

/**
 * LoadingSpinner Component
 */
export const LoadingSpinner: React.FC = () => {
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
};

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  id: propId,
  slug: propSlug,
  categorySlug: propCategorySlug,
  onNavigateHome,
  onNavigateToCategory,
}) => {
  // Extract route parameters safely via useParams
  const params = useParams<{ id?: string; categorySlug?: string; slug?: string }>();
  
  // Safely parse parameter inputs from props or useParams() with explicit String wrapper
  const categoryIdOrSlug = String(propId || propCategorySlug || propSlug || params.id || params.categorySlug || params.slug || "").trim();

  const [resort, setResort] = useState<Resort | null>(null);
  const [allResorts, setAllResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState("");

  const fetchCategoryData = useCallback(async (isRetry = false) => {
    if (isRetry) setIsRetrying(true);
    else setLoading(true);

    try {
      // 1. Fetch all resorts first as reliable foundation
      const list = await fetchResorts();
      const safeList = Array.isArray(list) && list.length > 0 ? list : [];
      setAllResorts(safeList);

      if (categoryIdOrSlug) {
        // Convert to number ONLY when comparing against integer database columns or numerical indexes
        const numericId = Number(categoryIdOrSlug);
        const isNumeric = !isNaN(numericId) && numericId > 0;
        const queryParam = isNumeric ? numericId : categoryIdOrSlug;

        // Fetch specific resort by category slug or numeric ID
        const foundResort = await fetchResortBySlug(queryParam);
        if (foundResort) {
          setResort(foundResort);
        } else if (safeList.length > 0) {
          // Fallback search across loaded list if direct fetch returned null
          const normalized = decodeURIComponent(categoryIdOrSlug).toLowerCase().trim();
          const fallbackMatch = safeList.find((r, index) => {
            const rSlug = String(r.slug || "").toLowerCase().trim();
            const rId = String(r.id || "").toLowerCase().trim();
            const rTitle = String(r.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
            
            if (rSlug === normalized || rId === normalized || rTitle === normalized) return true;
            if (isNumeric && (index + 1 === numericId || Number(rId.replace(/[^0-9]/g, "")) === numericId)) return true;
            return false;
          });

          setResort(fallbackMatch || safeList[0]);
        } else {
          setResort(null);
        }
      } else if (safeList.length > 0) {
        // Fall back to first available stay if identifier is missing
        setResort(safeList[0]);
      } else {
        setResort(null);
      }
    } catch (err) {
      console.error("Error loading category detail page:", err);
      // Graceful fallback to avoid breaking render execution
      if (allResorts.length > 0) {
        setResort(allResorts[0]);
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [categoryIdOrSlug, allResorts]);

  useEffect(() => {
    fetchCategoryData();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const handleLocalUpdate = () => {
      fetchCategoryData();
    };
    window.addEventListener("dandeli_resorts_updated", handleLocalUpdate);

    const unsubscribe = subscribeToResortsRealtime(() => {
      fetchCategoryData();
    });

    return () => {
      window.removeEventListener("dandeli_resorts_updated", handleLocalUpdate);
      unsubscribe();
    };
  }, [fetchCategoryData]);

  // Auto-redirect timer to home if no category data found at all
  useEffect(() => {
    if (!loading && !resort) {
      setRedirectCountdown(8);
      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev !== null && prev <= 1) {
            clearInterval(interval);
            onNavigateHome();
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setRedirectCountdown(null);
    }
  }, [loading, resort, onNavigateHome]);

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
    return <LoadingSpinner />;
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
          <p className="text-gray-300 text-sm sm:text-base max-w-lg mb-4 leading-relaxed">
            The stay or category <span className="text-[#FF5722] font-semibold font-mono">"{categoryIdOrSlug || "requested"}"</span> could not be located. It might have been renamed or relocated.
          </p>

          {redirectCountdown !== null && redirectCountdown > 0 && (
            <p className="text-xs text-white/50 mb-6">
              Auto-redirecting to Dandeli Home in {redirectCountdown}s...
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button
              onClick={() => fetchCategoryData(true)}
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

// Aliases for React Router & component naming compatibility
export const CategoryPage = CategoryDetailPage;
export default CategoryDetailPage;

