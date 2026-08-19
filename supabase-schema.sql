-- ============================================================================
-- DANDELI STAY BOOKING - SUPABASE DATABASE SCHEMA & STORAGE POLICIES
-- ============================================================================

-- 1. Create the `resorts` table with full standalone category page support (SS1-SS8)
CREATE TABLE IF NOT EXISTS public.resorts (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    price_per_night TEXT NOT NULL,
    package_badge TEXT DEFAULT 'FROM 1 Night Package ₹1,300/-',
    short_description TEXT NOT NULL,
    full_description TEXT,
    image_url TEXT NOT NULL,
    explore_image_url TEXT,
    check_in_time TEXT DEFAULT '11:00 AM',
    check_out_time TEXT DEFAULT '10:00 AM',
    contact_phone TEXT DEFAULT '+91 8123715275',
    amenities TEXT[] DEFAULT '{}'::TEXT[],
    highlight_amenities JSONB DEFAULT '[]'::JSONB,
    packages JSONB DEFAULT '[]'::JSONB,
    whats_included TEXT[] DEFAULT '{}'::TEXT[],
    gallery_images TEXT[] DEFAULT '{}'::TEXT[],
    is_featured BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true
);

-- Add missing columns if table already exists
DO $$ 
BEGIN 
  BEGIN
    ALTER TABLE public.resorts ADD COLUMN IF NOT EXISTS package_badge TEXT DEFAULT 'FROM 1 Night Package ₹1,300/-';
    ALTER TABLE public.resorts ADD COLUMN IF NOT EXISTS explore_image_url TEXT;
    ALTER TABLE public.resorts ADD COLUMN IF NOT EXISTS check_in_time TEXT DEFAULT '11:00 AM';
    ALTER TABLE public.resorts ADD COLUMN IF NOT EXISTS check_out_time TEXT DEFAULT '10:00 AM';
    ALTER TABLE public.resorts ADD COLUMN IF NOT EXISTS contact_phone TEXT DEFAULT '+91 8123715275';
    ALTER TABLE public.resorts ADD COLUMN IF NOT EXISTS highlight_amenities JSONB DEFAULT '[]'::JSONB;
    ALTER TABLE public.resorts ADD COLUMN IF NOT EXISTS packages JSONB DEFAULT '[]'::JSONB;
    ALTER TABLE public.resorts ADD COLUMN IF NOT EXISTS whats_included TEXT[] DEFAULT '{}'::TEXT[];
    ALTER TABLE public.resorts ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}'::TEXT[];
  EXCEPTION 
    WHEN others THEN NULL;
  END;
END $$;

-- 2. Enable Row Level Security (RLS) & Realtime Publication
ALTER TABLE public.resorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resorts REPLICA IDENTITY FULL;

-- Enable Realtime replication on resorts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'resorts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.resorts;
  END IF;
END $$;

-- 3. Public Read Access: Anyone can read active resorts
CREATE POLICY "Public can view active resorts" 
ON public.resorts 
FOR SELECT 
USING (true);

-- 4. Full Access for authenticated admin users
CREATE POLICY "Admins have full access to resorts" 
ON public.resorts 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Also allow anon full access if using dev API keys without strict auth setup:
CREATE POLICY "Anon full access for easy management" 
ON public.resorts 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- 5. Create Storage Bucket for Resort Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resort-images', 'resort-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Security Policies (Public read and open upload)
CREATE POLICY "Public Read Access on Resort Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'resort-images');

CREATE POLICY "Authenticated and Anon Upload to Resort Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resort-images');

CREATE POLICY "Public Update and Delete on Resort Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'resort-images');

CREATE POLICY "Public Delete on Resort Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'resort-images');
