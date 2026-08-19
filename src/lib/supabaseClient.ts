import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Resort, ResortFormData } from "../types/resort";
import { compressImageToWebP } from "./imageCompressor";
import { PLACEHOLDERS } from "../config/placeholders";

// Retrieve environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project")
);

// Lazy initialized Supabase client
let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseInstance;
}

// Initial Seed Data with full Standalone Category Page details (SS1 - SS8)
export const INITIAL_RESORTS_SEED: Resort[] = [
  {
    id: "resort-1",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    title: "Premium Riverside Retreat",
    slug: "premium-riverside-retreat",
    category: "Riverside Resort",
    price_per_night: "₹3,500 / person",
    package_badge: "FROM 1 Night Package ₹1,300/-",
    check_in_time: "11:00 AM",
    check_out_time: "10:00 AM",
    contact_phone: "+91 8123715275",
    short_description: "Direct Kali River access with open-air riverside swimming pool, deluxe AC chalets, and all buffet meals included.",
    full_description: "Immerse in nature along the banks of the roaring Kali River. This verified luxury riverside retreat offers private cottages with direct waterhole views, lush lawns, natural river rock jacuzzis, and all-inclusive gourmet buffet spreads with evening campfires under starry skies.",
    image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=85",
    explore_image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
    amenities: [
      "Swimming Pool",
      "All Buffet Meals Included",
      "River View Balcony",
      "AC Glass Chalet",
      "Campfire & Music",
      "Free Wi-Fi"
    ],
    highlight_amenities: [
      {
        title: "Riverfront View",
        description: "Wake up to uninterrupted panoramic vistas of the pristine Kali River and mist-covered forests.",
        icon: "waves"
      },
      {
        title: "Water Sports",
        description: "Complimentary river kayaking, boating, and natural jacuzzi baths steps from your room.",
        icon: "compass"
      },
      {
        title: "Sunset Deck",
        description: "Exclusive open-air timber deck ideal for evening teas, photography, and stargazing.",
        icon: "sunset"
      },
      {
        title: "Jungle Surroundings",
        description: "Enclosed by rich teak canopies with morning Great Indian Hornbill sightings.",
        icon: "trees"
      }
    ],
    packages: [
      {
        id: "pkg-1",
        name: "Standard River Cottage",
        price_per_person: "₹1,300 / head",
        capacity_badge: "Min 2 - Max 4 Guests",
        description: "Cozy ensuite cottage with garden patio, fan cooling, and direct river promenade walkway access."
      },
      {
        id: "pkg-2",
        name: "Deluxe Riverfront AC Chalet",
        price_per_person: "₹2,200 / head",
        capacity_badge: "Min 2 - Max 3 Guests",
        description: "Spacious air-conditioned wooden chalet featuring floor-to-ceiling glass river view windows and private balcony."
      },
      {
        id: "pkg-3",
        name: "Luxury Kali River Suite",
        price_per_person: "₹3,500 / head",
        capacity_badge: "Min 2 - Max 5 Guests",
        description: "Premium king suite with river-facing jacuzzi, private dining terrace, and dedicated butler assistance."
      }
    ],
    whats_included: [
      "3 Unlimited Buffet Meals (Breakfast, Lunch & Dinner)",
      "4 Complimentary Water Activities (Kayaking, Boating, Zorbing, River Jacuzzi)",
      "Evening Campfire with Music & Barbecue Stalls",
      "Guided Morning Nature & Bird Watching Trail",
      "Swimming Pool & Outdoor Lawn Game Access",
      "Free High-Speed Wi-Fi & Reserved Parking"
    ],
    gallery_images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80"
    ],
    is_featured: true,
    is_active: true,
  },
  {
    id: "resort-2",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    title: "Forest Wilderness Lodge",
    slug: "forest-wilderness-lodge",
    category: "Jungle Cottage",
    price_per_night: "₹2,800 / person",
    package_badge: "FROM 1 Night Package ₹1,500/-",
    check_in_time: "11:30 AM",
    check_out_time: "10:30 AM",
    short_description: "Surrounded by century-old teak canopies with guaranteed morning hornbill sightings and guided jungle walks.",
    full_description: "Step away from the city grit and wake up inside handcrafted timber cottages nestled deep within the Dandeli-Anshi Tiger Reserve corridor. Experience authentic forest living with home-cooked Malnad delicacies, guided wildlife trails, and serene silence broken only by birdsong.",
    image_url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=85",
    explore_image_url: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80",
    amenities: [
      "Deep Forest Setting",
      "Jungle Trekking Guide",
      "Homestyle Food",
      "Rain Shower",
      "Indoor Games",
      "Pet Friendly"
    ],
    highlight_amenities: [
      {
        title: "Canopy Immersion",
        description: "Nestled beneath century-old evergreen teak trees with serene forest shade all day long.",
        icon: "trees"
      },
      {
        title: "Wildlife Safari Base",
        description: "Direct pickup from lodge gates for early morning and evening Dandeli forest safaris.",
        icon: "compass"
      },
      {
        title: "Campfire Circle",
        description: "Night gathering around crackling teak embers with traditional regional folklore and music.",
        icon: "flame"
      },
      {
        title: "Local Cuisine",
        description: "Authentic North Karnataka and Malnad buffet cooked with organic farm-fresh ingredients.",
        icon: "utensils"
      }
    ],
    packages: [
      {
        id: "pkg-1",
        name: "Standard Teakwood Cabin",
        price_per_person: "₹1,500 / head",
        capacity_badge: "Min 2 - Max 4 Guests",
        description: "Charming wooden cottage with modern attached bathroom, verandah seating, and forest breeze."
      },
      {
        id: "pkg-2",
        name: "Deluxe Family Safari Lodge",
        price_per_person: "₹2,400 / head",
        capacity_badge: "Min 4 - Max 8 Guests",
        description: "Large two-bedroom wooden bungalow equipped with AC, spacious lounge, and private garden patio."
      }
    ],
    whats_included: [
      "3 Unlimited Buffet Meals (Breakfast, Lunch & Dinner)",
      "Daily Morning Guided Jungle Walk & Hornbill Spotting",
      "Evening Campfire with Local Music",
      "Night Nature Walk with Certified Forest Guide",
      "Indoor/Outdoor Games (Archery, Badminton, Carrom)",
      "Complimentary Tea & Coffee Refreshments"
    ],
    gallery_images: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
    ],
    is_featured: true,
    is_active: true,
  },
  {
    id: "resort-3",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    title: "Luxury Riverfront Treehouse",
    slug: "luxury-riverfront-treehouse",
    category: "Canopy Treehouse",
    price_per_night: "₹4,200 / person",
    package_badge: "FROM 1 Night Package ₹2,800/-",
    check_in_time: "12:00 PM",
    check_out_time: "11:00 AM",
    short_description: "Perched 35 feet up in century-old canopies with 360-degree views of the river bend and misty sunrise.",
    full_description: "An extraordinary architectural marvel handcrafted from sustainable teak and bamboo, perched 35 feet into the Western Ghat canopy. Experience uninterrupted elevated panoramic views of the river bend, stargazing with optical telescopes, and luxurious king beds surrounded by nature.",
    image_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85",
    explore_image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
    amenities: [
      "35ft Canopy Elevation",
      "Private Panorama Deck",
      "Telescope Star-Gazing",
      "King Size Bed",
      "Jacuzzi",
      "24/7 Concierge"
    ],
    highlight_amenities: [
      {
        title: "35ft High Elevation",
        description: "Handcrafted atop mature living trees with reinforced steel-timber engineering.",
        icon: "trees"
      },
      {
        title: "360° River Panorama",
        description: "Open wrap-around viewing balcony with cushioned lounger chairs and binoculars.",
        icon: "binoculars"
      },
      {
        title: "Starlight Glass Ceiling",
        description: "Specially tinted skylight dome above the master bed for nighttime stargazing.",
        icon: "sparkles"
      },
      {
        title: "Private In-Suite Jacuzzi",
        description: "Deep soaking warm bubble jacuzzi overlooking the jungle river canopy.",
        icon: "waves"
      }
    ],
    packages: [
      {
        id: "pkg-1",
        name: "Romantic Canopy Treehouse",
        price_per_person: "₹2,800 / head",
        capacity_badge: "Min 2 - Max 2 Guests",
        description: "Intimate elevated luxury suite designed for couples with champagne reception and candlelit balcony dinner."
      },
      {
        id: "pkg-2",
        name: "Grand Horizon Treehouse Villa",
        price_per_person: "₹4,200 / head",
        capacity_badge: "Min 2 - Max 4 Guests",
        description: "Expansive bi-level treehouse with private jacuzzi, dual viewing decks, and telescope."
      }
    ],
    whats_included: [
      "All 3 Gourmet Buffet Meals & High-Tea Refreshments",
      "Priority Kali River White Water Rafting Booking",
      "Private Guided Canopy Walk & Sunset Safari",
      "In-Suite Jacuzzi & Stargazing Telescope",
      "Dedicated Private Butler Service 24/7",
      "Evening Campfire with Acoustic Music"
    ],
    gallery_images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80"
    ],
    is_featured: true,
    is_active: true,
  },
  {
    id: "resort-4",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    title: "Wild Adventure Camp",
    slug: "wild-adventure-camp",
    category: "Tent Camping",
    price_per_night: "₹1,800 / person",
    package_badge: "FROM 1 Night Package ₹1,100/-",
    check_in_time: "12:00 PM",
    check_out_time: "10:00 AM",
    short_description: "Weather-proof alpine tent stays right on the river shoreline with night barbecue and white water rafting bundles.",
    full_description: "The ultimate Dandeli outdoor adventure for youth groups, families, and rafting enthusiasts. Pitch your tent along the Kali shoreline, sleep beneath the open sky with campfire crackling beside you, and wake up to instant grade 3 river rafting expeditions.",
    image_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85",
    explore_image_url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1000&q=80",
    amenities: [
      "Waterproof Tents",
      "Barbecue Grill",
      "Rafting Launch Point",
      "River Jacuzzi",
      "Campfire",
      "Buffet Breakfast"
    ],
    highlight_amenities: [
      {
        title: "Shoreline Camping",
        description: "High-grade waterproof tents pitched just meters from the Kali river edge.",
        icon: "tent"
      },
      {
        title: "Direct Rafting Launch",
        description: "Board certified white-water rafting boats right in front of the campsite.",
        icon: "waves"
      },
      {
        title: "Night Barbecue Pit",
        description: "Open campfire barbecue grill with vegetarian and non-vegetarian skewers.",
        icon: "flame"
      },
      {
        title: "Clean Washrooms",
        description: "Modern brick-and-mortar sanitary washrooms with 24/7 running hot water.",
        icon: "check"
      }
    ],
    packages: [
      {
        id: "pkg-1",
        name: "Alpine Dome Tent Stay",
        price_per_person: "₹1,100 / head",
        capacity_badge: "Min 2 - Max 3 Guests",
        description: "Twin-sharing waterproof dome tent with foam mattresses, clean bedding, pillows, and shared restrooms."
      },
      {
        id: "pkg-2",
        name: "Glamping Safari Tent Suite",
        price_per_person: "₹1,800 / head",
        capacity_badge: "Min 2 - Max 4 Guests",
        description: "Large walk-in safari luxury tent with real wooden beds, lighting, ceiling fan, and private attached washroom."
      }
    ],
    whats_included: [
      "All 3 Buffet Meals (Breakfast, Lunch & Dinner)",
      "4 Complimentary Adventure Activities (Kayaking, Zorbing, Boating, Swimming)",
      "Evening Campfire with Live Barbecue",
      "Morning Nature Trek with River Guides",
      "Safe Luggage Storage & 24/7 Campsite Security",
      "Life Jackets & Certified Safety Gear"
    ],
    gallery_images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80"
    ],
    is_featured: false,
    is_active: true,
  }
];

