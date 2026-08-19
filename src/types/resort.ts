export interface PackageTier {
  id: string;
  name: string;
  price_per_person: string;
  capacity_badge: string;
  description: string;
}

export interface HighlightAmenity {
  id?: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Resort {
  id: string;
  created_at?: string;
  title: string;
  name?: string; // Fallback alias for title
  slug: string;
  category_slug?: string; // Fallback alias for slug
  category: string;
  price_per_night: string; // e.g. "₹1,300 / person"
  package_badge?: string; // e.g. "FROM 1 Night Package ₹1,300/-"
  short_description: string;
  full_description: string;
  image_url: string; // Hero cover photo
  images?: string[] | string; // Dynamic Supabase image array or JSON string
  cover_image?: string; // Alternative cover image field
  image?: string; // Alternative image field
  explore_image_url?: string; // SS3 Exploration image
  check_in_time?: string; // e.g. "11:00 AM"
  check_out_time?: string; // e.g. "10:00 AM"
  contact_phone?: string; // e.g. "+91 8123715275"
  amenities: string[]; // General amenity tags
  highlight_amenities?: HighlightAmenity[]; // 2x2 grid on SS3
  packages?: PackageTier[]; // SS4 left column
  whats_included?: string[]; // SS4 right column list
  gallery_images?: string[] | string; // SS5 Photo gallery
  is_featured: boolean;
  is_active: boolean;
}

/**
 * Safely resolves a category slug from any object variant (slug, category_slug, id, title, name)
 * Prevents "undefined" URL routing parameter issues.
 */
export function getCategorySlug(category?: Partial<Resort> | null): string {
  if (!category) return "resort";
  const slug =
    category.slug ||
    category.category_slug ||
    category.id ||
    (typeof category.title === "string" ? category.title.toLowerCase().replace(/\s+/g, "-") : "") ||
    (typeof category.name === "string" ? category.name.toLowerCase().replace(/\s+/g, "-") : "") ||
    "resort";

  return String(slug || "resort").trim();
}

/**
 * Safely extracts the display image from any resort/stay object variant,
 * supporting JSON arrays, string arrays, cover_image, or image_url.
 */
export function getDisplayImage(stay?: Partial<Resort> | null): string {
  if (!stay) return "";

  let raw = "";
  if (Array.isArray(stay.images) && stay.images.length > 0) {
    raw = String(stay.images[0] || "").trim();
  } else if (typeof stay.images === "string" && stay.images.trim()) {
    const trimmed = stay.images.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          raw = String(parsed[0] || "").trim();
        }
      } catch (_) {
        raw = trimmed;
      }
    } else if (trimmed.includes(",")) {
      raw = trimmed.split(",")[0].trim();
    } else {
      raw = trimmed;
    }
  }

  if (!raw) {
    raw = String(stay.image_url || stay.cover_image || stay.image || "").trim();
  }

  if (!raw && Array.isArray(stay.gallery_images) && stay.gallery_images.length > 0) {
    raw = String(stay.gallery_images[0] || "").trim();
  }

  return raw;
}

export type ResortFormData = Omit<Resort, "id" | "created_at"> & {
  id?: string;
};
