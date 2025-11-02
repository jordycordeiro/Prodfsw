'use client'

import { useEffect, useState } from 'react'
import { listCardsBySubmenu, listSubmenus } from '@/app/(app)/admin/data'
import ExameFisico from '@/components/ExameFisico'

type Menu = { id: string; title: string; slug?: string | null }
type Submenu = { id: string; title: string }
type Card = { id: string; title: string | null; content_md?: string | null }

/** Resolve tipo pelo slug/título do menu */
function resolveKind(m: Menu): 'exame' | 'observacoes' | 'medicacoes' | 'patologias_adulto' | 'patologias_pediatria' | 'outros' {
  const key = (m.slug || m.title || '').toLowerCase()
  if (key.includes('exame')) return 'exame'
  if (key.includes('queixa') || key.includes('observ')) return 'observacoes'
  if (key.includes('medica')) return 'medicacoes'
  if (key.includes('patolog') && (key.includes('adult') || key.includes('adulto'))) return 'patologias_adulto'
  if (key.includes('patolog') && (key.includes('pedi') || key.includes('pediatria'))) return 'patologias_pediatria'
  return 'outros'
}

/** Lista visual dos cards (igual ao usuário: barra azul + card gelo) */
function CardsList({ cards }: { cards: Card[] }) {
  if (!cards.length) {
    return <div className="opacity-60 px-4 py-6">Nenhum card neste submenu.</div>
  }
  return (
    <div className="p-2 grid grid-cols-1 gap-3">
      {cards.map(c => (
        <article key={c.id} className="rounded-2xl border shadow-sm">
          <div className="title-bar px-4 py-3 rounded-t-2xl text-white font-semibold">
            {c.title || 'Sem título'}
          </div>
          <div className="bg-gray-50 rounded-b-2xl p-4">
            {c.content_md ? (
              <pre className="whitespace-pre-wrap text-[13px] leading-5">
                {c.content_md}
              </pre>
            ) : (
              <div className="opacity-60 text-sm">Sem conteúdo.</div>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

export default function ComposerShell({ menus }: { menus: Menu[] }) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(menus[0]?.id ?? null)

  // submenus e filtro atual
  const [submenus, setSubmenus] = useState<Submenu[]>([])
  const [activeSubmenuId, setActiveSubmenuId] = useState<string>('')

  // cards do submenu escolhido
  const [cards, setCards] = useState<Card[]>([])
  const [loadingSubs, setLoadingSubs] = useState(false)
  const [loadingCards, setLoadingCards] = useState(false)

  const activeMenu = menus.find(m => m.id === activeMenuId) || null
  const kind = activeMenu ? resolveKind(activeMenu) : 'outros'

  // quando troca o menu → carregar submenus (exceto Exame Físico que é especial)
  useEffect(() => {
    let cancelled = false
    async function loadSubmenus() {
      if (!activeMenu) return
      if (resolveKind(activeMenu) === 'exame') {
        setSubmenus([])
        setActiveSubmenuId('')
        return
      }
      setLoadingSubs(true)
      try {
        const rows = await listSubmenus(activeMenu.id)
        if (!cancelled) {
          setSubmenus(rows as any)
          setActiveSubmenuId(rows?.[0]?.id ?? '') // pré-seleciona o primeiro
        }
      } finally {
        if (!cancelled) setLoadingSubs(false)
      }
    }
    loadSubmenus()
    return () => { cancelled = true }
  }, [activeMenuId])

  // quando escolher submenu → carregar cards
  useEffect(() => {
    let cancelled = false
    async function loadCards() {
      if (!activeSubmenuId) {
        setCards([])
        return
      }
      setLoadingCards(true)
      try {
        const rows = await listCardsBySubmenu(activeSubmenuId)
        if (!cancelled) {
          setCards(
            (rows ?? []).map((r: any) => ({
              id: r.id,
              title: r.title,
              content_md: r.content_md ?? '',
            }))
          )
        }
      } finally {
        if (!cancelled) setLoadingCards(false)
      }
    }
    loadCards()
    return () => { cancelled = true }
  }, [activeSubmenuId])

  return (
    <div className="grid grid-cols-[360px,1fr] gap-4">
      {/* Sidebar de menus */}
      <aside className="space-y-2">
        <div className="relative">
          <input className="w-full title-input pl-10" placeholder="Pesquisar…" disabled />
          <span className="absolute left-3 top-2.5 opacity-50">🔎</span>
        </div>
        {menus.map(m => {
          const isActive = m.id === activeMenuId
          return (
            <button
              key={m.id}
              onClick={() => setActiveMenuId(m.id)}
              className={`w-full text-left rounded-lg px-4 py-3 border transition
                ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'}`}
            >
              {m.title}
            </button>
          )
        })}
      </aside>

      {/* Canvas */}
      <main>
        {/* Sua topbar (Título / Tipo / Sexo / Nota / Salvar / Publicar) permanece aqui */}
        {/* … */}

        {!activeMenu && (
          <div className="opacity-60 px-4 py-6">Selecione um item na barra lateral para começar.</div>
        )}

        {/* Exame Físico → blocos especiais */}
        {activeMenu && kind === 'exame' && <ExameFisico />}

        {/* Observações / Medicações / Patologias Adulto / Patologias Pediatria → dropdown de submenus + cards */}
        {activeMenu && kind !== 'exame' && (
          <div className="space-y-3">
            {/* Dropdown de submenus */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium min-w-[140px]">Selecionar submenu</label>
              {loadingSubs ? (
                <div className="animate-pulse h-10 w-64 bg-gray-100 rounded" />
              ) : (
                <select
                  className="title-input w-64"
                  value={activeSubmenuId}
                  onChange={(e) => setActiveSubmenuId(e.target.value)}
                >
                  {submenus.length === 0 && <option value="">— sem submenus —</option>}
                  {submenus.map(sm => (
                    <option key={sm.id} value={sm.id}>{sm.title}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Cards do submenu escolhido */}
            {loadingCards ? (
              <div className="space-y-3 p-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl border p-3">
                    <div className="h-6 w-48 bg-gray-200 rounded mb-3" />
                    <div className="h-20 w-full bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <CardsList cards={cards} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
