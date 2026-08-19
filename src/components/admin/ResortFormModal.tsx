import React, { useState, useEffect } from "react";
import { 
  X, 
  Upload, 
  Check, 
  Image as ImageIcon, 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  ListChecks, 
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  FileText,
  AlertCircle
} from "lucide-react";
import { Resort, ResortFormData, PackageTier, HighlightAmenity } from "../../types/resort";
import { uploadResortImage } from "../../lib/supabaseClient";
import { PLACEHOLDERS } from "../../config/placeholders";

interface ResortFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ResortFormData) => Promise<void>;
  initialData?: Resort | null;
}

const DEFAULT_CATEGORIES = [
  "Riverside Resort",
  "Jungle Cottage",
  "Canopy Treehouse",
  "Tent Camping",
  "Homestay",
  "Eco-Lodge",
];

// Helper: Safely converts packages array into formatted multi-line human-readable string
export function packagesToFormattedText(pkgs: any[]): string {
  if (!Array.isArray(pkgs)) return "";
  return pkgs
    .map((p, idx) => {
      if (!p) return "";
      if (typeof p === "string") {
        // Prevent [object Object] if string was corrupted
        if (p.includes("[object Object]")) return `Standard Package ${idx + 1} | ₹1,300 / head | 2-4 GUESTS | Includes meals & activities`;
        return p;
      }
      if (typeof p === "object") {
        const name = p.name || `Package Tier ${idx + 1}`;
        const price = p.price_per_person || "₹1,300 / head";
        const capacity = p.capacity_badge || "2-4 GUESTS";
        const desc = p.description || "Includes accommodation and standard buffet meals.";
        return `${name} | ${price} | ${capacity} | ${desc}`;
      }
      return `Package ${idx + 1} | ₹1,300 / head | 2-4 GUESTS`;
    })
    .filter(Boolean)
    .join("\n");
}

// Helper: Safely parses multi-line text into structured PackageTier array
export function formattedTextToPackages(text: string): PackageTier[] {
  if (!text || !text.trim()) return [];
  return text
    .split("\n")
    .map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.includes("[object Object]")) return null;
      const parts = trimmed.split("|").map((p) => p.trim());
      return {
        id: `pkg-${idx + 1}-${Date.now()}`,
        name: parts[0] || `Package Tier ${idx + 1}`,
        price_per_person: parts[1] || "₹1,300 / head",
        capacity_badge: parts[2] || "2-4 GUESTS",
        description: parts[3] || "Includes accommodation and all buffet meals.",
      };
    })
    .filter((p): p is PackageTier => p !== null);
}

