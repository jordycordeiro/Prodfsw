
'use client'
import { useProdocStore } from '../useProdocStore'
export default function SettingsPanel({ onClose }:{ onClose: ()=>void }){
  const { state, setAppearance, setProfileName, setPlan } = useProdocStore()
  return (
    <div className="absolute right-0 top-12 w-[520px] bg-white border rounded-2xl shadow-soft">
      <div className="border-b font-extrabold px-4 py-3">Configurações</div>
      <div className="p-4 space-y-3 max-h-[70vh] overflow-auto">
        <section className="border rounded-xl overflow-hidden">
          <details className="open:bg-white" open>
            <summary className="px-3 py-2 font-bold cursor-pointer">Editar perfil</summary>
            <div className="p-3 grid gap-2">
              <label className="text-sm text-slate-600">Nome de exibição</label>
              <input className="border rounded-lg px-3 py-2" defaultValue={state.profileName} onBlur={e=>setProfileName(e.currentTarget.value)} />
              <div className="flex justify-end">
                <button className="px-3 py-2 rounded-lg bg-brand text-white" onClick={onClose}>Salvar</button>
              </div>
            </div>
          </details>
        </section>
        <section className="border rounded-xl overflow-hidden">
          <details>
            <summary className="px-3 py-2 font-bold cursor-pointer">Plano de assinatura</summary>
            <div className="p-3 grid gap-2">
              <div className="flex items-center gap-4">
                <label><input type="radio" name="plan" defaultChecked={state.plan==='basico'} onChange={()=>setPlan('basico')} /> Básico</label>
                <label><input type="radio" name="plan" defaultChecked={state.plan==='pro'} onChange={()=>setPlan('pro')} /> Pro</label>
                <label><input type="radio" name="plan" defaultChecked={state.plan==='enterprise'} onChange={()=>setPlan('enterprise')} /> Enterprise</label>
              </div>
            </div>
          </details>
        </section>
        <section className="border rounded-xl overflow-hidden">
          <details open>
            <summary className="px-3 py-2 font-bold cursor-pointer">Aparência (Presets)</summary>
            <div className="p-3 flex items-center gap-3">
              <select value={state.appearance} className="border rounded-lg px-3 py-2" onChange={e=>{ const v=e.currentTarget.value; try{ localStorage.setItem("prodoc.appearance", v) }catch{}; if (typeof setAppearance==="function") setAppearance(v); }}>
                <option value="padrao">Padrão</option>
                <option value="altoContraste">Alto Contraste</option>
                <option value="clean">Clean</option>
                <option value="quadroAzul">Quadro Azul</option>
              </select>
              <button className="px-3 py-2 rounded-lg bg-brand text-white" onClick={onClose}>Aplicar</button>
            </div>
          </details>
        </section>
        <section className="border rounded-xl overflow-hidden">
          <details open>
            <summary className="px-3 py-2 font-bold cursor-pointer">Editor do menu lateral</summary>
            <MenuEditor />
          </details>
        </section>
      </div>
    </div>
  )
}
function MenuEditor(){
  const { state, createMainMenu, renameMenu, removeMenu } = useProdocStore()
  return (
    <div className="p-3">
      <div className="flex justify-end mb-2">
        <button className="btn" onClick={()=>{
          const title = prompt('Nome do novo menu principal:','Nova patologia')
          if (title) createMainMenu(title)
        }}>+ Novo menu principal</button>
      </div>
      <div className="space-y-2">
        {state.menu.map(m=>(
          <div key={m.key} className="border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <input className="border rounded px-2 py-1 flex-1" defaultValue={m.title} onBlur={e=>renameMenu(m.key, e.currentTarget.value)} />
              <button className="icon-btn" title="Apagar menu" onClick={()=>{
                if (confirm('Apagar este menu e todos os submenus?')) removeMenu(m.key)
              }}>🗑️</button>
            </div>
            {!!m.children?.length && (
              <div className="pl-4 mt-2 space-y-1">
                {m.children.map(c=>(
                  <div key={c.key} className="flex items-center gap-2">
                    <input className="border rounded px-2 py-1 flex-1" defaultValue={c.title} onBlur={e=>renameMenu(c.key, e.currentTarget.value)} />
                    <button className="icon-btn" title="Apagar submenu" onClick={()=>removeMenu(c.key)}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
