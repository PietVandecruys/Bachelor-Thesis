import { createClient } from '@supabase/supabase-js';

// Client voor gebruikersdatabase
const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_USER,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_USER
);

// Client voor modules en vragen database
const supabaseModules = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_MODULES,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_MODULES
);

export { supabaseAuth, supabaseModules };
