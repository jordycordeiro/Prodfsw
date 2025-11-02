'use server'

import { sb } from '@/lib/supabaseServer'

/**
 * Lista submenus ativos via view v_active_submenus.
 * Retorna { id: name, name } para simplificar o uso no front.
 */
export async function listSubmenus(scope?: string) {
  let q = sb().from('v_active_submenus').select('id, submenu_name, scope').order('submenu_name', { ascending: true })
  if (scope) q = q.eq('scope', scope as any) as any
  const { data, error } = await q
  if (error) throw error
  return (data ?? []).map((s: any) => ({
    id: String(s.submenu_name),
    name: String(s.submenu_name),
  }))
}