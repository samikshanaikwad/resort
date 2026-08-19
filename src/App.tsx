/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroCarousel } from "./components/HeroCarousel";
import { WelcomeSection } from "./components/WelcomeSection";
import { ResortsShowcase } from "./components/ResortsShowcase";
import { ActivitiesGrid } from "./components/ActivitiesGrid";
import { WhyBookWithUs } from "./components/WhyBookWithUs";
import { SpotsGrid } from "./components/SpotsGrid";
import { CtaBanner } from "./components/CtaBanner";
import { EverythingHandled } from "./components/EverythingHandled";
import { Footer } from "./components/Footer";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { EnquiryModal } from "./components/EnquiryModal";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminLoginModal } from "./components/admin/AdminLoginModal";
import { CategoryDetailPage } from "./components/category/CategoryDetailPage";
import { SEOHead } from "./components/SEOHead";

export default function App() {
  // Parse Initial Route from Hash, Pathname, or Query String with full slug normalization
  const parseCurrentLocation = () => {
    const hash = window.location.hash || "";
    const path = window.location.pathname || "";
    const search = window.location.search || "";

    // 1. Admin Route Detection
    if (hash === "#admin" || path === "/admin") {
      return { route: "admin" as const, categorySlug: null };
    }

    // 2. Path-based deep link matching (/category/:slug, /stay/:slug)
    const pathCategoryMatch = path.match(/^\/(?:category|stay|resort)\/([^\/?#]+)/i);
    if (pathCategoryMatch && pathCategoryMatch[1]) {
      const slug = decodeURIComponent(pathCategoryMatch[1]).trim();
      return { route: "category" as const, categorySlug: slug };
    }

    // 3. Hash-based deep link matching (#category/:slug, #/category/:slug, #stay/:slug)
    const cleanHash = hash.replace(/^#\/?/, "");
    const hashCategoryMatch = cleanHash.match(/^(?:category|stay|resort)\/([^\/?#]+)/i);
    if (hashCategoryMatch && hashCategoryMatch[1]) {
      const slug = decodeURIComponent(hashCategoryMatch[1]).trim();
      return { route: "category" as const, categorySlug: slug };
    }

    // 4. Query string fallback (?category=:slug, ?stay=:slug)
    if (search) {
      const params = new URLSearchParams(search);
      const querySlug = params.get("category") || params.get("stay") || params.get("resort");
      if (querySlug) {
        return { route: "category" as const, categorySlug: decodeURIComponent(querySlug).trim() };
      }
    }

    return { route: "home" as const, categorySlug: null };
  };

  const initial = parseCurrentLocation();
  const [currentRoute, setCurrentRoute] = useState<"home" | "category" | "admin">(initial.route);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(initial.categorySlug);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState<string>("");

  useEffect(() => {
    const handleRouteChange = () => {
      const parsed = parseCurrentLocation();
      setCurrentRoute(parsed.route);
      setActiveCategorySlug(parsed.categorySlug);

      if (parsed.route === "admin" && !isAdminAuthenticated) {
        setIsLoginModalOpen(true);
      }
    };

    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [isAdminAuthenticated]);

  const navigateToCategory = (slug: string) => {
    window.location.hash = `#category/${slug}`;
    setActiveCategorySlug(slug);
    setCurrentRoute("category");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToHome = () => {
    window.location.hash = "";
    setCurrentRoute("home");
    setActiveCategorySlug(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenEnquiry = (subject?: string) => {
    setEnquirySubject(subject || "General Wilderness Safari Booking");
    setIsEnquiryOpen(true);
  };

  const handleExitAdmin = () => {
    navigateToHome();
  };

  // Route 1: Admin Management Portal
  if (currentRoute === "admin" && isAdminAuthenticated) {
    return <AdminDashboard onExit={handleExitAdmin} />;
  }

  // Route 2: Standalone Resort Category Dynamic Page (/category/:categorySlug or #category/:categorySlug)
  if (currentRoute === "category") {
    return (
      <CategoryDetailPage
        categorySlug={activeCategorySlug || undefined}
        slug={activeCategorySlug || undefined}
        onNavigateHome={navigateToHome}
        onNavigateToCategory={navigateToCategory}
      />
    );
  }

  // Route 3: Public Homepage
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#EFF3EE] text-[#152C22] font-sans antialiased relative selection:bg-[#FF5722] selection:text-white">
      {/* 1. Dynamic SEO Meta Tags & JSON-LD Structured Data */}
      <SEOHead
        title="Dandeli Stay Booking | Best Riverfront Resorts, Cottages & Safaris"
        description="Book verified Dandeli riverfront resorts, jungle chalets, luxury treehouses & tent stays with all-inclusive meals, water sports, white water rafting & safari. Instant WhatsApp booking."
        canonicalUrl="https://dandelistaybooking.com/"
        ogType="website"
      />

      {/* 2. Sticky Header & Navigation with Dynamic Dropdown Categories */}
      <Header onOpenEnquiry={() => handleOpenEnquiry("Custom Safari Itinerary")} />

      <main className="w-full overflow-x-hidden">
        {/* Section 1: Hero Image Carousel */}
        <HeroCarousel onOpenEnquiry={() => handleOpenEnquiry("Wilderness Safari Expeditions")} />

        {/* Section 2: Welcome / Intro Section */}
        <WelcomeSection onOpenEnquiry={() => handleOpenEnquiry("Wilderness Sanctuary Package")} />

        {/* Section 3: Wilderness Escape / Stays & Resorts Showcase with Standalone Page VIEW Routing */}
        <ResortsShowcase 
          onSelectCategory={navigateToCategory} 
          onOpenEnquiry={() => handleOpenEnquiry("Luxury Resort & Villa Reservation")} 
        />

        {/* Section 4: Adventures & Activities Grid */}
        <ActivitiesGrid onOpenEnquiry={(title) => handleOpenEnquiry(`Activity Booking: ${title || "Forest Activity"}`)} />

        {/* Section 5: Why Book With Us Feature Section */}
        <WhyBookWithUs />

        {/* Section 6: Must-Explore Spots Around the Forest */}
        <SpotsGrid onOpenEnquiry={(title) => handleOpenEnquiry(`Excursion Inquiry: ${title || "Forest Viewpoint"}`)} />

        {/* Section 7: Full-Width Call-to-Action (Jungle Banner) */}
        <CtaBanner onOpenEnquiry={() => handleOpenEnquiry("Priority Safari Reservation")} />

        {/* Section 8: Everything Handled, From Stay to Safari Features */}
        <EverythingHandled />
      </main>

      {/* Section 9: Footer & Wave Transition */}
      <Footer onOpenEnquiry={() => handleOpenEnquiry("Footer Custom Inquiry")} />

      {/* Fixed Global Floating Elements */}
      <FloatingWhatsApp onOpenEnquiry={() => handleOpenEnquiry("WhatsApp Safari Inquiry")} />

      {/* Interactive Booking & Enquiry Modal */}
      <EnquiryModal 
        isOpen={isEnquiryOpen} 
        onClose={() => setIsEnquiryOpen(false)} 
        initialSubject={enquirySubject} 
      />

      {/* Admin Login Modal (Triggered on #admin or direct click) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen || (currentRoute === "admin" && !isAdminAuthenticated)}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (currentRoute === "admin" && !isAdminAuthenticated) {
            handleExitAdmin();
          }
        }}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsLoginModalOpen(false);
          setCurrentRoute("admin");
        }}
      />
    </div>
  );
}
