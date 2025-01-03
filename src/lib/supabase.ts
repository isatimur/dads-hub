import { createClient } from '@supabase/supabase-js'

export const supabaseClient = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
        auth: {
            flowType: 'pkce',
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            redirectTo: import.meta.env.VITE_SITE_URL
        }
    }
) 