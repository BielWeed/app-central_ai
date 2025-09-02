import { User } from '../types';

// Define a minimal Session type based on what the app needs from Supabase
export interface Session {
  access_token: string;
  user: User;
  // Add other session properties if needed
}

// IMPORTANT: Replace these with your actual Supabase project URL and anon key.
// It's recommended to use environment variables for this in a real project.
const SUPABASE_URL = 'https://yapytwhpoovwdesycpze.supabase.co'; // e.g., 'https://xyz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhcHl0d2hwb292d2Rlc3ljcHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3ODY4NTksImV4cCI6MjA3MjM2Mjg1OX0.xfvZJYRy10BB__ex-m1sj2GMirS8eHgbhW0QR8ddT9k'; // e.g., 'ey...'

// Since we load Supabase from a CDN, it attaches itself to the window object.
// We declare its shape here for TypeScript to understand it.
declare global {
  interface Window {
    supabase: any; // Using `any` for simplicity as CDN doesn't expose types easily
  }
}

let supabaseClient: any;

if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
    console.error(
      'FATAL: Supabase credentials are not configured. Please replace the placeholder values in lib/supabase.ts. The application will run in a mocked state.'
    );
    // Create a mock client to prevent the app from crashing on initialization
    supabaseClient = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: (_callback: (event: string, session: Session | null) => void) => {
          // Immediately call with a null session to ensure the app starts in a logged-out state
          setTimeout(() => _callback('INITIAL_STATE', null), 0);
          return {
            data: { subscription: { unsubscribe: () => {} } },
          };
        },
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase is not configured. Please see the console.' } }),
        signOut: () => Promise.resolve({ error: null }),
      },
    };
} else if (!window.supabase) {
  // This case handles when the CDN script itself fails to load.
  throw new Error("Supabase client not found. Make sure the Supabase script is loaded in index.html.");
} else {
  // Initialize the real client if credentials are set and the script is loaded.
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const supabase = supabaseClient;
