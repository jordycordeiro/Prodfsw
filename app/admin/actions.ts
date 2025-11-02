'use server'

import { sb } from '@/lib/supabaseServer'

// Lista templates (para Admin Studio)
export async function listTemplates() {
  const { data, error } = await sb()
    .from('templates')
    .select('id, set_id, kind, title, sex, content_md, content_json, order_index, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Upsert de template; retorna sempre a linha (com id)
export async function upsertTemplate(input: {
  id?: string
  set_id?: string | null
  kind: string
  title: string
  sex?: 'A'|'M'|'F' | null
  content_md?: string | null
  content_json?: any
  order_index?: number | null
}) {
  const { data, error } = await sb()
    .from('templates')
    .upsert(input)
    .select('id, set_id, kind, title, sex, content_md, content_json, order_index, created_at')
    .single()
  if (error) throw error
  return data
}

// Publica template: gera broadcasts + inbox (todos os usuários)
export async function publishTemplate(templateId: string, note?: string) {
  if (!templateId) throw new Error('templateId ausente')
  const client = sb()

  // pega a versão atual
  const { data: tpl, error: e0 } = await client
    .from('templates')
    .select('version')
    .eq('id', templateId)
    .single()
  if (e0) throw e0
  const version = Number(tpl?.version ?? 1)

  // dispara broadcast → user_inbox
  const { error: e1 } = await client.rpc('publish_template', {
    p_template_id: templateId,
    p_version: version,
    p_note: note ?? null,
  } as any)
  if (e1) throw e1

  // marca como publicado (para a UI)
  await client.from('templates').update({ status: 'published' }).eq('id', templateId)

  return { ok: true }
}
