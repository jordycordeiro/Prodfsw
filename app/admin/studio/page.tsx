// app/admin/studio/page.tsx
'use client'

import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'
import Canvas from '@/components/Canvas'
import ExameFisico from '@/components/ExameFisico'
import Observacoes from '@/components/Observacoes'
import Medicacoes from '@/components/Medicacoes'

import { useAdminComposer } from '@/stores/useAdminComposer'
import { useProdocStore } from '@/components/useProdocStore'
import { applyPreset } from '@/components/theme/presets'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2, CheckCircle2 } from 'lucide-react'

// ✅ VOLTAR para o RPC oficial (preenche admin_prescription_id corretamente)
import { publishBroadcast } from '@/server/actions/publish'

export default function AdminStudioPage() {
  const { state } = useProdocStore()
  const { saveDraft, takeFromCanvas } = useAdminComposer()

  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<'queixas'|'exame'|'medicacoes'|'patologia-adulto'>('queixas')
  const [sex, setSex] = useState<'A'|'M'|'F'>('A')
  const [note, setNote] = useState('')

  const [publishing, setPublishing] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    try { applyPreset(state.appearance as any) } catch {}
  }, [state.appearance])

  async function onSave() {
    const body = await takeFromCanvas()
    await saveDraft({ title, kind, sex }, body)
    toast.success('Rascunho salvo!')
  }

  function toBroadcastKind(k: typeof kind): 'template' | 'medication' | 'observation' | 'exam' {
    if (k === 'medicacoes') return 'medication'
    if (k === 'exame') return 'exam'
    if (k === 'queixas') return 'observation'
    return 'template'
  }

  async function onPublish() {
    try {
      setPublishing(true)
      const body = await takeFromCanvas()
      await saveDraft({ title, kind, sex }, body)

      const versionTag = new Date().toISOString().slice(0,10)
      const payload = { body, note, sex }
      const brKind = toBroadcastKind(kind)

      // 🔑 chama o RPC via action oficial (publish.ts)
      const id = await publishBroadcast({
        kind: brKind,
        title: title || 'Modelo sem título',
        payload,
        versionTag
      })

      setSuccess(true)
      toast.success(`Modelo publicado (ID: ${id})`)
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao publicar versão global')
    } finally {
      setPublishing(false)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  function renderMain(){
    if (state.activeKey === 'exame-fisico') return <ExameFisico />
    if (state.activeKey === 'observacoes-gerais') return <Observacoes />
    if (state.activeKey === 'med-unidade') return <Medicacoes />
    return <Canvas />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />
      <div className="container mx-auto px-3 py-4 grid grid-cols-12 gap-4">
        <aside className="col-span-12 md:col-span-3"><Sidebar /></aside>
        <main className="col-span-12 md:col-span-9">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2 rounded-2xl px-2 py-1 bg-white shadow-sm ring-1 ring-slate-200">
              <input className="title-input w-48" placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
              <select className="title-input" value={kind} onChange={e=>setKind(e.target.value as any)}>
                <option value="queixas">Queixas</option>
                <option value="exame">Exame Físico</option>
                <option value="medicacoes">Medicações</option>
                <option value="patologia-adulto">Patologias - Adulto</option>
              </select>
              <select className="title-input" value={sex} onChange={e=>setSex(e.target.value as any)}>
                <option value="A">Ambos</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <input className="title-input w-56" placeholder="Nota (opcional)" value={note} onChange={e=>setNote(e.target.value)} />
              <button className="btn" disabled={publishing} onClick={onSave}>Salvar rascunho</button>
              <button onClick={onPublish} disabled={publishing} className={`btn-warn flex items-center gap-1 ${success ? 'bg-green-600 text-white' : ''}`}>
                {publishing ? (<><Loader2 className="animate-spin" size={18} /> Publicando...</>) :
                 success ? (<><CheckCircle2 size={18} /> Publicado!</>) :
                 (<>Tornar Padrão</>)}
              </button>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200">Admin</span>
            </div>
          </div>
          {renderMain()}
        </main>
      </div>
    </div>
  )
}
