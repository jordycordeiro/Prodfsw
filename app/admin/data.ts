// app/(app)/admin/data.ts
'use server'

import { sb } from '@/lib/supabaseServer'

// Menus principais (Exame Físico, Queixas, etc.)
export async function listMenus() {
  const { data, error } = await sb()
    .from('menus')
    .select('id, title, sort')
    .order('sort', { ascending: true })
  if (error) throw error
  return data
}

// Submenus de um menu
export async function listSubmenus(menuId: string) {
  const { data, error } = await sb()
    .from('submenus')
    .select('id, title, sort')
    .eq('menu_id', menuId)
    .order('sort', { ascending: true })
  if (error) throw error
  return data
}

// Cards (prescriptions) ligados ao menu (via submenus)
export async function listCardsByMenu(menuId: string) {
  // 1) obter submenus desse menu
  const { data: subs, error: e1 } = await sb()
    .from('submenus')
    .select('id')
    .eq('menu_id', menuId)
  if (e1) throw e1
  const subIds = (subs ?? []).map(s => s.id)
  if (!subIds.length) return []

  // 2) buscar cards nas prescriptions desses submenus
  const { data, error } = await sb()
    .from('prescriptions')
    .select('id, title, submenu_id, status, created_at, updated_at, content_md')
    .in('submenu_id', subIds)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}
