'use client'

import * as React from 'react'
import { createBrowserClient } from '@/lib/supabaseClient'

export default function TopbarBell(){
  const [count, setCount] = React.useState<number>(0)
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<any[]>([])

  const supabase = React.useMemo(() => createBrowserClient(), [])

  async function refresh(){
    // Contagem de não lidos
    const { count: unread } = await supabase
      .from('user_inbox')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'unread')

    setCount(unread || 0)

    // ⚠️ FIX: usar "broadcasts(...)" (join implícito pelo FK) em vez de "broadcasts:broadcast_id(...)"
    const { data } = await supabase
      .from('user_inbox')
      .select('id, status, created_at, broadcast_id, broadcasts(id, title, kind, created_at)')
      .order('created_at', { ascending: false })
      .limit(5)

    setItems(data || [])
  }

  React.useEffect(() => {
    refresh()
    const ch = supabase
      .channel('inbox-topbar')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_inbox' }, () => refresh())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="relative w-10 h-10 btn-neumo grid place-items-center text-slate-600"
        aria-label="Caixa de atualizações"
        title="Atualizações do administrador"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .53-.21 1.04-.59 1.41L4 17h5m6 0a3 3 0 0 1-6 0m6 0H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-red-600 text-white ring-1 ring-red-500/40">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-lg ring-1 ring-slate-200 p-2 z-50">
          <div className="text-sm font-semibold px-2 py-1">Atualizações</div>
          {items.length === 0 ? (
            <div className="text-xs opacity-70 px-2 py-2">Sem novidades</div>
          ) : (
            <ul className="divide-y">
              {items.map((it) => (
                <li key={it.id} className="px-2 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{it.broadcasts?.title || 'Atualização'}</div>
                      <div className="text-xs opacity-70">tipo: {it.broadcasts?.kind} • {new Date(it.created_at).toLocaleString()}</div>
                    </div>
                    <a href="/prodoc" className="btn btn-chip whitespace-nowrap">Abrir</a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
