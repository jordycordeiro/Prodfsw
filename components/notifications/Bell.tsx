// components/notifications/Bell.tsx
'use client'

import { useEffect, useState, useTransition } from 'react'
import { inboxList, inboxMarkAllRead, inboxMarkRead, inboxApply } from '@/app/admin/studio/actions'

type InboxItem = {
  id: string
  template_id: string
  note: string | null
  created_at: string
  read_at: string | null
  status: string | null
}

export default function Bell({ initialCount = 0 }: { initialCount?: number }) {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [items, setItems] = useState<InboxItem[] | null>(null)
  const [pending, start] = useTransition()

  useEffect(() => {
    if (!open) return
    start(async () => {
      const res = await inboxList(20, null)
      if (res.ok) {
        const mapped = (res.items as any[]).map((x) => ({
          id: x.id,
          template_id: x.template_id,
          note: x.note,
          created_at: x.created_at,
          read_at: x.read_at,
          status: x.status,
        }))
        setItems(mapped)
      }
    })
  }, [open])

  async function markAll() {
    start(async () => {
      const r = await inboxMarkAllRead()
      if (r.ok) {
        setCount(0)
        if (items) setItems(items.map(i => ({ ...i, read_at: i.read_at ?? new Date().toISOString() })))
      }
    })
  }

  async function markOne(id: string) {
    start(async () => {
      const r = await inboxMarkRead(id)
      if (r.ok) {
        setItems((curr) => curr?.map(i => i.id === id ? { ...i, read_at: i.read_at ?? new Date().toISOString() } : i) ?? null)
        setCount((c) => Math.max(0, c - 1))
      }
    })
  }

  async function applyOne(id: string) {
    start(async () => {
      const r = await inboxApply(id)
      if (r.ok) {
        setItems((curr) => curr?.map(i => i.id === id ? { ...i, status: 'applied', read_at: i.read_at ?? new Date().toISOString() } : i) ?? null)
        setCount((c) => Math.max(0, c - 1))
      }
    })
  }

  return (
    <div className="relative">
      <button className="btn btn-ghost" onClick={() => setOpen(o => !o)}>
        🔔
        {count > 0 && <span className="badge badge-error ml-1">{count}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 rounded-xl border bg-white shadow-lg p-3 z-50">
          <div className="flex items-center justify-between mb-2">
            <strong>Atualizações</strong>
            <button onClick={markAll} disabled={pending} className="btn btn-xs">Marcar todas como lidas</button>
          </div>

          {!items && <div className="text-sm opacity-70">Carregando…</div>}
          {items?.length === 0 && <div className="text-sm opacity-70">Sem notificações</div>}

          <ul className="space-y-2 max-h-80 overflow-auto">
            {items?.map(i => (
              <li key={i.id} className="border rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-medium">{i.note ?? 'Atualização disponível'}</div>
                    <div className="text-xs opacity-60">{new Date(i.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-xs" onClick={() => markOne(i.id)} disabled={pending}>
                      {i.read_at ? 'Lida' : 'Marcar lida'}
                    </button>
                    <button className="btn btn-xs btn-primary" onClick={() => applyOne(i.id)} disabled={pending || i.status === 'applied'}>
                      {i.status === 'applied' ? 'Aplicada' : 'Aplicar'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
