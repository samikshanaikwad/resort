import React, { useState, useEffect } from "react";
import { 
  Mail, 
  Phone, 
  Instagram, 
  ChevronDown, 
  ChevronRight,
  Menu, 
  X, 
  Sparkles,
  TreePine
} from "lucide-react";
import { PLACEHOLDERS } from "../config/placeholders";
import { fetchResorts, subscribeToResortsRealtime } from "../lib/supabaseClient";
import { Resort } from "../types/resort";

interface HeaderProps {
  onOpenEnquiry?: () => void;
  onNavigateHome?: () => void;
  onNavigateCategory?: (slug: string) => void;
  activeSection?: string;
  categories?: Resort[];
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenEnquiry,
  onNavigateHome,
  onNavigateCategory,
  activeSection,
  categories: initialCategories
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [staysDropdownOpen, setStaysDropdownOpen] = useState(false);
  const [resorts, setResorts] = useState<Resort[]>(initialCategories || []);
  const [currentPath, setCurrentPath] = useState("");
  const [currentHash, setCurrentHash] = useState("");

  // Sync current location state
  const syncLocation = () => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname || "");
      setCurrentHash(window.location.hash || "");
    }
  };

  // Load active resort categories dynamically
  const loadCategories = async () => {
    if (initialCategories && initialCategories.length > 0) {
      setResorts(initialCategories.filter(r => r.is_active));
      return;
    }
    const data = await fetchResorts();
    setResorts(data.filter(r => r.is_active));
  };

  useEffect(() => {
    syncLocation();
    loadCategories();

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    const handleLocationChange = () => {
      syncLocation();
    };
    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);

    const handleLocalUpdate = () => {
      loadCategories();
    };
    window.addEventListener("dandeli_resorts_updated", handleLocalUpdate);

    const unsubscribe = subscribeToResortsRealtime(() => {
      loadCategories();
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("dandeli_resorts_updated", handleLocalUpdate);
      unsubscribe();
    };
  }, [initialCategories]);

  // Dynamic active tab detection logic
  const isStaysActive = Boolean(
    activeSection === "stays" ||
    currentPath.includes("/stays") ||
    currentPath.includes("/category") ||
    currentPath.includes("/resorts") ||
    currentHash.startsWith("#category/") ||
    currentHash.startsWith("#stay/") ||
    currentHash === "#stays"
  );

  const isActivitiesActive = Boolean(
    activeSection === "activities" ||
    activeSection === "things-to-do" ||
    currentHash === "#activities" ||
    currentHash === "#things-to-do"
  );

  const isSpotsActive = Boolean(
    activeSection === "spots" ||
    activeSection === "places" ||
    currentHash === "#spots" ||
    currentHash === "#places"
  );

  const isWhyUsActive = Boolean(
    activeSection === "why-us" ||
    currentHash === "#why-us"
  );

  const isHomeActive = Boolean(
    (activeSection === "home" ||
      currentPath === "/" ||
      currentPath === "" ||
      currentHash === "" ||
      currentHash === "#" ||
      currentHash === "#home") &&
    !isStaysActive &&
    !isActivitiesActive &&
    !isSpotsActive &&
    !isWhyUsActive
  );

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setStaysDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.hash = "home";
    }
  };

  const handleCategoryClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    setStaysDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onNavigateCategory) {
      onNavigateCategory(slug);
    } else {
      window.location.hash = `#category/${slug}`;
    }
  };

  const handleNavLinkClick = (e: React.MouseEvent, href: string) => {
    setMobileMenuOpen(false);
    if (href === "#home") {
      e.preventDefault();
      if (onNavigateHome) {
        onNavigateHome();
      } else {
        window.location.hash = "home";
      }
    }
  };

  return (
    <header 
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out border-none ${
        isScrolled 
          ? "bg-[#1F1511] text-white shadow-lg" 
          : "bg-gradient-to-b from-[#1F1511]/90 via-[#1F1511]/60 to-transparent text-white"
      }`}
    >
      {/* Top Utility Contact Bar - Hidden on ultra-small screens or styled compactly */}
      <div 
        id="top-utility-bar"
        className={`w-full text-white text-xs px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out border-none ${
          isScrolled ? "pt-1.5 pb-0.5" : "pt-2.5 pb-1"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Left: Email + Phone with Orange Icons */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            <a 
              href={`mailto:${PLACEHOLDERS.PLACEHOLDER_NAV_EMAIL}`}
              className="flex items-center gap-1.5 hover:text-[#FF5722] text-white/90 drop-shadow transition-colors min-h-[32px]"
            >
              <Mail className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
              <span className="font-medium text-[11px] sm:text-xs truncate max-w-[200px] sm:max-w-none">
                {PLACEHOLDERS.PLACEHOLDER_NAV_EMAIL}
              </span>
            </a>
            <a 
              href={`tel:${PLACEHOLDERS.PLACEHOLDER_NAV_PHONE}`}
              className="flex items-center gap-1.5 hover:text-[#FF5722] text-white/90 drop-shadow transition-colors min-h-[32px]"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
              <span className="font-medium text-[11px] sm:text-xs">
                {PLACEHOLDERS.PLACEHOLDER_NAV_PHONE}
              </span>
            </a>
          </div>

          {/* Right: Quick Action Social / Direct Contact Icons */}
          <div className="hidden xs:flex items-center gap-2 sm:gap-3">
            <a 
              href={`mailto:${PLACEHOLDERS.PLACEHOLDER_NAV_EMAIL}`}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-[#FF5722] text-white flex items-center justify-center transition-all shadow-sm"
              aria-label="Email link"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-[#FF5722] text-white flex items-center justify-center transition-all shadow-sm"
              aria-label="Instagram link"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        id="main-navigation-bar"
        className="w-full py-2 sm:py-3 transition-all duration-300 border-none"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo Component */}
          <a 
            href="#home" 
            onClick={handleLogoClick}
            className="shrink-0 group cursor-pointer py-1" 
            id="brand-logo-link"
          >
            <div className="flex items-center gap-2.5 sm:gap-3" id="brand-logo">
              <svg width={42} height={42} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[46px] sm:h-[46px]">
                <circle cx="50" cy="50" r="42" fill="#EAEFEA" />
                <circle cx="50" cy="50" r="32" fill="#C85A17" opacity="0.15" />
                <path d="M10 75 C 30 70, 70 75, 90 70 C 80 80, 20 80, 10 75 Z" fill="#3D2314" />
                <path d="M 28 73 C 32 62, 38 52, 42 46 C 45 42, 48 40, 52 42 C 55 43, 58 48, 60 52 C 63 58, 66 65, 72 71 C 74 73, 76 74, 78 72 C 80 70, 77 65, 75 60 C 72 52, 68 45, 62 38 C 56 32, 48 30, 42 33 C 38 35, 34 32, 31 28 C 28 24, 25 21, 22 25 C 19 29, 21 34, 24 38 C 26 42, 28 46, 27 51 C 26 56, 22 62, 18 68 C 16 71, 14 74, 18 75 C 22 76, 25 75, 28 73 Z" fill="#3D2314" />
                <circle cx="28" cy="30" r="1.5" fill="#FF5A00" />
                <path d="M 72 71 C 78 76, 85 78, 88 74 C 91 70, 86 64, 82 66" stroke="#3D2314" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </svg>
              <div>
                <span className="font-sans font-bold text-base sm:text-lg md:text-xl tracking-tight leading-none text-white block">DANDELI</span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-widest font-semibold block mt-0.5 text-[#FF5A00]">STAY BOOKING</span>
              </div>
            </div>
          </a>

          {/* Right Group: Navigation links & CTA */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Desktop Nav Links (Hidden on mobile and tablet < lg) */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-white/95">
              {/* Home Link */}
              <a 
                href="#home"
                onClick={(e) => handleNavLinkClick(e, "#home")}
                className={`relative py-2 transition-colors drop-shadow font-semibold flex flex-col items-center group min-h-[44px] justify-center ${
                  isHomeActive 
                    ? "text-white font-bold" 
                    : "text-white/80 hover:text-white"
                }`}
              >
                <span>Home</span>
                {isHomeActive && (
                  <span className="absolute bottom-0 w-full h-[2.5px] bg-[#FF5722] rounded-full" />
                )}
              </a>

              {/* Dynamic Stays & Resorts Dropdown */}
              <div 
                className="relative group py-2"
                onMouseEnter={() => setStaysDropdownOpen(true)}
                onMouseLeave={() => setStaysDropdownOpen(false)}
              >
                <button 
                  className={`relative flex items-center gap-1.5 transition-colors drop-shadow cursor-pointer focus:outline-none font-semibold min-h-[44px] ${
                    isStaysActive 
                      ? "text-[#FF5722] font-bold" 
                      : "text-white/80 hover:text-[#FF5722]"
                  }`}
                  onClick={() => setStaysDropdownOpen(!staysDropdownOpen)}
                >
                  <span>Stays & Resorts</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${staysDropdownOpen ? "rotate-180 text-[#FF5722]" : ""}`} />
                  {isStaysActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#FF5722] rounded-full" />
                  )}
                </button>

                {/* Minimal Category-Only Dropdown Menu synced dynamically with Admin state */}
                {staysDropdownOpen && (
                  <div className="absolute top-full left-0 w-72 sm:w-80 bg-[#1F1511] border border-white/10 rounded-2xl shadow-2xl p-2 mt-1 space-y-1 animate-fadeIn backdrop-blur-xl z-50">
                    {resorts.map((resortItem) => (
                      <a 
                        key={resortItem.id} 
                        href={`#category/${resortItem.slug}`}
                        onClick={(e) => handleCategoryClick(e, resortItem.slug)}
                        className="flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-white/5 text-white/90 hover:text-white transition-all group cursor-pointer min-h-[44px]"
                      >
                        <span className="font-semibold text-xs sm:text-sm text-white/90 group-hover:text-[#FF5722] transition-colors leading-snug">
                          {resortItem.title}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#FF5722] opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Things To Do */}
              <a 
                href="#activities"
                className={`relative py-2 transition-colors drop-shadow font-semibold flex flex-col items-center group min-h-[44px] justify-center ${
                  isActivitiesActive 
                    ? "text-white font-bold" 
                    : "text-white/80 hover:text-white"
                }`}
              >
                <span>Things To Do</span>
                {isActivitiesActive && (
                  <span className="absolute bottom-0 w-full h-[2.5px] bg-[#FF5722] rounded-full" />
                )}
              </a>

              {/* Places To Visit */}
              <a 
                href="#spots"
                className={`relative py-2 transition-colors drop-shadow font-semibold flex flex-col items-center group min-h-[44px] justify-center ${
                  isSpotsActive 
                    ? "text-white font-bold" 
                    : "text-white/80 hover:text-white"
                }`}
              >
                <span>Places To Visit</span>
                {isSpotsActive && (
                  <span className="absolute bottom-0 w-full h-[2.5px] bg-[#FF5722] rounded-full" />
                )}
              </a>

              {/* Why Book With Us */}
              <a 
                href="#why-us"
                className={`relative py-2 transition-colors drop-shadow font-semibold flex flex-col items-center group min-h-[44px] justify-center ${
                  isWhyUsActive 
                    ? "text-white font-bold" 
                    : "text-white/80 hover:text-white"
                }`}
              >
                <span>Why Book With Us</span>
                {isWhyUsActive && (
                  <span className="absolute bottom-0 w-full h-[2.5px] bg-[#FF5722] rounded-full" />
                )}
              </a>
            </div>

            {/* CTA Button: Solid Orange #FF5722 with Enquire Now */}
            <button
              id="header-cta-btn"
              onClick={onOpenEnquiry}
              className="bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs sm:text-sm font-bold tracking-wide px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-orange-500/40 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap min-h-[44px]"
            >
              <span>Enquire Now</span>
            </button>

            {/* Mobile / Tablet Hamburger Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-white hover:text-[#FF5722] rounded-xl hover:bg-white/10 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Slide-Over Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Backdrop Overlay */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-over Drawer Panel */}
            <div 
              className="relative w-[85%] max-w-sm h-full bg-[#1F1511] text-white shadow-2xl border-l border-white/10 flex flex-col justify-between overflow-y-auto z-10 animate-fadeIn"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
            >
              {/* Drawer Top Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#19110e]">
                <div className="flex items-center gap-2.5">
                  <svg width={36} height={36} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="42" fill="#EAEFEA" />
                    <circle cx="50" cy="50" r="32" fill="#C85A17" opacity="0.15" />
                    <path d="M10 75 C 30 70, 70 75, 90 70 C 80 80, 20 80, 10 75 Z" fill="#3D2314" />
                    <path d="M 28 73 C 32 62, 38 52, 42 46 C 45 42, 48 40, 52 42 C 55 43, 58 48, 60 52 C 63 58, 66 65, 72 71 C 74 73, 76 74, 78 72 C 80 70, 77 65, 75 60 C 72 52, 68 45, 62 38 C 56 32, 48 30, 42 33 C 38 35, 34 32, 31 28 C 28 24, 25 21, 22 25 C 19 29, 21 34, 24 38 C 26 42, 28 46, 27 51 C 26 56, 22 62, 18 68 C 16 71, 14 74, 18 75 C 22 76, 25 75, 28 73 Z" fill="#3D2314" />
                    <circle cx="28" cy="30" r="1.5" fill="#FF5A00" />
                    <path d="M 72 71 C 78 76, 85 78, 88 74 C 91 70, 86 64, 82 66" stroke="#3D2314" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  </svg>
                  <div>
                    <span className="font-sans font-bold text-base tracking-tight leading-none text-white block">DANDELI</span>
                    <span className="font-mono text-[9px] tracking-widest font-semibold block text-[#FF5A00]">STAY BOOKING</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#FF5722] text-white flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 px-5 py-4 space-y-4 overflow-y-auto">
                {/* Home */}
                <a
                  href="#home"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavLinkClick(e, "#home");
                  }}
                  className={`flex items-center justify-between py-3 px-3 rounded-xl transition-colors min-h-[44px] ${
                    isHomeActive 
                      ? "bg-[#FF5722]/15 text-[#FF5722] font-bold" 
                      : "text-white hover:bg-white/5 font-medium"
                  }`}
                >
                  <span className="text-base">Home</span>
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </a>

                {/* Stays & Resorts with Dynamic Subcategories */}
                <div className="rounded-2xl bg-white/5 p-3 space-y-2 border border-white/5">
                  <div className="flex items-center justify-between px-1 py-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF5722]">
                      Stays & Resorts
                    </span>
                    <span className="text-[11px] text-white/50 font-medium">
                      {resorts.length} Categories
                    </span>
                  </div>
                  <div className="space-y-1">
                    {resorts.map((resortItem) => (
                      <a
                        key={resortItem.id}
                        href={`#category/${resortItem.slug}`}
                        onClick={(e) => handleCategoryClick(e, resortItem.slug)}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/10 text-xs sm:text-sm text-white/90 hover:text-[#FF5722] transition-colors group min-h-[44px]"
                      >
                        <span className="font-medium leading-snug">{resortItem.title}</span>
                        <ChevronRight className="w-4 h-4 text-[#FF5722] group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Things To Do */}
                <a
                  href="#activities"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-3 rounded-xl transition-colors min-h-[44px] ${
                    isActivitiesActive 
                      ? "bg-[#FF5722]/15 text-[#FF5722] font-bold" 
                      : "text-white hover:bg-white/5 font-medium"
                  }`}
                >
                  <span className="text-base">Things To Do</span>
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </a>

                {/* Places To Visit */}
                <a
                  href="#spots"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-3 rounded-xl transition-colors min-h-[44px] ${
                    isSpotsActive 
                      ? "bg-[#FF5722]/15 text-[#FF5722] font-bold" 
                      : "text-white hover:bg-white/5 font-medium"
                  }`}
                >
                  <span className="text-base">Places To Visit</span>
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </a>

                {/* Why Book With Us */}
                <a
                  href="#why-us"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-3 rounded-xl transition-colors min-h-[44px] ${
                    isWhyUsActive 
                      ? "bg-[#FF5722]/15 text-[#FF5722] font-bold" 
                      : "text-white hover:bg-white/5 font-medium"
                  }`}
                >
                  <span className="text-base">Why Book With Us</span>
                  <ChevronRight className="w-4 h-4 text-white/50" />
                </a>
              </div>

              {/* Drawer Bottom Actions & Contact Info */}
              <div className="p-5 border-t border-white/10 space-y-4 bg-[#19110e]">
                {/* Contact Info */}
                <div className="space-y-2 text-xs text-white/80">
                  <a 
                    href={`tel:${PLACEHOLDERS.PLACEHOLDER_NAV_PHONE}`}
                    className="flex items-center gap-2.5 py-1.5 hover:text-[#FF5722] transition-colors min-h-[38px]"
                  >
                    <Phone className="w-4 h-4 text-[#FF5722] shrink-0" />
                    <span>{PLACEHOLDERS.PLACEHOLDER_NAV_PHONE}</span>
                  </a>
                  <a 
                    href={`mailto:${PLACEHOLDERS.PLACEHOLDER_NAV_EMAIL}`}
                    className="flex items-center gap-2.5 py-1.5 hover:text-[#FF5722] transition-colors min-h-[38px]"
                  >
                    <Mail className="w-4 h-4 text-[#FF5722] shrink-0" />
                    <span className="truncate">{PLACEHOLDERS.PLACEHOLDER_NAV_EMAIL}</span>
                  </a>
                </div>

                {/* Enquire CTA Button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenEnquiry) onOpenEnquiry();
                  }}
                  className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-3.5 px-4 rounded-xl text-center shadow-lg active:scale-98 transition-all min-h-[48px] flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                >
                  <span>Enquire Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export { Header as Navbar };
export default Header;

