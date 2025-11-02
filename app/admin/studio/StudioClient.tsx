'use client'
import React, { useEffect } from 'react'
import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'
import Canvas from '@/components/Canvas'
import ExameFisico from '@/components/ExameFisico'
import Observacoes from '@/components/Observacoes'
import Medicacoes from '@/components/Medicacoes'
import { AdminSwitch } from '@/components/admin/AdminSwitch'
import { useProdocStore } from '@/components/useProdocStore'
import { useAdminComposer } from '@/stores/useAdminComposer'
import { applyPreset } from '@/components/theme/presets'

export default function StudioClient(){
  const { state } = useProdocStore()
  const { takeFromCanvas, saveDraft, publish } = useAdminComposer()

  useEffect(()=>{ try { applyPreset(state.appearance as any) } catch {} }, [state.appearance])

  async function handleSaveDraft(){ 
    const body = await takeFromCanvas()
    await saveDraft({ title: 'Modelo Padrão', kind: 'admin' }, body)
  }
  async function handlePublish(){ await publish('Atualização do modelo padrão') }

  function renderMain(){
    if (state.activeKey === 'exame-fisico') return <ExameFisico />
    if (state.activeKey === 'observacoes-gerais') return <Observacoes />
    if (state.activeKey === 'med-unidade') return <Medicacoes />
    return <Canvas />
  }

  return (
    <div>
      <Topbar />
      <main className="container grid md:grid-cols-[280px_1fr] gap-4 px-4 py-4">
        <Sidebar />
        <div className="relative">
          <AdminSwitch onSaveDraft={handleSaveDraft} onPublish={handlePublish} />
          {renderMain()}
        </div>
      </main>
    </div>
  )
}
