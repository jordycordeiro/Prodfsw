// app/(app)/baseline/actions.ts
'use server'

import { sb } from '@/lib/supabaseServer'

const BASELINE_KIND = 'site_baseline'

export async function getSiteBaseline(): Promise<any | null> {
  const { data, error } = await sb()
    .from('templates')
    .select('content_json')
    .eq('kind', BASELINE_KIND)
    .eq('status', 'published')
    .order('version', { ascending: false })
    .limit(1)
  if (error) throw error
  return (data && data[0] && (data[0] as any).content_json) || null
}

export async function setSiteBaseline(snapshot: any, note?: string) {
  const client = sb()
  const { data: last, error: e0 } = await client
    .from('templates')
    .select('id, version')
    .eq('kind', BASELINE_KIND)
    .order('version', { ascending: false })
    .limit(1)
  if (e0) throw e0

  const nextVersion = ((last && last[0]?.version) || 0) + 1

  const { data: row, error: e1 } = await client.from('templates').insert({
    kind: BASELINE_KIND,
    title: 'Snapshot do Site Padrão',
    content_json: snapshot,
    status: 'draft',
    version: nextVersion,
  }).select('id').single()
  if (e1) throw e1

  const { error: e2 } = await client.from('templates')
    .update({ status: 'published' })
    .eq('id', row.id)
  if (e2) throw e2

  return { ok: true, version: nextVersion }
}
