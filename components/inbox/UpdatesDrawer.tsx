'use client'

import { useEffect, useState, useTransition } from 'react'
import { getInbox, markInboxAllRead, markInboxRead, applyInbox } from '@/app/(app)/inbox/actions'

type Props = {
  open: boolean
  onClose: () => void
}

type Row = {
  id: string
  template_id: string | null
  note: string
  status: 'unread' | 'read' | 'applied' | string
  created_at: string
  read_at: string | null
  applied_at: string | null
}

export default function UpdatesDrawer({ open, onClose }: Props) {
  const [items, setItems] = useState<Row[] | null>(null)
  const [pending, start] = useTransition()

  useEffect(() => {
    if (!open) return
    start(async () => {
      try {
        const rows = (await getInbox()) as Row[]
        setItems(rows)
      } catch (e) {
        console.error(e)
        setItems([])
      }
    })
  }, [open])

  function statusBadge(i: Row) {
    if (i.applied_at || i.status === 'applied') return <span className="badge badge-success">Aplicada</span>
    if (i.read_at || i.status === 'read') return <span className="badge">Lida</span>
    return <span className="badge badge-error">Nova</span>
  }

  async function handleMarkAll() {
    start(async () => {
      await markInboxAllRead()
      setItems((it) => it?.map(i => ({ ...i, read_at: i.read_at ?? new Date().toISOString(), status: i.status === 'applied' ? i.status : 'read' })) ?? null)
    })
  }

  async function handleMarkOne(id: string) {
    start(async () => {
      await markInboxRead(id)
      setItems((it) => it?.map(i => i.id === id ? { ...i, read_at: i.read_at ?? new Date().toISOString(), status: i.status === 'applied' ? i.status : 'read' } : i) ?? null)
    })
  }

  async function handleApply(id: string) {
    start(async () => {
      await applyInbox(id)
      setItems((it) => it?.map(i => i.id === id ? { ...i, applied_at: new Date().toISOString(), status: 'applied', read_at: i.read_at ?? new Date().toISOString() } : i) ?? null)
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* fundo */}
      <button className="absolute inset-0 bg-black/30" onClick={onClose} aria-label="Fechar notificações" />

      {/* drawer */}
      <div className="absolute right-0 top-0 h-full w-[440px] bg-white shadow-2xl border-l p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Atualizações</h3>
          <div className="flex gap-2">
            <button className="btn btn-sm" onClick={handleMarkAll} disabled={pending}>Marcar todas</button>
            <button className="btn btn-sm btn-ghost" onClick={onClose}>Fechar</button>
          </div>
        </div>

        {!items && <div className="text-sm opacity-60">Carregando…</div>}
        {items?.length === 0 && <div className="text-sm opacity-60">Sem notificações</div>}

        <ul className="space-y-2 overflow-auto">
          {items?.map(i => (
            <li key={i.id} className="border rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="mt-1">🔔</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium truncate">{i.note}</div>
                    {statusBadge(i)}
                  </div>
                  <div className="text-xs opacity-60 mt-1">{new Date(i.created_at).toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button className="btn btn-xs" onClick={() => handleMarkOne(i.id)} disabled={pending || !!i.read_at}>Marcar lida</button>
                <button className="btn btn-xs btn-primary" onClick={() => handleApply(i.id)} disabled={pending || i.status === 'applied'}>Aplicar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
