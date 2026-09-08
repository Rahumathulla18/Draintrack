/**
 * Supabase Client Configuration & Adapter Layer
 * 
 * DrainTrack is designed for seamless transition from prototype state
 * to a live Supabase PostgreSQL database.
 * 
 * When environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * are present, real query calls can be activated through this client.
 */

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  return {
    supabaseUrl: url,
    supabaseAnonKey: key,
    isConfigured: Boolean(url && key)
  };
};

/**
 * Generic query placeholder mimicking Supabase query builder
 * allowing mock fallback with zero UI modification.
 */
export const supabaseMockQuery = async <T>(
  table: string,
  fallbackData: T,
  delayMs = 80
): Promise<{ data: T; error: null | { message: string } }> => {
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return {
    data: fallbackData,
    error: null
  };
};
