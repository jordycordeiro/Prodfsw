/**
 * Prodoc theme presets — LIGHT ONLY (remove 'escuro').
 * Clean e Quadro Azul incluídos. Nunca usa data-theme="dark".
 */
export type PresetName = 'padrao' | 'altoContraste' | 'clean' | 'quadroAzul'

export const PRESETS: Record<PresetName, Record<string,string>> = {
  padrao: {
    '--brand':   '#0a70c7',
    '--brand-2': '#1e40af',
    '--brand-3': '#2563eb',
    '--text':    '#0f172a',
    '--muted':   '#64748b',
    '--line':    'rgba(10,112,199,.15)',
    '--shadow':  '0 18px 44px rgba(2,80,200,.10)',
    '--ice-bg':  '#eef5ff',
    '--ice-border':'#dbe9ff',
  },
  altoContraste: {
    '--brand':   '#111827',
    '--brand-2': '#111827',
    '--brand-3': '#000000',
    '--text':    '#000000',
    '--muted':   '#1f2937',
    '--line':    'rgba(0,0,0,.25)',
    '--shadow':  '0 18px 44px rgba(0,0,0,.20)',
    '--ice-bg':  '#f2f2f2',
    '--ice-border':'#cfcfcf',
  },
  clean: {
    '--brand':   '#0ea5e9',
    '--brand-2': '#0284c7',
    '--brand-3': '#38bdf8',
    '--text':    '#0f172a',
    '--muted':   '#64748b',
    '--line':    'rgba(14,165,233,.20)',
    '--shadow':  '0 18px 44px rgba(14,165,233,.12)',
    '--ice-bg':  '#eef7ff',
    '--ice-border':'#d8ebff',
  },
  quadroAzul: {
    '--brand':   '#1d4ed8',
    '--brand-2': '#1e40af',
    '--brand-3': '#3b82f6',
    '--text':    '#0f172a',
    '--muted':   '#475569',
    '--line':    'rgba(29,78,216,.20)',
    '--shadow':  '0 18px 44px rgba(29,78,216,.12)',
    '--ice-bg':  '#eaf3ff',
    '--ice-border':'#d7e6ff',
  }
}

function normalize(name: any): PresetName{
  if (!name) return 'padrao'
  const key = String(name).toLowerCase().replace(/[^a-z]/g,'')
  if (['padrao','default','normal'].includes(key)) return 'padrao'
  if (['altocontraste','contraste','alto'].includes(key)) return 'altoContraste'
  if (['clean','limpo','claro'].includes(key)) return 'clean'
  if (['quadroazul','azul','quadro'].includes(key)) return 'quadroAzul'
  return 'padrao'
}

/** Aplica preset sem nunca ativar data-theme="dark". */
export function applyPreset(name: any){
  if (typeof window === 'undefined') return
  const effective = normalize(name)
  const vars = PRESETS[effective]
  const root = document.documentElement
  root.removeAttribute('data-theme')
  for (const [k,v] of Object.entries(vars)) {
    root.style.setProperty(k, v)
  }
}
