// components/history/HistoryOverlay.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useProdocStore } from '@/components/useProdocStore'
import { ensurePrescriptionId, listPrescriptionVersions, getPrescriptionVersion, rollbackPrescription } from '@/app/(app)/prescriptions/actions'

type Item = { id:string; version:number; message:string|null; created_at:string }

function deriveScopeAndSubmenu(activeKey: string): { scope: string, submenu: string|null } {
  if (activeKey === 'exame-fisico') return { scope: 'exame_fisico', submenu: null }
  if (activeKey === 'observacoes-gerais') return { scope: 'observacoes', submenu: null }
  if (activeKey === 'med-unidade') return { scope: 'medicacoes', submenu: null }
  // por padrão, trate como patologia sob o próprio key
  return { scope: 'patologia', submenu: activeKey || null }
}

export default function HistoryOverlay(){
  const { state } = useProdocStore()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [prescId, setPrescId] = useState<string | null>(null)

  const { scope, submenu } = useMemo(() => deriveScopeAndSubmenu(state.activeKey), [state.activeKey])
  const title = useMemo(() => state?.pages?.[state.activeKey]?.title || state.activeKey || 'Sem título', [state])

  async function refresh(){
    setLoading(true)
    try {
      const content_json = state?.pages?.[state.activeKey] ?? null
      const id = prescId || await ensurePrescriptionId({ scope, submenu, title, content_json })
      setPrescId(id)
      const list = await listPrescriptionVersions(id) as Item[]
      setItems(list || [])
    } finally {
      setLoading(false)
    }
  }

  async function onRollback(v: number){
    if (!prescId) return
    await rollbackPrescription(prescId, v, 'rollback via overlay')
    await refresh()
  }

  useEffect(() => { if (open) refresh() }, [open, state.activeKey])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full px-4 py-2 shadow-lg ring-1 ring-slate-300 bg-white hover:bg-slate-50 text-sm font-medium"
        title="Histórico de versões desta prescrição"
      >
        Histórico
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:w-[640px] max-h-[85vh] rounded-2xl shadow-xl ring-1 ring-slate-200 overflow-hidden">
            <div className="title-bar px-4 py-2 flex items-center">
              <div className="font-semibold">Histórico — {title}</div>
              <div className="ml-auto">
                <button className="btn-chip" onClick={() => setOpen(false)}>Fechar</button>
              </div>
            </div>
            <div className="p-4 space-y-2 overflow-auto" style={{maxHeight:'70vh'}}>
              {loading ? <div>Carregando...</div> : (
                items.length ? items.map(it => (
                  <div key={it.id} className="flex items-center gap-2 rounded-lg px-3 py-2 bg-slate-50 ring-1 ring-slate-200">
                    <div className="font-mono text-xs">v{it.version}</div>
                    <div className="text-sm">{it.message || 'autosave'}</div>
                    <div className="text-xs text-slate-500 ml-auto">{new Date(it.created_at).toLocaleString()}</div>
                    <button className="btn" onClick={() => onRollback(it.version)}>Reverter</button>
                  </div>
                )) : <div className="text-sm text-slate-500">Sem versões ainda — edite e salve para começar o histórico.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
