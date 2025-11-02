'use server';
import { createServerClient } from '@/lib/supabase/server';

// Garante copy-on-write ao entrar no modo edição (cria a cópia se não existir).
export async function startEdit(slug: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('rpc_copy_on_write', { slug });
  if (error) {
    console.error('startEdit error', error);
    throw error;
  }
  return data as string; // id da prescription do usuário
}
