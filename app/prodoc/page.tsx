// app/prodoc/page.tsx (versão com overlay de histórico)
// Use esta página apenas se quiser incluir já o botão flutuante de Histórico.
'use client'
import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'
import Canvas from '@/components/Canvas'
import ExameFisico from '@/components/ExameFisico'
import Observacoes from '@/components/Observacoes'
import Medicacoes from '@/components/Medicacoes'
import { useProdocStore } from '@/components/useProdocStore'
import { useEffect } from 'react'
import { applyPreset } from '@/components/theme/presets'
import BootstrapPersonalization from '@/app/prodoc/BootstrapPersonalization'
import HistoryOverlay from '@/components/history/HistoryOverlay'
import { ensureUserUpToDateAction } from '@/server/ensureUserUpToDateAction'

export default function ProdocPage(){
  const { state } = useProdocStore()
  useEffect(()=>{ try{ applyPreset(state.appearance as any) }catch{} }, [state.appearance])

  useEffect(()=>{ ensureUserUpToDateAction().catch(()=>{}) }, [])

  function renderMain(){
    if (state.activeKey === 'exame-fisico') return <ExameFisico />
    if (state.activeKey === 'observacoes-gerais') return <Observacoes />
    if (state.activeKey === 'med-unidade') return <Medicacoes />
    return <Canvas />
  }

  return (
    <BootstrapPersonalization>
      <div>
        <Topbar />
        <main className="grid md:grid-cols-[280px_1fr] gap-4 w-full min-h-screen px-4 py-4 bg-slate-50">
          <aside className="w-[280px] shrink-0 h-full bg-white shadow-sm border-r border-slate-200 rounded-xl">
        <Sidebar />
      </aside>
          <section className="flex-1 w-full min-w-0 overflow-hidden">{renderMain()}</section>
        </main>
        <HistoryOverlay />
      </div>
    </BootstrapPersonalization>
  )
}