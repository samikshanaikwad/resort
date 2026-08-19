import React, { useEffect, useState } from "react";
import { ArrowLeft, Home, MessageSquare, Phone } from "lucide-react";
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

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState("");

  const loadData = async () => {
    setLoading(true);
    const [foundResort, list] = await Promise.all([
      fetchResortBySlug(slug),
      fetchResorts(),
    ]);

    setResort(foundResort);
    setAllResorts(list);
    setLoading(false);
  };

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
  }, [slug]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#152C22] flex flex-col items-center justify-center text-white px-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-[#FF5500] rounded-full animate-spin mb-4" />
        <p className="text-white/80 font-sans tracking-wide text-sm">
          Loading Wilderness Category Experience...
        </p>
      </div>
    );
  }

  if (!resort) {
    return (
      <div className="min-h-screen bg-[#152C22] flex flex-col items-center justify-center text-white px-4 text-center">
        <h2 className="text-3xl font-bold font-['Playfair_Display',serif] mb-4">
          Resort Category Not Found
        </h2>
        <p className="text-white/70 max-w-md mb-8">
          The stay or category you are looking for might have been moved or updated.
        </p>
        <button
          onClick={onNavigateHome}
          className="px-6 py-3 rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
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
