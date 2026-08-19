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
  // Parse Initial Route from Hash or Path
  const getInitialState = () => {
    const hash = window.location.hash || "";
    const path = window.location.pathname || "";

    if (hash === "#admin" || path === "/admin") {
      return { route: "admin" as const, categorySlug: null };
    }

    if (hash.startsWith("#category/")) {
      const slug = hash.replace("#category/", "").trim();
      return { route: "category" as const, categorySlug: slug };
    }

    if (hash.startsWith("#stay/")) {
      const slug = hash.replace("#stay/", "").trim();
      return { route: "category" as const, categorySlug: slug };
    }

    return { route: "home" as const, categorySlug: null };
  };

  const initial = getInitialState();
  const [currentRoute, setCurrentRoute] = useState<"home" | "category" | "admin">(initial.route);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(initial.categorySlug);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState<string>("");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "";

      if (hash === "#admin") {
        setCurrentRoute("admin");
        setActiveCategorySlug(null);
        if (!isAdminAuthenticated) {
          setIsLoginModalOpen(true);
        }
      } else if (hash.startsWith("#category/")) {
        const slug = hash.replace("#category/", "").trim();
        setCurrentRoute("category");
        setActiveCategorySlug(slug);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash.startsWith("#stay/")) {
        const slug = hash.replace("#stay/", "").trim();
        setCurrentRoute("category");
        setActiveCategorySlug(slug);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setCurrentRoute("home");
        setActiveCategorySlug(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
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

  // Route 2: Standalone Resort Category Dynamic Page (SS1 - SS8)
  if (currentRoute === "category" && activeCategorySlug) {
    return (
      <CategoryDetailPage
        slug={activeCategorySlug}
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
