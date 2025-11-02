'use server'

import { createServerClient } from '@/lib/supabaseServer'

export async function getMyInbox() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('user_inbox')
    .select('id, created_at, status, meta, broadcast_id, broadcasts:broadcast_id(id, title, kind, payload, version_tag, created_at)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function applyBroadcast(broadcastId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.rpc('apply_broadcast', { p_broadcast_id: broadcastId })
  if (error) throw new Error(error.message)
  return data === true
}

export async function ignoreBroadcast(inboxId: string) {
  const supabase = await createServerClient()
  const { error } = await supabase.from('user_inbox').update({ status: 'ignored' }).eq('id', inboxId)
  if (error) throw new Error(error.message)
  return true
}
