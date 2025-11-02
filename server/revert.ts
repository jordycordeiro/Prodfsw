'use server';
import { createServerClient } from '@/lib/supabase/server';

export async function revertToBaseline(slug: string) {
  const supabase = createServerClient();
  const { error } = await supabase.rpc('rpc_revert_to_baseline', { slug });
  if (error) {
    console.error('revertToBaseline error', error);
    throw error;
  }
  return true;
}
