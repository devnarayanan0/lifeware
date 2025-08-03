import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase environment variables are not set. Please add VITE_SUPABASE_URL and VITE_SUPABASE_KEY to your .env file.');
  console.warn('📝 Example .env file:');
  console.warn('VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.warn('VITE_SUPABASE_KEY=your_supabase_anon_key');
}

// Create Supabase client with fallback for missing env vars
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder_key'
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey);
};

// Helper function for safe database operations
export const safeSupabaseOperation = async (operation) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning fallback data');
    return { data: null, error: new Error('Supabase not configured') };
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('Supabase operation failed:', error);
    return { data: null, error };
  }
}; 