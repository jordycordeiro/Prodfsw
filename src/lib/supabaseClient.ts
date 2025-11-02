'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Reutiliza uma instância única no browser
let _client: SupabaseClient | null = null;

/** Novo nome recomendável */
export function createBrowserClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true },
      global: { headers: { 'X-Client-Info': 'prodoc-browser' } },
    });
  }
  return _client;
}

/** Shim p/ código legado (login, etc.) */
export function getBrowserSupabase(): SupabaseClient {
  return createBrowserClient();
}

/** Default export também como shim (caso import default) */
export default getBrowserSupabase;