export const ResortFormModal: React.FC<ResortFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  // Navigation / View Tabs
  const [activeTab, setActiveTab] = useState<"parameters" | "packages" | "gallery" | "highlights">("parameters");

  // 1. RESORT CATEGORY NAME / TITLE
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Riverside Resort");

  // 2. PRICE PER NIGHT (₹)
  const [pricePerNight, setPricePerNight] = useState("₹2,500 / person");
  const [packageBadge, setPackageBadge] = useState("FROM 1 Night Package ₹1,300/-");

  // 3. SHORT CARD DESCRIPTION
  const [shortDescription, setShortDescription] = useState("");

  // 4. COVER IMAGE URL / UPLOAD
  const [imageUrl, setImageUrl] = useState("");

  // 5. ROOM PACKAGES / TIERS (FIX [object Object] DISPLAY ISSUE)
  const [packages, setPackages] = useState<PackageTier[]>([]);
  const [packagesText, setPackagesText] = useState("");
  const [packageEditorMode, setPackageEditorMode] = useState<"structured" | "text">("structured");

  // 6. INCLUSIONS (ONE ITEM PER LINE)
  const [inclusionsText, setInclusionsText] = useState("");

  // 7. RESORT GALLERY MANAGER
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  // 8. DETAILED OVERVIEW LONG TEXT (STANDALONE PAGE DESCRIPTION)
  const [fullDescription, setFullDescription] = useState("");

  // 9. CHECK-IN TIME & CHECK-OUT TIME
  const [checkInTime, setCheckInTime] = useState("11:00 AM");
  const [checkOutTime, setCheckOutTime] = useState("10:00 AM");

  // 10. RESORT CONTACT PHONE NUMBER
  const [contactPhone, setContactPhone] = useState("+91 8123715275");

  // Additional settings
  const [isFeatured, setIsFeatured] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [exploreImageUrl, setExploreImageUrl] = useState("");
  const [highlightAmenities, setHighlightAmenities] = useState<HighlightAmenity[]>([]);

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSlug(initialData.slug || "");
      setCategory(initialData.category || "Riverside Resort");
      setPricePerNight(initialData.price_per_night || "₹2,500 / person");
      setPackageBadge(initialData.package_badge || `FROM 1 Night Package ${initialData.price_per_night || "₹1,300/-"}`);
      setShortDescription(initialData.short_description || "");
      setFullDescription(initialData.full_description || initialData.short_description || "");
      setImageUrl(initialData.image_url || "");
      setExploreImageUrl(initialData.explore_image_url || initialData.image_url || "");
      setCheckInTime(initialData.check_in_time || "11:00 AM");
      setCheckOutTime(initialData.check_out_time || "10:00 AM");
      setContactPhone(initialData.contact_phone || PLACEHOLDERS.PLACEHOLDER_NAV_PHONE);
      setIsFeatured(initialData.is_featured ?? true);
      setIsActive(initialData.is_active ?? true);

      // Inclusions
      const included = initialData.whats_included && initialData.whats_included.length > 0
        ? initialData.whats_included
        : [
            "3 Unlimited Buffet Meals (Breakfast, Lunch & Dinner)",
            "4 Water Adventure Activities (Kayaking, Boating, Zorbing, River Jacuzzi)",
            "Evening Campfire with Live Music",
            "Guided Morning Nature Walk & Bird Watching",
            "Swimming Pool & Outdoor Lawn Game Access",
            "Free High-Speed Wi-Fi & Reserved Parking"
          ];
      setInclusionsText(included.join("\n"));

      // Packages
      const pkgs: PackageTier[] = initialData.packages && initialData.packages.length > 0
        ? initialData.packages
        : [
            {
              id: "pkg-1",
              name: "Standard Cottage Stay",
              price_per_person: initialData.price_per_night || "₹1,300 / head",
              capacity_badge: "Min 2 - Max 4 Guests",
              description: "Ensuite room with garden patio and all buffet meals included.",
            },
            {
              id: "pkg-2",
              name: "Deluxe Riverview Chalet",
              price_per_person: "₹2,200 / head",
              capacity_badge: "Min 2 - Max 4 Guests",
              description: "Air-conditioned wooden chalet with scenic river view windows.",
            }
          ];
      setPackages(pkgs);
      setPackagesText(packagesToFormattedText(pkgs));

      // Highlights
      setHighlightAmenities(
        initialData.highlight_amenities && initialData.highlight_amenities.length > 0
          ? initialData.highlight_amenities
          : [
              { title: "Riverfront View", description: "Uninterrupted vistas of Kali River.", icon: "waves" },
              { title: "Water Sports", description: "River kayaking & water games.", icon: "compass" },
              { title: "Sunset Deck", description: "Open-air wooden viewing deck.", icon: "sunset" },
              { title: "Jungle Surroundings", description: "Enclosed by teak canopies.", icon: "trees" },
            ]
      );

      // Gallery
      setGalleryImages(
        initialData.gallery_images && initialData.gallery_images.length > 0
          ? initialData.gallery_images
          : [initialData.image_url]
      );
    } else {
      // Defaults for new resort
      setTitle("");
      setSlug("");
      setCategory("Riverside Resort");
      setPricePerNight("₹2,500 / person");
      setPackageBadge("FROM 1 Night Package ₹1,300/-");
      setShortDescription("");
      setFullDescription("");
      setImageUrl("https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80");
      setExploreImageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80");
      setCheckInTime("11:00 AM");
      setCheckOutTime("10:00 AM");
      setContactPhone("+91 8123715275");
      setIsFeatured(true);
      setIsActive(true);

      const defaultInclusions = [
        "3 Unlimited Buffet Meals (Breakfast, Lunch & Dinner)",
        "4 Water Adventure Activities (Kayaking, Boating, Zorbing, River Jacuzzi)",
        "Evening Campfire with Live Music",
        "Guided Morning Nature Walk & Bird Watching",
        "Swimming Pool & Outdoor Lawn Game Access",
        "Free High-Speed Wi-Fi & Reserved Parking"
      ];
      setInclusionsText(defaultInclusions.join("\n"));

      const defaultPkgs: PackageTier[] = [
        {
          id: "pkg-1",
          name: "Standard Cottage Stay",
          price_per_person: "₹1,300 / head",
          capacity_badge: "Min 2 - Max 4 Guests",
          description: "Ensuite room with garden patio and all standard buffet meals included.",
        },
        {
          id: "pkg-2",
          name: "Deluxe AC Glass Chalet",
          price_per_person: "₹2,200 / head",
          capacity_badge: "Min 2 - Max 4 Guests",
          description: "Air-conditioned wooden chalet with panoramic scenic river views.",
        }
      ];
      setPackages(defaultPkgs);
      setPackagesText(packagesToFormattedText(defaultPkgs));

      setHighlightAmenities([
        { title: "Riverfront View", description: "Uninterrupted vistas of Kali River.", icon: "waves" },
        { title: "Water Sports", description: "River kayaking & water games.", icon: "compass" },
        { title: "Sunset Deck", description: "Open-air wooden viewing deck.", icon: "sunset" },
        { title: "Jungle Surroundings", description: "Enclosed by teak canopies.", icon: "trees" },
      ]);

      setGalleryImages([
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80"
      ]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Single Image Upload (Cover & Explore)
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus("Compressing to WebP (<250KB) and uploading to Supabase...");

    try {
      const file = files[0];
      const uploadedUrl = await uploadResortImage(file);
      setImageUrl(uploadedUrl);
      if (!galleryImages.includes(uploadedUrl)) {
        setGalleryImages([uploadedUrl, ...galleryImages]);
      }
      setUploadStatus("Cover image uploaded successfully!");
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setUploadStatus("Upload error, please try again");
    } finally {
      setIsUploading(false);
    }
  };

  // Gallery Multi-Image Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus(`Compressing & uploading ${files.length} images...`);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const uploadedUrl = await uploadResortImage(files[i]);
        newUrls.push(uploadedUrl);
      }
      setGalleryImages(prev => [...prev, ...newUrls]);
      setUploadStatus("Gallery images uploaded successfully!");
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setUploadStatus("Gallery upload error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setGalleryImages(prev => [...prev, newGalleryUrl.trim()]);
    setNewGalleryUrl("");
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  const handleSetAsCover = (url: string) => {
    setImageUrl(url);
  };

  // Package Tier Structured Handlers
  const handleAddPackageTier = () => {
    const newPkg: PackageTier = {
      id: `pkg-${Date.now()}`,
      name: "Luxury Riverfront Suite",
      price_per_person: "₹3,500 / head",
      capacity_badge: "Min 2 - Max 5 Guests",
      description: "Premium king suite with river balcony, jacuzzi, and butler service.",
    };
    const updated = [...packages, newPkg];
    setPackages(updated);
    setPackagesText(packagesToFormattedText(updated));
  };

  const handleUpdatePackage = (index: number, field: keyof PackageTier, value: string) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [field]: value };
    setPackages(updated);
    setPackagesText(packagesToFormattedText(updated));
  };

  const handleRemovePackage = (index: number) => {
    const updated = packages.filter((_, i) => i !== index);
    setPackages(updated);
    setPackagesText(packagesToFormattedText(updated));
  };

  // Sync Text to Structured Packages
  const handlePackagesTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setPackagesText(newText);
    const parsed = formattedTextToPackages(newText);
    setPackages(parsed);
  };

  // Save / Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      // Parse Inclusions (one per line)
      const parsedInclusions = inclusionsText
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

      // Ensure packages are cleanly structured without [object Object]
      const finalPackages = packages.length > 0 ? packages : formattedTextToPackages(packagesText);

      await onSubmit({
        id: initialData?.id,
        title: title.trim(),
        slug: generatedSlug,
        category,
        price_per_night: pricePerNight.trim(),
        package_badge: packageBadge.trim(),
        check_in_time: checkInTime.trim() || "11:00 AM",
        check_out_time: checkOutTime.trim() || "10:00 AM",
        contact_phone: contactPhone.trim() || "+91 8123715275",
        short_description: shortDescription.trim() || `${title} in Dandeli.`,
        full_description: fullDescription.trim() || shortDescription.trim(),
        image_url: imageUrl || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
        explore_image_url: exploreImageUrl || imageUrl,
        amenities: highlightAmenities.map(h => h.title),
        highlight_amenities: highlightAmenities,
        packages: finalPackages,
        whats_included: parsedInclusions,
        gallery_images: galleryImages.length > 0 ? galleryImages : [imageUrl],
        is_featured: isFeatured,
        is_active: isActive,
      });

      onClose();
    } catch (err) {
      console.error("Submit error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#152C22] text-white w-full max-w-4xl rounded-3xl shadow-2xl border border-white/15 overflow-hidden my-6 max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#1A3328] shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5500]/20 border border-[#FF5500]/40 flex items-center justify-center text-[#FF5500]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-[#FF5500]/20 text-[#FF5500] px-2 py-0.5 rounded-full border border-[#FF5500]/30">
                  Supabase Live Sync
                </span>
                <h2 className="text-lg sm:text-xl font-bold font-['Montserrat',sans-serif] text-white">
                  {initialData ? "MODIFY RESORT PARAMETERS" : "ADD NEW RESORT STAY"}
                </h2>
              </div>
              <p className="text-xs text-white/65 mt-0.5">
                Manage all 10 properties synchronized live with Homepage & Category Pages (SS1 - SS8)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#11231B] px-4 sm:px-6 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("parameters")}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "parameters"
                ? "border-[#FF5500] text-[#FF5500] bg-white/5"
                : "border-transparent text-white/70 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Core Details & Timings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("packages")}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "packages"
                ? "border-[#FF5500] text-[#FF5500] bg-white/5"
                : "border-transparent text-white/70 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Packages & Inclusions ({packages.length} Tiers)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "gallery"
                ? "border-[#FF5500] text-[#FF5500] bg-white/5"
                : "border-transparent text-white/70 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>3. Gallery Manager ({galleryImages.length} Photos)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("highlights")}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "highlights"
                ? "border-[#FF5500] text-[#FF5500] bg-white/5"
                : "border-transparent text-white/70 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>4. Exploration & Badges</span>
          </button>
        </div>

        {/* Upload Status Banner */}
        {uploadStatus && (
          <div className="bg-[#FF5500]/20 border-b border-[#FF5500]/40 px-6 py-2 text-xs text-[#FF5500] flex items-center justify-between animate-pulse shrink-0">
            <span>{uploadStatus}</span>
            {isUploading && <div className="w-4 h-4 border-2 border-[#FF5500] border-t-transparent rounded-full animate-spin" />}
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 overflow-y-auto flex-1">
          
          {/* TAB 1: CORE PARAMETERS */}
          {activeTab === "parameters" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Field 1: RESORT CATEGORY NAME / TITLE */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2 flex items-center justify-between">
                  <span>1. RESORT CATEGORY NAME / TITLE *</span>
                  <span className="text-[11px] text-[#FF5500] font-normal lowercase">mapped to SS1 Hero & Navbar</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!initialData) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  placeholder="e.g., Luxury Nature & Glass Cottages"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] font-semibold"
                />
              </div>

              {/* Slug & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                    URL Slug (Standalone Route)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-white/40 text-xs">/category/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="luxury-nature-glass-cottages"
                      className="w-full bg-white/5 border border-white/20 rounded-xl pl-24 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                    Resort Type Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#1A3328] border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 2 & Field 10: PRICE PER NIGHT & CONTACT PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
                    2. PRICE PER NIGHT (₹) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    placeholder="e.g., 1800 or ₹1,800 / person"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#FF5500] font-bold text-emerald-400"
                  />
                  <span className="text-[11px] text-white/50 mt-1 block">
                    Displays on homepage card & standalone page header
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>10. RESORT CONTACT PHONE NUMBER *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g., +91 8123715275"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#FF5500] font-mono"
                  />
                  <span className="text-[11px] text-white/50 mt-1 block">
                    Updates "CONTACT NOW!" phone call button on SS2
                  </span>
                </div>
              </div>

              {/* Field 9: CHECK-IN TIME & CHECK-OUT TIME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>9. CHECK-IN TIME</span>
                  </label>
                  <input
                    type="text"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    placeholder="11:00 AM"
                    className="w-full bg-[#152C22] border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>9. CHECK-OUT TIME</span>
                  </label>
                  <input
                    type="text"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full bg-[#152C22] border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              {/* Field 3: SHORT CARD DESCRIPTION */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
                  3. SHORT CARD DESCRIPTION (HOMEPAGE CAROUSEL) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Direct Kali River access with open-air riverside swimming pool, deluxe AC chalets, and all buffet meals included."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF5500] leading-relaxed"
                />
                <span className="text-[11px] text-white/50 block">
                  Concise 1-2 sentence preview for the homepage stays slider.
                </span>
              </div>

              {/* Field 8: DETAILED OVERVIEW LONG TEXT (STANDALONE PAGE DESCRIPTION) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
                  8. DETAILED OVERVIEW LONG TEXT (STANDALONE PAGE SS2) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Immerse in nature along the banks of the roaring Kali River. This verified luxury riverside retreat offers private cottages with direct waterhole views, lush lawns, natural river rock jacuzzis, and all-inclusive gourmet buffet spreads with evening campfires under starry skies..."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF5500] leading-relaxed"
                />
                <span className="text-[11px] text-white/50 block">
                  Full rich narrative displayed under "Welcome to [Resort Name]" on the dedicated category page.
                </span>
              </div>

              {/* Field 4: COVER IMAGE URL / UPLOAD */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/90">
                  4. COVER IMAGE URL / UPLOAD (HERO BANNER & CARD) *
                </label>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-[#152C22] border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF5500] w-full"
                  />

                  <label className="bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>UPLOAD</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Thumbnail Preview */}
                {imageUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 h-40 max-w-sm">
                    <img
                      src={imageUrl}
                      alt="Cover Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm">
                      Cover Photo Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Visibility & Featured Toggles */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#FF5500] rounded focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Visible on Public Website</div>
                    <div className="text-[10px] text-white/50">Show category in homepage & menu</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#FF5500] rounded focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Featured Badge</div>
                    <div className="text-[10px] text-white/50">Highlight card with badge</div>
                  </div>
                </label>
              </div>

            </div>
          )}

          {/* TAB 2: PACKAGES & INCLUSIONS */}
          {activeTab === "packages" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Field 5: ROOM PACKAGES / TIERS (FIX [object Object] DISPLAY ISSUE) */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/15">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#FF5500]" />
                      <span>5. ROOM PACKAGES / TIERS (FIX [object Object] DISPLAY ISSUE)</span>
                    </h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      Configure room package options with pricing per head, guest capacities, and inclusions.
                    </p>
                  </div>

                  {/* Mode Toggle */}
                  <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPackageEditorMode("structured")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        packageEditorMode === "structured"
                          ? "bg-[#FF5500] text-white shadow"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      Card Builder
                    </button>
                    <button
                      type="button"
                      onClick={() => setPackageEditorMode("text")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        packageEditorMode === "text"
                          ? "bg-[#FF5500] text-white shadow"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      Formatted Text
                    </button>
                  </div>
                </div>

                {/* Structured Card Builder Mode */}
                {packageEditorMode === "structured" && (
                  <div className="space-y-4">
                    {packages.map((pkg, idx) => (
                      <div
                        key={pkg.id || idx}
                        className="bg-white/5 border border-white/15 rounded-2xl p-4 sm:p-5 space-y-4 relative group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#FF5500] uppercase tracking-wider">
                            Tier #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePackage(idx)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Remove tier"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-white/70 mb-1">
                              Package / Room Name
                            </label>
                            <input
                              type="text"
                              value={pkg.name}
                              onChange={(e) => handleUpdatePackage(idx, "name", e.target.value)}
                              placeholder="e.g., Camping Tents (2-3 Sharing)"
                              className="w-full bg-[#152C22] border border-white/20 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-[#FF5500] font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-white/70 mb-1">
                              Price Per Person / Head
                            </label>
                            <input
                              type="text"
                              value={pkg.price_per_person}
                              onChange={(e) => handleUpdatePackage(idx, "price_per_person", e.target.value)}
                              placeholder="e.g., ₹1300/-/head"
                              className="w-full bg-[#152C22] border border-white/20 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-[#FF5500] font-bold text-emerald-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase text-white/70 mb-1">
                              Capacity Badge
                            </label>
                            <input
                              type="text"
                              value={pkg.capacity_badge || ""}
                              onChange={(e) => handleUpdatePackage(idx, "capacity_badge", e.target.value)}
                              placeholder="e.g., 2-4 GUESTS"
                              className="w-full bg-[#152C22] border border-white/20 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-white/70 mb-1">
                            Package Description & Features
                          </label>
                          <input
                            type="text"
                            value={pkg.description}
                            onChange={(e) => handleUpdatePackage(idx, "description", e.target.value)}
                            placeholder="e.g., Cozy waterproof tent pitched along riverbank with foam mattresses & buffet meals."
                            className="w-full bg-[#152C22] border border-white/20 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#FF5500]"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddPackageTier}
                      className="w-full py-3 border border-dashed border-[#FF5500]/50 hover:border-[#FF5500] bg-[#FF5500]/10 hover:bg-[#FF5500]/20 text-[#FF5500] rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ ADD PACKAGE TIER</span>
                    </button>
                  </div>
                )}

                {/* Formatted Text Mode */}
                {packageEditorMode === "text" && (
                  <div className="space-y-2">
                    <label className="block text-xs text-white/70">
                      Format: <strong>Tier Name | Price/head | Capacity | Description</strong> (One package per line)
                    </label>
                    <textarea
                      rows={5}
                      value={packagesText}
                      onChange={handlePackagesTextChange}
                      placeholder="Camping Tents (2-3 Sharing) | ₹1300/-/head | 2-4 GUESTS | Cozy camping tents with mattress & bedding&#10;Deluxe Riverview Chalet | ₹2200/-/head | 2-4 GUESTS | AC wooden chalet with river view"
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-[#FF5500] leading-relaxed"
                    />
                    <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Human-readable parsing enabled. Guaranteed no [object Object] output.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Field 6: INCLUSIONS (ONE ITEM PER LINE) */}
              <div className="space-y-3 pt-6 border-t border-white/15">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-[#FF5500]" />
                    <span>6. INCLUSIONS (ONE ITEM PER LINE - WHAT'S INCLUDED) *</span>
                  </h3>
                  <span className="text-xs text-[#FF5500] font-semibold">
                    {inclusionsText.split("\n").filter(l => l.trim()).length} Items on SS4
                  </span>
                </div>

                <p className="text-xs text-white/60">
                  Each line in this textarea renders as a separate checkmark row in the "What's Included in Every Stay" box on the dedicated stay page.
                </p>

                <textarea
                  rows={6}
                  required
                  value={inclusionsText}
                  onChange={(e) => setInclusionsText(e.target.value)}
                  placeholder="3 Unlimited Buffet Meals (Breakfast, Lunch & Dinner)&#10;4 Water Adventure Activities (Kayaking, Boating, Zorbing, River Jacuzzi)&#10;Evening Campfire with Music&#10;Guided Morning Nature & Bird Watching Trail&#10;Swimming Pool & Outdoor Lawn Game Access&#10;Free High-Speed Wi-Fi & Reserved Parking"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF5500] leading-relaxed font-sans"
                />

                {/* Live Checkmark Preview */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-white/50 tracking-wider block">
                    Live Checkmark Preview (SS4):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {inclusionsText
                      .split("\n")
                      .map(l => l.trim())
                      .filter(Boolean)
                      .map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-white/90">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: GALLERY MANAGER */}
          {activeTab === "gallery" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Field 7: RESORT GALLERY MANAGER */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/15">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#FF5500]" />
                      <span>7. RESORT GALLERY MANAGER ("A Glimpse into Luxury Stays")</span>
                    </h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      Upload high-resolution property photos or paste direct image URLs. Photos are displayed on SS5.
                    </p>
                  </div>

                  <label className="bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>UPLOAD IMAGES (MULTI)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Paste URL Bar */}
                <div className="flex gap-2 my-4">
                  <input
                    type="url"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Paste image URL (https://images.unsplash.com/...)"
                    className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-[#FF5500]" />
                    <span>+ ADD URL</span>
                  </button>
                </div>

                {/* Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                  {galleryImages.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-2xl overflow-hidden border border-white/20 group aspect-4/3 bg-black/40"
                    >
                      <img
                        src={url}
                        alt={`Gallery ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Order Badge */}
                      <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-extrabold text-white">
                        #{idx + 1}
                      </div>

                      {/* Cover Tag */}
                      {url === imageUrl && (
                        <div className="absolute top-2 right-2 bg-[#FF5500] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                          COVER
                        </div>
                      )}

                      {/* Action Bar Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        {url !== imageUrl && (
                          <button
                            type="button"
                            onClick={() => handleSetAsCover(url)}
                            className="px-2.5 py-1.5 bg-white/20 hover:bg-[#FF5500] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {galleryImages.length === 0 && (
                  <div className="p-8 border border-dashed border-white/20 rounded-2xl text-center space-y-3">
                    <ImageIcon className="w-10 h-10 text-white/30 mx-auto" />
                    <p className="text-xs text-white/60">No gallery images added yet.</p>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 4: HIGHLIGHTS & EXPLORATION */}
          {activeTab === "highlights" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Exploration Image (SS3) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-white/90">
                  Exploration Feature Image (SS3 Right Column)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={exploreImageUrl}
                    onChange={(e) => setExploreImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-[#152C22] border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF5500]"
                  />
                  <label className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0">
                    <Upload className="w-4 h-4 text-[#FF5500]" />
                    <span>UPLOAD</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const url = await uploadResortImage(e.target.files[0]);
                          setExploreImageUrl(url);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 4 Highlight Amenities (SS3 2x2 Grid) */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">
                  Stay Highlights (4 Badges for SS3 Grid)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {highlightAmenities.map((ha, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/15 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#FF5500] uppercase">
                          Highlight #{idx + 1}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={ha.title}
                        onChange={(e) => {
                          const updated = [...highlightAmenities];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setHighlightAmenities(updated);
                        }}
                        placeholder="Highlight Title"
                        className="w-full bg-[#152C22] border border-white/20 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-[#FF5500]"
                      />
                      <input
                        type="text"
                        value={ha.description}
                        onChange={(e) => {
                          const updated = [...highlightAmenities];
                          updated[idx] = { ...updated[idx], description: e.target.value };
                          setHighlightAmenities(updated);
                        }}
                        placeholder="Description"
                        className="w-full bg-[#152C22] border border-white/20 rounded-xl px-3 py-2 text-white text-[11px] focus:outline-none focus:border-[#FF5500]"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </form>

        {/* Modal Sticky Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-white/10 bg-[#1A3328] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-white/60 text-center sm:text-left">
            <span>Synchronizes instantly with public website & Supabase table </span>
            <strong className="text-emerald-400">`resorts`</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              CANCEL
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-1/2 sm:w-auto px-8 py-3 rounded-xl bg-[#FF5500] hover:bg-[#e04b00] disabled:bg-white/20 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>SAVE RESORT STAY</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
