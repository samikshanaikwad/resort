import React, { useEffect } from "react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "place" | "hotel";
  structuredData?: Record<string, any>;
  breadcrumbs?: BreadcrumbItem[];
}

export const DEFAULT_SEO = {
  title: "Dandeli Stay Booking | Best Riverfront Resorts, Cottages & Safaris",
  description:
    "Book verified Dandeli riverfront resorts, jungle chalets, luxury treehouses & tent stays with all-inclusive meals, water sports, white water rafting & safari. Instant WhatsApp booking.",
  keywords:
    "Dandeli stay booking, Dandeli resorts, Dandeli riverfront resorts, Dandeli jungle safari, river rafting Dandeli, Dandeli cottages, homestays in Dandeli, Kali river resort, luxury treehouse Dandeli, water sports Dandeli",
  siteUrl: "https://dandelistaybooking.com",
  defaultImage:
    "https://res.cloudinary.com/ykltx8zw/image/upload/v1786201763/A-Complete-Guide-to-White-Water-Rafting-In-Dandeli_ech9ip.webp",
  phone: "+918123715275",
  email: "dandelistaybooking@gmail.com",
  siteName: "Dandeli Stay Booking",
};

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = "website",
  structuredData,
  breadcrumbs,
}) => {
  const currentTitle = title || DEFAULT_SEO.title;
  const currentDesc = description || DEFAULT_SEO.description;
  const currentKeywords = keywords || DEFAULT_SEO.keywords;
  const currentImage = ogImage || DEFAULT_SEO.defaultImage;
  const currentCanonical =
    canonicalUrl ||
    (typeof window !== "undefined"
      ? window.location.href.split("#")[0] + (window.location.hash || "")
      : DEFAULT_SEO.siteUrl);

  useEffect(() => {
    // 1. Update Document Title
    document.title = currentTitle;

    // 2. Helper to set or update meta tag by name or property
    const updateMetaTag = (
      attribute: "name" | "property",
      key: string,
      value: string
    ) => {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    };

    // Helper for link tags (canonical, etc.)
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Standard Meta Tags
    updateMetaTag("name", "description", currentDesc);
    updateMetaTag("name", "keywords", currentKeywords);
    updateMetaTag("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    updateMetaTag("name", "author", "Dandeli Stay Booking");
    updateMetaTag("name", "theme-color", "#1F1511");

    // Geo Location Meta Tags for Dandeli, Karnataka, India
    updateMetaTag("name", "geo.region", "IN-KA");
    updateMetaTag("name", "geo.placename", "Dandeli, Uttara Kannada, Karnataka, India");
    updateMetaTag("name", "geo.position", "15.2285;74.6200");
    updateMetaTag("name", "ICBM", "15.2285, 74.6200");

    // OpenGraph Meta Tags
    updateMetaTag("property", "og:site_name", DEFAULT_SEO.siteName);
    updateMetaTag("property", "og:title", currentTitle);
    updateMetaTag("property", "og:description", currentDesc);
    updateMetaTag("property", "og:image", currentImage);
    updateMetaTag("property", "og:url", currentCanonical);
    updateMetaTag("property", "og:type", ogType);
    updateMetaTag("property", "og:locale", "en_US");

    // Twitter Card Meta Tags
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", currentTitle);
    updateMetaTag("name", "twitter:description", currentDesc);
    updateMetaTag("name", "twitter:image", currentImage);
    updateMetaTag("name", "twitter:site", "@DandeliStays");

    // Canonical Tag
    updateLinkTag("canonical", currentCanonical);

    // 3. Inject / Update JSON-LD Structured Data
    const scriptId = "dandeli-seo-jsonld";
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.id = scriptId;
      scriptElement.type = "application/ld+json";
      document.head.appendChild(scriptElement);
    }

    // Prepare combined structured data
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": ["LodgingBusiness", "TravelAgency", "LocalBusiness"],
      "@id": "https://dandelistaybooking.com/#organization",
      "name": "Dandeli Stay Booking",
      "alternateName": "Dandeli Resorts & Safari Booking Concierge",
      "url": "https://dandelistaybooking.com",
      "logo": "https://res.cloudinary.com/ykltx8zw/image/upload/v1786201763/A-Complete-Guide-to-White-Water-Rafting-In-Dandeli_ech9ip.webp",
      "image": [
        "https://res.cloudinary.com/ykltx8zw/image/upload/v1786201763/A-Complete-Guide-to-White-Water-Rafting-In-Dandeli_ech9ip.webp",
        "https://res.cloudinary.com/ykltx8zw/image/upload/v1786263992/da_vx9nbm.jpg",
        "https://res.cloudinary.com/ykltx8zw/image/upload/v1786201765/river-edge-dandeli-river-resort-27-2000x1334_xhvltt.jpg"
      ],
      "telephone": DEFAULT_SEO.phone,
      "email": DEFAULT_SEO.email,
      "priceRange": "₹₹ (₹1,100 - ₹5,500 per person)",
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, Credit Card, UPI, Google Pay, PhonePe, Net Banking",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "J.N. Road, Near Kali River Bridge",
        "addressLocality": "Dandeli",
        "addressRegion": "Karnataka",
        "postalCode": "581325",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 15.2285,
        "longitude": 74.6200
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      },
      "sameAs": [
        "https://wa.me/918123715275",
        "https://instagram.com/dandelistaybooking"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Dandeli Vacation & Safari Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Riverside Resort Booking with All Buffet Meals",
              "description": "All-inclusive Kali riverfront resort stays with air-conditioned cottages and swimming pool."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "White Water Rafting on Kali River",
              "description": "Grade 2 & 3 certified white water river rafting expeditions in Dandeli."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Dandeli Wildlife Safari & Jungle Treks",
              "description": "Guided Anshi-Dandeli Tiger Reserve open-jeep safaris and bird watching."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Canopy Treehouses & Luxury Camping",
              "description": "35-foot elevated luxury treehouse suites and shoreline alpine tent accommodations."
            }
          }
        ]
      }
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://dandelistaybooking.com/#website",
      "url": "https://dandelistaybooking.com",
      "name": "Dandeli Stay Booking",
      "description": "Premier online reservation platform for luxury jungle resorts, chalets, and adventure activities in Dandeli.",
      "publisher": {
        "@id": "https://dandelistaybooking.com/#organization"
      }
    };

    const schemasToInject: any[] = [localBusinessSchema, websiteSchema];

    // Add Breadcrumbs schema if available
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemasToInject.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      });
    }

    // Add custom/page-specific structured data (e.g. Resort LodgingBusiness or Product)
    if (structuredData) {
      schemasToInject.push(structuredData);
    }

    scriptElement.textContent = JSON.stringify(schemasToInject);
  }, [
    currentTitle,
    currentDesc,
    currentKeywords,
    currentCanonical,
    currentImage,
    ogType,
    structuredData,
    breadcrumbs,
  ]);

  return null;
};
