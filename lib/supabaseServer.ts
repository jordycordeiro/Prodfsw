import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY; // opcional para superadmin

// Client vinculado ao usuário atual (RLS + sessão por cookie)
export function getUserClient(): SupabaseClient {
  const access = cookies().get('sb-access-token')?.value;
  return createClient(url, anon, {
    global: { headers: access ? { Authorization: `Bearer ${access}` } : {} },
    auth: { persistSession: false, detectSessionInUrl: false },
  });
}

// Client com service-role (para operações globais de superadmin). Use com parcimônia.
export function getServiceClient(): SupabaseClient {
  if (!service) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY ausente. Configure no .env para operações de superadmin.');
  }
  return createClient(url, service, {
    auth: { persistSession: false, detectSessionInUrl: false },
  });
}
