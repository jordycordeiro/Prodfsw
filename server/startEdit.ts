'use server';
import { createServerClient } from '@/lib/supabase/server';

// Ensures the user has a personal copy when entering edit mode
export async function startEdit(slug: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('rpc_copy_on_write', { slug });
  if (error) {
    console.error('startEdit error', error);
    throw error;
  }
  return data as string; // user prescription id
}
