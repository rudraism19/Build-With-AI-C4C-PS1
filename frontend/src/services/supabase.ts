import { createClient } from '@supabase/supabase-js';
import { UserRole } from '../types';

const metaEnv = (import.meta as any).env || {};

const supabaseUrl =
  metaEnv.VITE_SUPABASE_URL ||
  'https://lrrwhqoeopwiwjthlpdb.supabase.co';

const supabaseAnonKey =
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycndocW9lb3B3aXdqdGhscGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjU0ODUsImV4cCI6MjEwNTg0MTQ4NX0.DAqNhMeMxUCDXeyRi7lJIcPKlmbyZiXFWQQjDWb08yc';


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Initiates official Google OAuth flow via Supabase.
 * Redirects the user to Google authentication and returns to the current origin.
 */
export async function signInWithGoogleOAuth(targetRole: UserRole = 'CITIZEN') {
  try {
    // Persist chosen role so when Google redirects back, we assign the correct cadre dashboard
    localStorage.setItem('jansetu_oauth_target_role', targetRole);

    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Supabase Google OAuth initiation error:', error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Failed to start Google sign-in:', err);
    throw err;
  }
}

/**
 * Signs out from Supabase Auth session
 */
export async function signOutSupabase() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Supabase signOut note:', err);
  }
}