const LOCAL_STORAGE_KEY = "dandeli_resorts_storage_v2";

// Helper to get local data
function getLocalResorts(): Resort[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_RESORTS_SEED));
      return INITIAL_RESORTS_SEED;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_RESORTS_SEED;
  } catch (e) {
    return INITIAL_RESORTS_SEED;
  }
}

// Helper to save local data
function saveLocalResorts(resorts: Resort[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resorts));
    window.dispatchEvent(new Event("dandeli_resorts_updated"));
  } catch (e) {
    console.error("Failed to save local resorts", e);
  }
}

/**
 * Real-Time Supabase Listener
 * Subscribes to PostgreSQL database changes (INSERT, UPDATE, DELETE)
 * and triggers immediate refetch/update across all connected devices.
 */
export function subscribeToResortsRealtime(onUpdate: () => void): () => void {
  const supabase = getSupabase();
  if (!supabase) {
    return () => {};
  }

  try {
    const channelName = `public:resorts_realtime_${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "resorts",
        },
        (payload) => {
          console.log("[Supabase Realtime] Change detected on 'resorts' table:", payload.eventType, payload);
          onUpdate();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[Supabase Realtime] Connected & subscribed to live resorts updates");
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("[Supabase Realtime] Channel status:", status);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn("[Supabase Realtime] Subscription setup error:", err);
    return () => {};
  }
}

// Database API Methods
export async function fetchResorts(): Promise<Resort[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("resorts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch error, falling back to local cache:", error.message);
        return getLocalResorts();
      }

      if (data && data.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data as Resort[];
      }
    } catch (err) {
      console.warn("Supabase connection exception:", err);
    }
  }

  return getLocalResorts();
}

export async function fetchResortBySlug(slug: string): Promise<Resort | null> {
  const resorts = await fetchResorts();
  const found = resorts.find((r) => r.slug === slug || r.id === slug);
  return found || null;
}

export async function createResort(formData: ResortFormData): Promise<Resort> {
  const newResort: Resort = {
    id: formData.id || `resort-${Date.now()}`,
    created_at: new Date().toISOString(),
    title: formData.title,
    slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    category: formData.category || "Riverside Resort",
    price_per_night: formData.price_per_night || "₹2,500 / person",
    package_badge: formData.package_badge || `FROM 1 Night Package ${formData.price_per_night}`,
    check_in_time: formData.check_in_time || "11:00 AM",
    check_out_time: formData.check_out_time || "10:00 AM",
    contact_phone: formData.contact_phone || "+91 8123715275",
    short_description: formData.short_description,
    full_description: formData.full_description || formData.short_description,
    image_url: formData.image_url,
    explore_image_url: formData.explore_image_url || formData.image_url,
    amenities: formData.amenities || [],
    highlight_amenities: formData.highlight_amenities || [],
    packages: formData.packages || [],
    whats_included: formData.whats_included || [],
    gallery_images: formData.gallery_images || [formData.image_url],
    is_featured: formData.is_featured ?? true,
    is_active: formData.is_active ?? true,
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("resorts")
        .insert([newResort])
        .select()
        .single();

      if (!error && data) {
        const local = getLocalResorts();
        saveLocalResorts([data as Resort, ...local.filter((r) => r.id !== data.id)]);
        return data as Resort;
      }
    } catch (e) {
      console.warn("Supabase insert error, saving locally", e);
    }
  }

  const local = getLocalResorts();
  const updated = [newResort, ...local];
  saveLocalResorts(updated);
  return newResort;
}

export async function updateResort(id: string, updates: Partial<Resort>): Promise<Resort> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("resorts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const local = getLocalResorts();
        saveLocalResorts(local.map((r) => (r.id === id ? (data as Resort) : r)));
        return data as Resort;
      }
    } catch (e) {
      console.warn("Supabase update error, saving locally", e);
    }
  }

  const local = getLocalResorts();
  let updatedResort: Resort | null = null;
  const updated = local.map((r) => {
    if (r.id === id) {
      updatedResort = { ...r, ...updates };
      return updatedResort;
    }
    return r;
  });
  saveLocalResorts(updated);
  return updatedResort || local[0];
}

export async function deleteResort(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("resorts").delete().eq("id", id);
      if (!error) {
        const local = getLocalResorts();
        saveLocalResorts(local.filter((r) => r.id !== id));
        return true;
      }
    } catch (e) {
      console.warn("Supabase delete error", e);
    }
  }

  const local = getLocalResorts();
  saveLocalResorts(local.filter((r) => r.id !== id));
  return true;
}

export async function toggleResortStatus(id: string, isActive: boolean): Promise<Resort> {
  return updateResort(id, { is_active: isActive });
}

// Upload Image to Supabase Storage with Automatic WebP Compression
export async function uploadResortImage(file: File): Promise<string> {
  const compressedFile = await compressImageToWebP(file, 250 * 1024);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
      const filePath = `resorts/${fileName}`;

      const { data, error } = await supabase.storage
        .from("resort-images")
        .upload(filePath, compressedFile, {
          contentType: "image/webp",
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from("resort-images")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (e) {
      console.warn("Supabase storage upload error, creating inline WebP data URL", e);
    }
  }

  // Fallback: Convert compressed WebP into base64 Data URL for instant local persistence
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(compressedFile);
  });
}
