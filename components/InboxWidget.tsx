'use client'

import * as React from 'react'
import { createBrowserClient } from '@/lib/supabaseClient'
import { applyAndMergeBroadcast } from '@/src/server/actions/mergeBroadcastPayload'

export default function InboxWidget(){
  const supabase = React.useMemo(() => createBrowserClient(), [])
  const [items, setItems] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [busyId, setBusyId] = React.useState<string | null>(null)

  async function refresh(){
    setLoading(true)
    // ⚠️ FIX: "broadcasts(...)" (join pelo FK)
    const { data } = await supabase
      .from('user_inbox')
      .select('id, status, created_at, broadcast_id, meta, broadcasts(id, title, kind, payload, version_tag, created_at)')
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  React.useEffect(() => {
    refresh()
    const ch = supabase
      .channel('inbox-widget')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_inbox' }, () => refresh())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  async function onApply(broadcastId: string){
    try {
      setBusyId(broadcastId)
      await applyAndMergeBroadcast(broadcastId)
      await refresh()
    } finally {
      setBusyId(null)
    }
  }

  async function onIgnore(inboxId: string){
    await supabase.from('user_inbox').update({ status: 'ignored' }).eq('id', inboxId)
    await refresh()
  }

  if (loading) return <div className="text-sm opacity-80">Carregando atualizações...</div>
  if (!items.length) return <div className="text-sm opacity-60">Sem novidades no momento.</div>

  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.id} className="p-3 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-base font-semibold">{it.broadcasts?.title}</div>
              <div className="text-xs opacity-70">tipo: {it.broadcasts?.kind} • status: {it.status}</div>
            </div>
            <div className="flex gap-2">
              {it.status !== 'applied' && (
                <button
                  className="btn btn-chip"
                  onClick={() => onApply(it.broadcast_id)}
                  disabled={busyId === it.broadcast_id}
                >
                  {busyId === it.broadcast_id ? 'Aplicando...' : 'Aplicar'}
                </button>
              )}
              {it.status === 'unread' && (
                <button className="btn btn-warn" onClick={() => onIgnore(it.id)}>Ignorar</button>
              )}
            </div>
          </div>
          {it.broadcasts?.payload && (
            <pre className="mt-2 text-xs overflow-auto max-h-56 bg-slate-50 p-2 rounded-xl">
              {JSON.stringify(it.broadcasts.payload, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}
