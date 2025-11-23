import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/config';

// Initialize Supabase clients only if URL is available
let supabaseAdmin: SupabaseClient | null = null;
let supabaseClient: SupabaseClient | null = null;

if (config.supabase.url && config.supabase.serviceRoleKey) {
  // Server-side Supabase client with service role key
  // This bypasses RLS and should only be used on the server
  supabaseAdmin = createClient(
    config.supabase.url,
    config.supabase.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

if (config.supabase.url && config.supabase.anonKey) {
  // Client for public operations (with anon key)
  supabaseClient = createClient(
    config.supabase.url,
    config.supabase.anonKey
  );
}

export { supabaseAdmin, supabaseClient };

// Helper function to verify JWT tokens from Supabase
export const verifySupabaseJWT = async (token: string) => {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured');
    }

    const { data: user, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user.user) {
      throw new Error('Invalid token');
    }

    return user.user;
  } catch (error) {
    throw new Error('Token verification failed');
  }
};
