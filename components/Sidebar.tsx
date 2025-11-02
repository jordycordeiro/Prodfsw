'use client'

import { useState } from 'react'
import { useProdocStore, type MenuItem } from './useProdocStore'

export default function Sidebar() {
  const { state, setActive, createMainMenu } = useProdocStore()
  const items = state.menu

  // Pai atualmente aberto (apenas um). Inicia com o pai do activeKey se houver.
  const [openParent, setOpenParent] = useState<string | null>(() => {
    for (const it of items) {
      if (it.children?.some(c => c.key === state.activeKey)) return it.key
      if (it.key === state.activeKey && (it.children?.length ?? 0) > 0) return it.key
    }
    return null
  })

  return (
    <aside className="bg-white border rounded-2xl p-4 shadow-soft">
      {/* Busca */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          className="w-full h-12 rounded-2xl border bg-white pl-10 pr-3 text-[15px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 shadow-inner"
          placeholder="Pesquisar patologia (GECA, Asma...)" />
      </div>

      {/* Menus */}
      <div className="mt-3 flex flex-col gap-2" id="leftMenu">
        {items.map(mi => (
          <ParentItem
            key={mi.key}
            item={mi}
            activeKey={state.activeKey}
            isClosed={(mi.children?.length ?? 0) > 0 ? openParent !== mi.key : false}
            onToggle={() => {
              const hasChildren = (mi.children?.length ?? 0) > 0
              // Se estava fechado, abre este e fecha os outros
              if (openParent !== mi.key) {
                setOpenParent(hasChildren ? mi.key : null)
                if (hasChildren && mi.children && mi.children.length > 0) {
                  setActive(mi.children[0].key)
                } else {
                  setActive(mi.key)
                }
              } else {
                // Se estava aberto, recolhe
                setOpenParent(null)
                setActive(mi.key)
              }
            }}
            onSelectChild={(childKey) => {
              setActive(childKey)
              setOpenParent(mi.key) // garante que o pai desse filho fique aberto
            }}
          />
        ))}

        {/* Botão criar */}
        <button
          type="button"
          className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 transition text-white font-semibold rounded-xl py-2 shadow-soft"
          onClick={() => {
            const title = (prompt('Nome do novo menu (nível principal):', 'Nova patologia') || '').trim()
            if (title) createMainMenu(title)
          }}
        >
          Novo Bloco
        </button>
      </div>
    </aside>
  )
}

function ParentItem({
  item,
  activeKey,
  isClosed,
  onToggle,
  onSelectChild,
}: {
  item: MenuItem
  activeKey: string
  isClosed: boolean
  onToggle: () => void
  onSelectChild: (childKey: string) => void
}) {
  const hasChildren = (item.children?.length ?? 0) > 0
  const isTreeActive =
    activeKey === item.key || (item.children || []).some(c => c.key === activeKey)

  return (
    <div>
      {/* Botão pai */}
      <button
        type="button"
        onClick={onToggle}
        className={[
          'w-full text-left px-4 py-3 rounded-xl font-semibold transition flex items-center justify-between',
          isTreeActive ? 'bg-brand text-white shadow-soft' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
        ].join(' ')}
      >
        <span className="truncate">{item.title}</span>
        {hasChildren && (
          <svg
            className={`ml-3 h-4 w-4 shrink-0 transition-transform ${isClosed ? '' : 'rotate-90'}`}
            viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </button>

      {/* Subitens */}
      {hasChildren && (
        <div className={['pl-3 mt-2 flex flex-col gap-2 border-l-2 border-slate-200', isClosed ? 'hidden' : ''].join(' ')}>
          {item.children!.map((c) => {
            const isActiveChild = activeKey === c.key
            return (
              <button
                type="button"
                key={c.key}
                onClick={() => onSelectChild(c.key)}
                className={[
                  'text-left px-3 py-2 rounded-lg transition',
                  isActiveChild
                    ? 'bg-brand text-white shadow-soft'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100',
                ].join(' ')}
              >
                <span className="truncate">{c.title}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
