'use server'

import { createServerClient } from '@/lib/supabaseServer'

export type PublishParams = {
  kind: 'template' | 'medication' | 'observation' | 'exam' | 'message'
  title: string
  payload: any
  versionTag?: string | null
}

/**
 * Chama o RPC `publish_broadcast` (usa sessão do usuário).
 * Retorna o ID do broadcast criado.
 */
export async function publishBroadcast(params: PublishParams) {
  const supabase = createServerClient()

  const { kind, title, payload, versionTag } = params
  const { data, error } = await supabase.rpc('publish_broadcast', {
    kind,
    title,
    payload,
    version_tag: versionTag ?? null,
  })

  if (error) {
    console.error('publishBroadcast error', error)
    throw new Error(error.message)
  }

  return data as string
}
