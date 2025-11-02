// app/admin/studio/actions.admin.ts
'use server'

import { revalidatePath } from 'next/cache'
import { sbAdmin } from '@/lib/supabaseAdmin'

export async function adminSaveDraft(input: { id?: string, kind: string, title: string, content_json: any, note?: string }) {
  const db = sbAdmin()
  if (input.id) {
    const { data, error } = await db.from('templates')
      .update({ title: input.title, content_json: input.content_json, status: 'draft' })
      .eq('id', input.id)
      .select('id')
      .single()
    if (error) throw error
    revalidatePath('/admin/studio')
    return data.id
  } else {
    const { data, error } = await db.from('templates')
      .insert({ kind: input.kind, title: input.title, content_json: input.content_json, status: 'draft', version: 1 })
      .select('id')
      .single()
    if (error) throw error
    revalidatePath('/admin/studio')
    return data.id
  }
}

export async function adminPublish(templateId: string, nextVersion?: number, message?: string) {
  const db = sbAdmin()
  const { error } = await db.rpc('publish_template', { template_id: templateId, version: nextVersion ?? 1, note: message ?? 'Atualização' })
  if (error) throw error
  revalidatePath('/admin/studio')
  return { ok: true }
}
