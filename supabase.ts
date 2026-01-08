
import { createClient } from '@supabase/supabase-js';

// يرجى استبدال هذه القيم بالقيم الحقيقية من لوحة تحكم Supabase (Settings > API)
const SUPABASE_URL = 'https://nlummkbdklzxyemijatu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zo_hZmx4AU9AdyWR5QC1Eg_SaywvhA4'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
