'use client'
import { useState } from 'react'
import SettingsPanel from './panels/SettingsPanel'
import { useProdocStore } from './useProdocStore'
import Link from 'next/link'
import TopbarBell from './TopbarBell'

export default function Topbar(){
  const [open, setOpen] = useState(false)
  const { state } = useProdocStore()

  return (
    <header className="sticky top-0 z-50 bg-white/80 border-b backdrop-blur no-print">
      <div className="flex items-center justify-between gap-3 px-3 py-3 w-full">
        
        {/* === LOGO (agora mais à esquerda) === */}
        <Link href="/" className="flex items-center gap-2 select-none ml-0">
          <span className="inline-grid place-items-center w-8 h-8 rounded-full bg-blue-600 text-white shadow-soft ring-1 ring-blue-500/30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </span>
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ 
              background: 'linear-gradient(90deg,#1580ff,#1e3a8a)',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Prodoc
          </span>
        </Link>

        {/* === PAINEL DE AÇÕES (sino, configurações, perfil) === */}
        <div className="flex items-center gap-3 ml-auto">
          <TopbarBell />

          <button
            onClick={() => setOpen(v => !v)}
            className="w-10 h-10 btn-neumo grid place-items-center text-slate-600"
            data-gear
          >
            <span className="sr-only">Configurações</span>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none">
              <path d="M7 9h10M7 12h10M7 15h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {open && <SettingsPanel onClose={() => setOpen(false)} />}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-300 to-blue-600" />
            <div className="text-sm">{state.profileName}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
