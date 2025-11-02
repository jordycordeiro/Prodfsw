// components/admin/AdminPage.tsx
'use client'

import { useEffect, useState } from 'react'
import { listTemplates, upsertTemplate, publishTemplate, listTemplateVersions, saveTemplateVersion } from '@/app/admin/actions'

type Tmpl = {
  id?: string
  slug: string
  title: string
  kind: string
  default_parent?: string | null
  default_submenu?: string | null
  status?: 'draft' | 'published' | 'archived'
  version?: number
  // aceitamos tanto body (texto puro) quanto content (json)
  body?: string
  content?: any
}

type Tab = 'texto' | 'avancado'

export default function AdminPage() {
  const [items, setItems] = useState<Tmpl[]>([])
  const [editing, setEditing] = useState<Tmpl | null>(null)
  const [versions, setVersions] = useState<any[]>([])
  const [note, setNote] = useState('')
  const [tab, setTab] = useState<Tab>('texto')

  async function refresh() {
    const rows = await listTemplates()
    setItems(rows as any)
  }

  useEffect(() => { refresh() }, [])

  async function onEdit(t?: Tmpl) {
    const base: Tmpl = t ?? {
      slug: '',
      title: '',
      kind: 'patologia-adulto',
      status: 'draft',
      version: 1,
      body: ''
    }
    // se vier content json e não houver body, preenche body com content.body ou string do JSON
    const body = base.body ?? (typeof (base as any).content === 'object'
      ? ((base as any).content?.body ?? JSON.stringify((base as any).content, null, 2))
      : (typeof (base as any).content === 'string' ? (base as any).content : ''))
    setEditing({ ...base, body })
    if (t?.id) {
      const vs = await listTemplateVersions(t.id)
      setVersions(vs as any)
    } else {
      setVersions([])
    }
    setTab('texto')
  }

  async function onSave() {
    if (!editing) return
    // sempre mandamos body (texto) e também um content normalizado
    const payload = {
      ...editing,
      body: editing.body ?? '',
      content: normalizeContent(editing)
    }
    const saved = await upsertTemplate(payload)
    setEditing(saved as any)
    await refresh()
    alert('Template salvo.')
  }

  async function onSaveVersion() {
    if (!editing?.id || !editing?.version) return
    const normalized = normalizeContent(editing)
    await saveTemplateVersion(editing.id, editing.version, normalized, 'checkpoint')
    const vs = await listTemplateVersions(editing.id)
    setVersions(vs as any)
    alert('Versão registrada.')
  }

  async function onPublish() {
    if (!editing?.id || !editing?.version) return
    await publishTemplate(editing.id, editing.version, note)
    alert('Publicado para todos os usuários (inbox criada).')
  }

  function normalizeContent(t: Tmpl) {
    // conteúdo padronizado para payloads: { title, body }
    const fromJson = ((): any => {
      const c = (t as any).content
      if (!c) return null
      if (typeof c === 'string') {
        try { return JSON.parse(c) } catch { return { body: c } }
      }
      if (typeof c === 'object') return c
      return null
    })()
    const body = (t.body ?? fromJson?.body ?? '').toString()
    const title = t.title || fromJson?.title || 'Card'
    return { title, body }
  }

  return (
    <div className="p-6 grid grid-cols-12 gap-6">
      <div className="col-span-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cards (Templates)</h2>
          <button className="btn" onClick={() => onEdit()}>+ Novo</button>
        </div>
        <div className="space-y-2">
          {items.map(t => (
            <div key={t.id} className="p-3 rounded-2xl shadow bg-white flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-xs opacity-70">{t.slug} · v{t.version ?? 1} · {t.status ?? 'draft'}</div>
              </div>
              <button className="btn-chip" onClick={() => onEdit(t)}>Editar</button>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-8">
        {editing ? (
          <div className="rounded-2xl shadow bg-white p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">Slug
                <input className="title-input w-full" value={editing.slug}
                       onChange={e => setEditing({ ...editing, slug: e.target.value })} />
              </label>
              <label className="text-sm">Título
                <input className="title-input w-full" value={editing.title}
                       onChange={e => setEditing({ ...editing, title: e.target.value })} />
              </label>
              <label className="text-sm">Kind
                <select className="title-input w-full" value={editing.kind}
                        onChange={e => setEditing({ ...editing, kind: e.target.value })}>
                  <option value="patologia-adulto">Patologias - Adulto</option>
                  <option value="queixas">Queixas Gerais</option>
                  <option value="exame">Exame Físico</option>
                  <option value="medicacoes">Medicações na Unidade</option>
                </select>
              </label>
              <label className="text-sm">Versão
                <input type="number" className="title-input w-full" value={editing.version ?? 1}
                       onChange={e => setEditing({ ...editing, version: Number(e.target.value) })} />
              </label>
              <label className="text-sm">Menu (sugestão)
                <input className="title-input w-full" value={editing.default_parent ?? ''}
                       onChange={e => setEditing({ ...editing, default_parent: e.target.value })} />
              </label>
              <label className="text-sm">Submenu (sugestão)
                <input className="title-input w-full" value={editing.default_submenu ?? ''}
                       onChange={e => setEditing({ ...editing, default_submenu: e.target.value })} />
              </label>
            </div>

            {/* Abas do editor */}
            <div className="flex gap-2 mt-3">
              <button className={'btn-chip ' + (tab === 'texto' ? 'ring-2 ring-sky-400' : '')} onClick={() => setTab('texto')}>Texto</button>
              <button className={'btn-chip ' + (tab === 'avancado' ? 'ring-2 ring-sky-400' : '')} onClick={() => setTab('avancado')}>Avançado (JSON)</button>
            </div>

            {tab === 'texto' ? (
              <label className="text-sm block">Texto da prescrição
                <textarea
                  className="title-input w-full h-56"
                  placeholder="Escreva o corpo da prescrição aqui (texto puro)"
                  value={editing.body ?? ''}
                  onChange={e => setEditing({ ...editing, body: e.target.value })}
                />
                <p className="text-xs text-slate-500 mt-1">Dica: o título do card fica no campo Título acima. O texto é salvo como corpo.</p>
              </label>
            ) : (
              <label className="text-sm block">Conteúdo (JSON)
                <textarea
                  className="title-input w-full h-56 font-mono"
                  value={safeStringify(editing.content ?? normalizeContent(editing))}
                  onChange={e => {
                    let parsed: any = e.target.value
                    try { parsed = JSON.parse(e.target.value) } catch {}
                    setEditing({ ...editing, content: parsed })
                  }}
                />
              </label>
            )}

            <div className="flex gap-2">
              <button className="btn" onClick={onSave}>Salvar</button>
              <button className="btn" onClick={onSaveVersion}>Salvar como versão</button>
              <input placeholder="Nota da publicação" className="title-input w-56" value={note} onChange={e => setNote(e.target.value)} />
              <button className="btn-warn" onClick={onPublish}>Publicar</button>
            </div>

            <div>
              <div className="font-semibold mt-4 mb-2">Histórico</div>
              <ul className="text-sm list-disc ml-6">
                {versions.map(v => (
                  <li key={v.id}>v{v.version} · {new Date(v.created_at).toLocaleString()} {v.changelog ? `· ${v.changelog}` : ''}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="opacity-60">Selecione um card para editar</div>
        )}
      </div>
    </div>
  )
}

function safeStringify(v: any) {
  try { return JSON.stringify(v, null, 2) } catch { return String(v ?? '') }
}
