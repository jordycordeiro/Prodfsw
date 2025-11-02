'use client'

/**
 * Normaliza o preset salvo como 'escuro' -> 'padrao' logo ao carregar no cliente.
 * Não mexe no SettingsPanel. Atualiza store + localStorage + aplica preset.
 */
try {
  // Lazy import para evitar quebrar em SSR
  const mod = await import('@/components/useProdocStore')
  const { applyPreset } = await import('@/components/theme/presets')
  const useProdocStore: any = (mod as any).useProdocStore ?? (mod as any).default

  if (typeof window !== 'undefined' && useProdocStore?.getState) {
    const st = useProdocStore.getState()
    const curr = st?.state?.appearance ?? st?.appearance ?? null

    if (curr === 'escuro' || curr === 'Escuro') {
      const setter = st?.setAppearance ?? st?.actions?.setAppearance
      if (setter) setter('padrao')
      try { localStorage.setItem('prodoc.appearance', 'padrao') } catch {}
      try { applyPreset('padrao') } catch {}
    }
  }
} catch (e) {
  // silencioso: não bloqueia o app
}
