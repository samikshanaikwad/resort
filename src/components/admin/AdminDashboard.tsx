import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Database,
  RefreshCw,
  Phone,
  MessageCircle,
  ExternalLink,
  Layers
} from "lucide-react";
import { Resort, ResortFormData } from "../../types/resort";
import { 
  fetchResorts, 
  createResort, 
  updateResort, 
  deleteResort, 
  toggleResortStatus,
  isSupabaseConfigured,
  subscribeToResortsRealtime,
} from "../../lib/supabaseClient";
import { PLACEHOLDERS } from "../../config/placeholders";
import { ResortFormModal } from "./ResortFormModal";

interface AdminDashboardProps {
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingResort, setEditingResort] = useState<Resort | null>(null);

  // Notification Banner
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const loadResorts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchResorts();
      setResorts(data);
    } catch (err) {
      showNotification("Failed to fetch stays from Supabase database", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResorts();

    // 1. Listen for local window events
    const handleLocalUpdate = () => {
      loadResorts();
    };
    window.addEventListener("dandeli_resorts_updated", handleLocalUpdate);

    // 2. Subscribe to live Supabase Realtime changes across all connected devices
    const unsubscribe = subscribeToResortsRealtime(() => {
      loadResorts();
    });

    return () => {
      window.removeEventListener("dandeli_resorts_updated", handleLocalUpdate);
      unsubscribe();
    };
  }, []);

  const showNotification = (msg: string, type: "success" | "error" = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleOpenAdd = () => {
    setEditingResort(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (resort: Resort) => {
    setEditingResort(resort);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: ResortFormData) => {
    try {
      if (editingResort) {
        await updateResort(editingResort.id, formData);
        showNotification(`Updated category "${formData.title}" successfully & synced live!`);
      } else {
        await createResort(formData);
        showNotification(`Created and published category "${formData.title}"!`);
      }
      await loadResorts();
    } catch (err) {
      showNotification("Failed to save resort category details", "error");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      try {
        await deleteResort(id);
        showNotification(`Deleted category "${title}"`);
        await loadResorts();
      } catch (err) {
        showNotification("Failed to delete resort", "error");
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean, title: string) => {
    try {
      const nextStatus = !currentStatus;
      await toggleResortStatus(id, nextStatus);
      showNotification(
        `Category "${title}" is now ${nextStatus ? "VISIBLE (Active)" : "HIDDEN (Draft)"} on public site`
      );
      await loadResorts();
    } catch (err) {
      showNotification("Failed to update status", "error");
    }
  };

  const handlePreviewCategoryPage = (slug: string) => {
    window.location.hash = `#category/${slug}`;
  };

  // Filtered List
  const filteredResorts = resorts.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.short_description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || r.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categoriesList = Array.from(new Set(resorts.map((r) => r.category)));
  const totalActive = resorts.filter((r) => r.is_active).length;

  return (
    <div className="min-h-screen bg-[#0E1D16] text-[#EFF3EE] font-sans antialiased pb-20 selection:bg-[#FF5500] selection:text-white">
      
      {/* Top Admin Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#152C22] border-b border-white/10 shadow-xl px-4 sm:px-8 py-3.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onExit}
              className="flex items-center gap-2 bg-white/10 hover:bg-[#FF5500] text-white text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-sm group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Website</span>
            </button>

            <div className="h-6 w-px bg-white/15 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FF5500]" />
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-['Montserrat',sans-serif]">
                  Admin Management Portal
                </h1>
              </div>
              <span className="text-[11px] text-white/60 block">
                Category Pages & Inventory Management Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadResorts}
              disabled={isLoading}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
              title="Refresh from Database"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#FF5500]" : ""}`} />
            </button>

            <button
              id="admin-add-resort-btn"
              onClick={handleOpenAdd}
              className="bg-[#FF5500] hover:bg-[#e04b00] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-lg hover:shadow-orange-500/30 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>ADD RESORT / STAY</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification Toast */}
      {notification && (
        <div
          className={`fixed top-20 right-4 sm:right-8 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold border transition-all animate-bounce ${
            notification.type === "success"
              ? "bg-emerald-950 text-emerald-100 border-emerald-500/40"
              : "bg-rose-950 text-rose-100 border-rose-500/40"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#152C22] p-5 rounded-2xl border border-white/10 shadow-md">
            <span className="text-white/60 text-xs font-bold uppercase tracking-wider block">Total Categories</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Montserrat',sans-serif]">
              {resorts.length}
            </div>
            <span className="text-[11px] text-white/50 block">Managed Stays</span>
          </div>

          <div className="bg-[#152C22] p-5 rounded-2xl border border-white/10 shadow-md">
            <span className="text-white/60 text-xs font-bold uppercase tracking-wider block">Live Online</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 font-['Montserrat',sans-serif]">
              {totalActive}
            </div>
            <span className="text-[11px] text-white/50 block">Visible to guests</span>
          </div>

          <div className="bg-[#152C22] p-5 rounded-2xl border border-white/10 shadow-md">
            <span className="text-white/60 text-xs font-bold uppercase tracking-wider block flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Primary WhatsApp</span>
            </span>
            <div className="text-lg sm:text-xl font-bold text-white mt-2 font-mono">
              {PLACEHOLDERS.PLACEHOLDER_PHONE}
            </div>
            <span className="text-[11px] text-white/50 block">Direct booking line</span>
          </div>

          <div className="bg-[#152C22] p-5 rounded-2xl border border-white/10 shadow-md">
            <span className="text-white/60 text-xs font-bold uppercase tracking-wider block flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Support Phone</span>
            </span>
            <div className="text-lg sm:text-xl font-bold text-white mt-2 font-mono">
              {PLACEHOLDERS.PLACEHOLDER_NAV_PHONE}
            </div>
            <span className="text-[11px] text-white/50 block">Concierge helpline</span>
          </div>
        </div>

        {/* Database Status Alert Banner */}
        {!isSupabaseConfigured && (
          <div className="bg-amber-500/15 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Using Local Fast-Sync Storage:</strong> Real-time cross-device updates and local changes are actively running. Connected with live fallback seed data!
              </span>
            </div>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="bg-[#152C22] p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stays by title, category, or desc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/15 focus:border-[#FF5500] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/30 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === "all"
                  ? "bg-[#FF5500] text-white"
                  : "bg-white/10 text-white/70 hover:text-white"
              }`}
            >
              All Categories ({resorts.length})
            </button>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? "bg-[#FF5500] text-white"
                    : "bg-white/10 text-white/70 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resorts Management Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResorts.map((resort) => (
            <div
              key={resort.id}
              className={`bg-[#152C22] rounded-3xl overflow-hidden border transition-all duration-200 shadow-xl flex flex-col justify-between ${
                resort.is_active
                  ? "border-white/15 hover:border-[#FF5500]/50"
                  : "border-rose-900/40 opacity-70"
              }`}
            >
              {/* Card Top Image & Category Tag */}
              <div className="relative h-48 w-full bg-black/40 overflow-hidden">
                <img
                  src={resort.image_url}
                  alt={resort.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#152C22] via-transparent to-black/40" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/15">
                    {resort.category}
                  </span>
                  {resort.is_featured && (
                    <span className="bg-[#FF5500] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
                      FEATURED
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(resort.id, resort.is_active, resort.title)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1 ${
                      resort.is_active
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-rose-600 text-white hover:bg-rose-700"
                    }`}
                    title="Click to toggle active status on public site"
                  >
                    {resort.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{resort.is_active ? "ACTIVE" : "HIDDEN"}</span>
                  </button>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <span className="text-emerald-400 font-extrabold text-sm bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                    {resort.price_per_night}
                  </span>
                  <span className="text-white/60 text-[11px] bg-black/50 backdrop-blur-md px-2 py-0.5 rounded">
                    Slug: /{resort.slug}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white leading-snug font-['Montserrat',sans-serif]">
                    {resort.title}
                  </h3>
                  <p className="text-white/70 text-xs line-clamp-2 mt-1.5 leading-relaxed">
                    {resort.short_description}
                  </p>
                </div>

                {/* Packages / Highlights info */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="bg-white/5 border border-white/10 text-white/80 text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#FF5500]" />
                    <span>{resort.packages?.length || 2} Package Tiers</span>
                  </span>
                  <span className="bg-white/5 border border-white/10 text-white/80 text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>{resort.gallery_images?.length || 4} Photos</span>
                  </span>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => handlePreviewCategoryPage(resort.slug)}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="View Standalone Category Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(resort)}
                    className="flex-1 bg-white/10 hover:bg-[#FF5500] text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit SS1-SS8</span>
                  </button>

                  <button
                    onClick={() => handleDelete(resort.id, resort.title)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                    title="Delete resort"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredResorts.length === 0 && !isLoading && (
          <div className="bg-[#152C22] rounded-3xl p-12 text-center space-y-4 border border-white/10">
            <Building2 className="w-12 h-12 text-white/30 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Resorts Found</h3>
            <p className="text-xs text-white/60 max-w-sm mx-auto">
              No stays match your current search query or category filter.
            </p>
            <button
              onClick={handleOpenAdd}
              className="bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Resort</span>
            </button>
          </div>
        )}

      </main>

      {/* Resort Add / Edit Modal with SS1-SS8 Controls */}
      <ResortFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingResort}
      />

    </div>
  );
};
