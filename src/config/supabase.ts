/**
 * Supabase Runtime Configuration
 * Safely resolves dynamic environment variables across Vite, SSR, and production runtimes
 * with comprehensive validation, guards, and fallback logging.
 */

// Helper to safely get environment variable across Vite (import.meta.env) and Node/SSR (process.env)
function getEnvVariable(key: string, altKey?: string): string {
  // 1. Check Vite standard client environment variables
  try {
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
      return String(import.meta.env[key]).trim();
    }
  } catch {
    // Ignore in non-Vite environments
  }

  // 2. Check Node / Server / Process environment fallback
  try {
    if (typeof process !== "undefined" && process.env) {
      if (process.env[key]) {
        return String(process.env[key]).trim();
      }
      if (altKey && process.env[altKey]) {
        return String(process.env[altKey]).trim();
      }
    }
  } catch {
    // Ignore in environments without process
  }

  return "";
}

// 1. Dynamic Environment Variable Reading
const rawUrl = getEnvVariable("VITE_SUPABASE_URL", "SUPABASE_URL");
const rawAnonKey = getEnvVariable("VITE_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY");

// 2. Runtime Guard: Check if missing or set to placeholder text
function isValidSupabaseUrl(url: string): boolean {
  if (!url) return false;
  if (!url.startsWith("http://") && !url.startsWith("https://")) return false;
  const lower = url.toLowerCase();
  if (
    lower.includes("your-project") ||
    lower.includes("placeholder") ||
    lower.includes("example.com") ||
    lower.includes("my_supabase")
  ) {
    return false;
  }
  return true;
}

function isValidSupabaseKey(key: string): boolean {
  if (!key) return false;
  const lower = key.toLowerCase();
  if (
    lower.includes("your_supabase_anon_key") ||
    lower.includes("placeholder") ||
    lower.includes("your-anon-key") ||
    key.length < 20
  ) {
    return false;
  }
  return true;
}

export const isSupabaseConfigured: boolean =
  isValidSupabaseUrl(rawUrl) && isValidSupabaseKey(rawAnonKey);

export const supabaseUrl: string = isSupabaseConfigured ? rawUrl : "";
export const supabaseAnonKey: string = isSupabaseConfigured ? rawAnonKey : "";

// Runtime Guard & Logging
if (!isSupabaseConfigured) {
  console.warn(
    "Supabase environment variables missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment variables (Vercel) or .env file."
  );
}

export const SUPABASE_CONFIG = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  isConfigured: isSupabaseConfigured,
};
