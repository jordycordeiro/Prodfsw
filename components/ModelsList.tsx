
'use client'
import { SimpleModel } from '@/components/useProdocStore'
export default function ModelsList({ title, items, onAdd, onUpdate, onDelete, onToggle, onCopy, onSave, onSync }:{
  title: string,
  items: SimpleModel[],
  onAdd: ()=>void,
  onUpdate: (id:string, patch: Partial<SimpleModel>)=>void,
  onDelete: (id:string)=>void,
  onToggle: (id:string, v?: boolean)=>void,
  onCopy: ()=>void,
  onSave?: ()=>void,
  onSync?: ()=>void
}){
  return (
    <section className="bg-white border rounded-2xl shadow-soft p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="font-bold">{title}</div>
        <div className="ml-auto flex gap-2">
          <button className="btn" onClick={onAdd}>+ Adicionar</button>
          <button className="btn" onClick={onCopy}>Copiar selecionados</button>
          {onSave && <button className="btn" onClick={onSave}>Salvar</button>}
          {onSync && <button className="btn" onClick={onSync}>Sincronizar</button>}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map(m=>(
          <div key={m.id} className="rounded-xl border p-3 bg-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={!!m.selected} onChange={e=>onToggle(m.id, e.currentTarget.checked)} />
              <input className="flex-1 border rounded px-2 py-1 text-sm" defaultValue={m.title} onBlur={e=>onUpdate(m.id, { title: e.currentTarget.value })} />
              <button className="icon-btn" title="Copiar só este" onClick={async()=>{ try{ await navigator.clipboard.writeText(m.content||"") }catch(e){ alert("Falha ao copiar") } }}>📋</button>
              <button className="icon-btn" onClick={()=>onDelete(m.id)}>🗑️</button>
            </div>
            <textarea className="w-full rounded-md px-2 py-2 text-sm h-28" defaultValue={m.content} onBlur={e=>onUpdate(m.id, { content: e.currentTarget.value })} />
          </div>
        ))}
      </div>
    </section>
  )
}
