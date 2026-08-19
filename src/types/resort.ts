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
  explore_image_url?: string; // SS3 Exploration image
  check_in_time?: string; // e.g. "11:00 AM"
  check_out_time?: string; // e.g. "10:00 AM"
  contact_phone?: string; // e.g. "+91 8123715275"
  amenities: string[]; // General amenity tags
  highlight_amenities?: HighlightAmenity[]; // 2x2 grid on SS3
  packages?: PackageTier[]; // SS4 left column
  whats_included?: string[]; // SS4 right column list
  gallery_images?: string[]; // SS5 Photo gallery
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
    category.title?.toLowerCase().replace(/\s+/g, "-") ||
    category.name?.toLowerCase().replace(/\s+/g, "-");

  return String(slug || "resort").trim();
}

export type ResortFormData = Omit<Resort, "id" | "created_at"> & {
  id?: string;
};
