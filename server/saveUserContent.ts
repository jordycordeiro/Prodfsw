'use server';
import { createServerClient } from '@/lib/supabase/server';

// Upserts the user's customized content for a given slug
export async function saveUserContent(slug: string, content: unknown) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('prescriptions')
    .upsert({ slug, content }, { onConflict: 'user_id,slug' })
    .select('id')
    .single();
  if (error) {
    console.error('saveUserContent error', error);
    throw error;
  }
  return data.id as string;
}
