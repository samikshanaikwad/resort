import React from "react";
import { Phone, Mail, Instagram } from "lucide-react";
import { PLACEHOLDERS } from "../config/placeholders";

interface FooterProps {
  onOpenEnquiry?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="w-full bg-[#1F1511] font-['Montserrat',sans-serif] text-white border-t border-white/10">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start pb-8">
          
          {/* Quick Links Column */}
          <div className="space-y-3">
            <h3 className="text-[#FF5722] font-bold text-xs tracking-wider uppercase">
              QUICK LINKS
            </h3>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="#home" className="hover:text-[#FF5722] transition-colors py-1 inline-block">• Home</a></li>
              <li><a href="#stays" className="hover:text-[#FF5722] transition-colors py-1 inline-block">• Stays & Resorts</a></li>
              <li><a href="#activities" className="hover:text-[#FF5722] transition-colors py-1 inline-block">• Things To Do</a></li>
              <li><a href="#spots" className="hover:text-[#FF5722] transition-colors py-1 inline-block">• Places To Visit</a></li>
              <li><a href="#why-us" className="hover:text-[#FF5722] transition-colors py-1 inline-block">• Why Book With Us</a></li>
              <li><a href="#admin" className="hover:text-[#FF5722] transition-colors py-1 inline-block">• Admin Management Portal</a></li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-[#FF5722] font-bold text-xs tracking-wider uppercase mb-1">
                <Phone className="w-4 h-4" />
                <span>CALL US</span>
              </div>
              <a 
                href={`tel:${(PLACEHOLDERS.PLACEHOLDER_FOOTER_PHONE || "+91 8123715275").replace(/\s+/g, "")}`}
                className="text-white font-bold text-lg hover:text-[#FF5722] transition-colors inline-block"
              >
                {PLACEHOLDERS.PLACEHOLDER_FOOTER_PHONE || "+91 8123715275"}
              </a>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#FF5722] font-bold text-xs tracking-wider uppercase mb-1">
                <Mail className="w-4 h-4" />
                <span>EMAIL US</span>
              </div>
              <a 
                href={`mailto:${PLACEHOLDERS.PLACEHOLDER_FOOTER_EMAIL || "dandelistaybooking@gmail.com"}`} 
                className="text-sm text-gray-200 hover:text-white transition-colors break-all"
              >
                {PLACEHOLDERS.PLACEHOLDER_FOOTER_EMAIL || "dandelistaybooking@gmail.com"}
              </a>
            </div>
          </div>

          {/* Brand & Socials Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg width={38} height={38} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="42" fill="#EAEFEA" />
                <circle cx="50" cy="50" r="32" fill="#C85A17" opacity="0.15" />
                <path d="M10 75 C 30 70, 70 75, 90 70 C 80 80, 20 80, 10 75 Z" fill="#3D2314" />
                <path d="M 28 73 C 32 62, 38 52, 42 46 C 45 42, 48 40, 52 42 C 55 43, 58 48, 60 52 C 63 58, 66 65, 72 71 C 74 73, 76 74, 78 72 C 80 70, 77 65, 75 60 C 72 52, 68 45, 62 38 C 56 32, 48 30, 42 33 C 38 35, 34 32, 31 28 C 28 24, 25 21, 22 25 C 19 29, 21 34, 24 38 C 26 42, 28 46, 27 51 C 26 56, 22 62, 18 68 C 16 71, 14 74, 18 75 C 22 76, 25 75, 28 73 Z" fill="#3D2314" />
                <circle cx="28" cy="30" r="1.5" fill="#FF5A00" />
                <path d="M 72 71 C 78 76, 85 78, 88 74 C 91 70, 86 64, 82 66" stroke="#3D2314" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </svg>
              <div>
                <h2 className="font-extrabold text-lg tracking-tight text-white leading-none">DANDELI</h2>
                <p className="text-[10px] text-[#FF5722] font-bold tracking-widest uppercase mt-1">STAY BOOKING</p>
              </div>
            </div>

            <p className="text-gray-300 text-xs leading-relaxed">
              Handpicked jungle resorts, riverfront chalets, and safari adventures in Dandeli with verified ratings, instant permit bookings, and all-inclusive meals.
            </p>

            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                CONNECT ON SOCIALS
              </p>
              <div className="flex items-center gap-2.5">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF5722] flex items-center justify-center text-white transition-colors min-w-[40px] min-h-[40px]"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href={`mailto:${PLACEHOLDERS.PLACEHOLDER_FOOTER_EMAIL || "dandelistaybooking@gmail.com"}`} 
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF5722] flex items-center justify-center text-white transition-colors min-w-[40px] min-h-[40px]"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Centered Copyright Text with Top Border */}
        <div className="pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400 font-mono tracking-wider">
            © 2026 DANDELI. ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;



