import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const SUPABASE_URL = "https://riptujvubywixiyskkbv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpcHR1anZ1Ynl3aXhpeXNra2J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTE1OTEsImV4cCI6MjA4MDk4NzU5MX0.4AkGGk_a-awM-dilUDVa7c7cF_uvWz3GW9A7X3ajfZY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});
