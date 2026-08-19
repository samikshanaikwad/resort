import React, { useState } from "react";
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Resort } from "../../types/resort";

interface CategoryGalleryProps {
  resort: Resort;
}

export const CategoryGallery: React.FC<CategoryGalleryProps> = ({ resort }) => {
  const defaultImages = [
    resort.image_url,
    resort.explore_image_url || resort.image_url,
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80"
  ];

  const galleryList = resort.gallery_images && resort.gallery_images.length > 0
    ? resort.gallery_images
    : defaultImages;

  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + galleryList.length) % galleryList.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % galleryList.length);
    }
  };

  return (
    <section 
      id="category-gallery-section"
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#F2F4F2] font-['Montserrat',sans-serif]"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 space-y-2 sm:space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#11221A] tracking-tight">
            A Glimpse into Luxury Stays
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            Explore authentic guest views, riverfront architecture, and tranquil surroundings.
          </p>
        </div>

        {/* Dynamic Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {galleryList.map((imgUrl, index) => (
            <div
              key={index}
              onClick={() => setActiveLightboxIndex(index)}
              className="relative group cursor-pointer overflow-hidden rounded-3xl bg-gray-200 aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-500"
            >
              <img
                src={imgUrl}
                alt={`${resort.title} - Dandeli resort room, amenities and scenery photo ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              
              {/* Dark Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                <span className="text-white text-xs font-medium uppercase tracking-wider">
                  View Full Resolution
                </span>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setActiveLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-10"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-10"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Image */}
          <div 
            className="relative max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryList[activeLightboxIndex]}
              alt={`${resort.title} full view`}
              className="max-h-[85vh] max-w-full object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium">
              {activeLightboxIndex + 1} / {galleryList.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
