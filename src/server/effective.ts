'use server';
import { createServerClient } from '@/lib/supabase/server';
import type { EffectivePageRow } from '@/types/prodoc';

// Carrega o estado efetivo (baseline do admin OU cópia do usuário) para uma lista de slugs.
export async function getEffective(slugs: string[]) {
  const supabase = createServerClient();
  if (!slugs?.length) return new Map<string, EffectivePageRow>();

  const { data, error } = await supabase
    .rpc('rpc_get_effective_pages', { slug_list: slugs });

  if (error) {
    console.error('getEffective error', error);
    throw error;
  }
  const map = new Map<string, EffectivePageRow>();
  for (const row of (data ?? []) as EffectivePageRow[]) {
    map.set(row.slug, row);
  }
  return map;
}
