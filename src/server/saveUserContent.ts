'use server';
import { createServerClient } from '@/lib/supabase/server';

// Salva/atualiza o conteúdo do usuário para um slug.
// Usa RPC para carimbar customized_at na primeira gravação.
export async function saveUserContent(slug: string, content: unknown) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .rpc('rpc_save_user_content', { slug, payload: content });
  if (error) {
    console.error('saveUserContent error', error);
    throw error;
  }
  return data as string;
}
