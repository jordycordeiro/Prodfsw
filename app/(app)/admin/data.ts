'use server'

import { sb } from '@/lib/supabaseServer'

/** Menus principais (Exame, Queixas/Observações, Medicações, Patologias Adulto/Pediatria) */
export async function listMenus() {
  const { data, error } = await sb()
    .from('menus')
    .select('id, title, slug, sort')
    .order('sort', { ascending: true })
  if (error) throw error
  return data
}

/** Submenus de um menu (ex.: IVAS, Dor lombar, etc.) */
export async function listSubmenus(menuId: string) {
  const { data, error } = await sb()
    .from('submenus')
    .select('id, title, sort')
    .eq('menu_id', menuId)
    .order('sort', { ascending: true })
  if (error) throw error
  return data
}

/** Cards (prescriptions) de um submenu específico.
 *  Se seu texto NÃO está em content_md, troque abaixo para o campo real (ex.: content_json, html).
 */
export async function listCardsBySubmenu(submenuId: string) {
  const { data, error } = await sb()
    .from('prescriptions')
    .select('id, title, content_md, created_at, updated_at')
    .eq('submenu_id', submenuId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}
