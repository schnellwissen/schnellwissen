import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project-id.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key'

let supabase: SupabaseClient | null = null

try {
  // Only initialize Supabase if we have valid configuration
  if (supabaseUrl.startsWith('http') && supabaseAnonKey !== 'demo-anon-key') {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
} catch (error) {
  console.warn('Supabase not configured, using mock data')
}

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null
}

export { supabase }
export default supabase