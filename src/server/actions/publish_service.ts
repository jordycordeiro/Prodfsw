'use server'

import { getServiceClient } from '@/lib/supabaseServer'

export type PublishParams = {
  // Mantemos assinatura por compatibilidade, mas nada além do ID é persistido.
  title?: string
  payload?: any
  versionTag?: string | null
  kind?: string
}

/**
 * Publica um broadcast criando apenas o registro vazio (retorna id)
 * e faz o fan-out para todos os perfis (role='user' OU role NULL).
 * Não depende de colunas inexistentes (sem title/kind/payload/version_tag/meta/etc).
 */
export async function publishBroadcastService(_params: PublishParams) {
  const supabase = getServiceClient()

  // 1) cria o broadcast SEM colunas (apenas defaults do schema)
  const { data: bcast, error: e1 } = await supabase
    .from('broadcasts')
    .insert({})          // ⇐ nada além do que seu schema garante
    .select('id')        // ⇐ só pedimos o id
    .single()

  if (e1) throw new Error(e1.message)

  // 2) busca usuários alvo (role='user' ou NULL p/ compatibilidade)
  const { data: users, error: eUsers } = await supabase
    .from('profiles')
    .select('id, role')
    .or('role.eq.user,role.is.null')

  if (eUsers) throw new Error(eUsers.message)

  // 3) fan-out em lote (sem 'meta')
  const rows = (users ?? []).map(u => ({
    user_id: u.id,
    broadcast_id: bcast.id,
    status: 'unread',
  }))

  if (rows.length) {
    const { error: eInbox } = await supabase.from('user_inbox').insert(rows)
    if (eInbox) throw new Error(eInbox.message)
  }

  return bcast.id as string
}
