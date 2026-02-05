import { createClient } from '@supabase/supabase-js'

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tpvqolkzcbbzlqlzchwc.supabase.co'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwdnFvbGt6Y2JiemxxbHpjaHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjA0MjgsImV4cCI6MjA4MTkzNjQyOH0.AU6ieHN1TSUHgSu7qfvkekvmMySDPJb2zOId4Oy7CeY'

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.')
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    // Add timeout and retry configuration
    headers: {
      'User-Agent': 'Import-From-Nepal/1.0'
    }
  }
})

// Add connection test function
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('user_profiles').select('id').limit(1)
    if (error) {
      console.error('Supabase connection test failed:', error.message)
      return false
    }
    console.log('Supabase connection test successful')
    return true
  } catch (error) {
    console.error('Supabase connection test error:', error.message)
    return false
  }
}
