'use client'
import '@/lib/alertToToast'
import { useProdocStore } from '@/components/useProdocStore'
import { useState } from 'react'

export default function ExameFisico(){
  const { state, setExamGender, updateExamSection, addExamExtra, updateExamExtra, removeExamExtra } = useProdocStore()
  const g = state.exam?.gender as any
  const blk = (state.exam as any)?.[g] as { geral: string; ar: string; acv: string; abd: string; mmii: string; extras?: any[] }
  const [editing, setEditing] = useState(false)

  if (!state.exam){
    return (
      <section className="bg-white border rounded-2xl shadow-soft p-4">
        <div className="font-bold mb-2">Exame Físico</div>
        <p className="text-sm text-slate-600">Inicializando blocos de exame…</p>
      </section>
    )
  }

  const copySection = async (label: string, value: string) => {
    await navigator.clipboard.writeText(`${label}: ${value}`)
    alert("Copiado")
  }
  const copyAll = async () => {
    const base = [
      `Geral: ${blk.geral}`,
      `AR: ${blk.ar}`,
      `ACV: ${blk.acv}`,
      `ABD: ${blk.abd}`,
      `MMII: ${blk.mmii}`,
    ]
    const ext = (blk.extras||[]).map((e:any)=> `${e.label}: ${e.value}`)
    await navigator.clipboard.writeText([...base, ...ext].join('\n'))
    alert("Copiado")
  }

  return (
    <section className="bg-white border rounded-2xl shadow-soft p-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="ml-2">
          <div className="inline-flex rounded-xl overflow-hidden border divide-x" role="group" aria-label="Sexo">
            <button type="button"
              className={`px-3 py-2 text-sm font-semibold flex items-center gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${g==='masculino' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
              onClick={()=>setExamGender('masculino')} aria-pressed={g==='masculino'}>
              <span aria-hidden>♂</span><span>Masculino</span>
            </button>
            <button type="button"
              className={`px-3 py-2 text-sm font-semibold flex items-center gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${g==='feminino' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
              onClick={()=>setExamGender('feminino')} aria-pressed={g==='feminino'}>
              <span aria-hidden>♀</span><span>Feminino</span>
            </button>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button className="btn" onClick={copyAll}>Copiar exame inteiro</button><button className={`btn ${editing?'bg-brand text-white':''}`} onClick={()=>setEditing(v=>!v)}>{editing? 'Sair do modo edição':'Editar todos os blocos'}</button>
          {editing && <button className="btn" onClick={()=>addExamExtra('Outro')}>+ Adicionar bloco</button>}
          
        </div>
      </div>

      {/* grid único + denso */}
      <div className="grid md:grid-cols-2 grid-flow-row-dense gap-3">
        <ExameRow label="Geral" value={blk.geral} editing={editing} onEdit={v=>updateExamSection('geral', v)} onCopy={()=>copySection('Geral', blk.geral)} />
        <ExameRow label="AR" value={blk.ar} editing={editing} onEdit={v=>updateExamSection('ar', v)} onCopy={()=>copySection('AR', blk.ar)} />
        <ExameRow label="ACV" value={blk.acv} editing={editing} onEdit={v=>updateExamSection('acv', v)} onCopy={()=>copySection('ACV', blk.acv)} />
        <ExameRow label="ABD" value={blk.abd} editing={editing} onEdit={v=>updateExamSection('abd', v)} onCopy={()=>copySection('ABD', blk.abd)} />
        <ExameRow label="MMII" value={blk.mmii} editing={editing} onEdit={v=>updateExamSection('mmii', v)} onCopy={()=>copySection('MMII', blk.mmii)} />

        {(blk.extras||[]).map((extra:any)=>(
          <div key={extra.id} className="rounded-xl border p-3 bg-slate-50 relative min-h-[140px]">
            {/* impedir blur concorrente + persistir remoção */}
            {editing && (<button
              className="icon-btn absolute right-2 top-2"
              title="Remover"
              onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation() }}
              onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); removeExamExtra(extra.id) }}
            >🗑️</button>)}
            <div className="flex items-center gap-2 mb-2">
              {editing ? (
                <input className="font-extrabold text-[13px] uppercase tracking-wide border rounded px-2 py-1"
                  defaultValue={extra.label} onBlur={e=>updateExamExtra(extra.id, { label: e.currentTarget.value })} />
              ) : (
                <div className="font-extrabold text-[13px] uppercase tracking-wide">{extra.label}</div>
              )}
              <button className="ml-auto btn" onClick={()=>copySection(extra.label, extra.value)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/></svg></button>
            </div>
            {editing
              ? <textarea className="w-full rounded-md px-2 py-2 h-28" defaultValue={extra.value} onBlur={e=>updateExamExtra(extra.id, { value: e.currentTarget.value })} />
              : <p className="text-[14px] font-semibold text-slate-800 whitespace-pre-wrap leading-relaxed">{extra.value}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

function ExameRow({ label, value, editing, onEdit, onCopy }:{ label: string, value: string, editing: boolean, onEdit:(v:string)=>void, onCopy:()=>void }){
  return (
    <div className="rounded-xl border p-3 bg-slate-50 min-h-[140px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="font-extrabold text-[13px] uppercase tracking-wide">{label}</div>
        <button className="ml-auto icon-btn" title="Copiar" aria-label="Copiar bloco" onClick={onCopy}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/></svg></button>
      </div>
      {editing
        ? <textarea className="w-full rounded-md px-2 py-2 h-28" defaultValue={value} onBlur={e=>onEdit(e.currentTarget.value)} />
        : <p className="text-[14px] font-semibold text-slate-800 whitespace-pre-wrap leading-relaxed">{value}</p>}
    </div>
  )
}
