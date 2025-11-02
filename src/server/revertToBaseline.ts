'use server';
import { createServerClient } from '@/lib/supabase/server';

// Remove a cópia do usuário para um slug, fazendo-o herdar novamente o baseline do admin.
export async function revertToBaseline(slug: string) {
  const supabase = createServerClient();
  const { error } = await supabase.rpc('rpc_revert_to_baseline', { slug });
  if (error) {
    console.error('revertToBaseline error', error);
    throw error;
  }
  return true;
}
