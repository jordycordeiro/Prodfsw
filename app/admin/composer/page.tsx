// app/admin/composer/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Canvas from '@/components/Canvas' // reusa o mesmo Canvas do usuário
import { useAdminComposer } from '@/stores/useAdminComposer'

type Meta = { title: string; kind: 'queixas' | 'exame' | 'medicacoes' | 'patologia-adulto'; sex: 'A' | 'M' | 'F' }

export default function AdminComposerPage() {
  const [meta, setMeta] = useState<Meta>({ title: '', kind: 'queixas', sex: 'A' })
  const [body, setBody] = useState('')
  const { takeFromCanvas, saveDraft, publish, resetCanvas } = useAdminComposer()

  useEffect(() => { resetCanvas() }, [resetCanvas])

  return (
    <div className="p-5 space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input className="title-input w-56" placeholder="Título do card" value={meta.title}
               onChange={e => setMeta({ ...meta, title: e.target.value })} />
        <select className="title-input" value={meta.kind} onChange={e => setMeta({ ...meta, kind: e.target.value as any })}>
          <option value="queixas">Queixas Gerais</option>
          <option value="exame">Exame Físico</option>
          <option value="medicacoes">Medicações na Unidade</option>
          <option value="patologia-adulto">Patologias - Adulto</option>
        </select>
        <select className="title-input" value={meta.sex} onChange={e => setMeta({ ...meta, sex: e.target.value as any })}>
          <option value="A">Ambos</option><option value="M">Masculino</option><option value="F">Feminino</option>
        </select>

        <button className="btn" onClick={async () => {
          const text = await takeFromCanvas()
          setBody(text)
        }}>Pegar do Canvas</button>

        <button className="btn" onClick={async () => {
          await saveDraft(meta, body)
          alert('Rascunho salvo')
        }}>Salvar rascunho</button>

        <button className="btn-warn" onClick={async () => {
          await saveDraft(meta, body)
          await publish('Atualização do admin')
          alert('Publicado para os usuários')
        }}>Publicar</button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-7">
          <Canvas />
        </div>
        <div className="col-span-5">
          <label className="text-sm block">Texto da prescrição (será enviado aos usuários)
            <textarea className="title-input w-full h-[520px]" placeholder="Cole aqui o texto (ou clique em Pegar do Canvas)"
                      value={body} onChange={e => setBody(e.target.value)} />
          </label>
        </div>
      </div>
    </div>
  )
}
