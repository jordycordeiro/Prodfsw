// components/utils/personalization-enhancer.ts
'use client'

/**
 * Instala ganchos de personalização no useProdocStore:
 * - Expõe (useProdocStore as any).replaceState(next) para aplicar baseline.
 * - Envolve mutações comuns para chamar markPersonalized() uma única vez.
 */
import { useProdocStore } from '@/components/useProdocStore'
import { markPersonalized } from '@/components/utils/useBaselineBootstrap'

const LS_FLAG = 'prodoc_personalized_since'
const MAIN_KEYS = ['prodoc-store-v1','prodoc-store','prodoc-v1'] // fallback quando não houver setState

function alreadyPersonalized(): boolean {
  try { return !!localStorage.getItem(LS_FLAG) } catch { return false }
}

function setPersonalizedOnce(){
  if (alreadyPersonalized()) return
  try { markPersonalized() } catch {}
}

function safeSetState(next: any){
  const anyStore: any = useProdocStore as any
  if (typeof anyStore.setState === 'function') {
    anyStore.setState(next)
    return
  }
  // Fallback: grava direto no localStorage e força recarga para hidratar
  try {
    const key = MAIN_KEYS[0]
    const current = typeof localStorage !== 'undefined' ? (localStorage.getItem(key) || '{}') : '{}'
    const merged = { ...(JSON.parse(current||'{}')||{}), ...(next||{}) }
    localStorage.setItem(key, JSON.stringify(merged))
    // tenta disparar um evento para listeners do useSyncExternalStore
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(merged) } as any))
  } catch {}
}

export function installPersonalizationGuard(){
  const anyStore: any = useProdocStore as any
  // 1) replaceState para injetar baseline com segurança
  if (typeof anyStore.replaceState !== 'function') {
    anyStore.replaceState = (next: any) => {
      try {
        safeSetState(next)
      } catch (e) {
        console.error('replaceState failed', e)
      }
    }
  }
  // 2) envolver mutações para marcar personalização
  const MAY_MARK = [
    'updateModel','deleteModel','duplicateToSubmenu','createMainMenu',
    'setExamField','addExamExtra','updateExamExtra','removeExamExtra',
    'setPageCards','updateCard','addCard','removeCard','setAppearance',
    'saveAsStable','normalizeOnlyMeds','updateObservacao','updateMedicacao'
  ]
  const NEVER_MARK = new Set(['setActive'])

  const api = anyStore.getState?.() || anyStore
  if (!api) return

  for (const key of Object.keys(api)) {
    const fn = api[key]
    if (typeof fn === 'function' && MAY_MARK.includes(key) && !NEVER_MARK.has(key)) {
      if (!(fn as any).__wrapped) {
        api[key] = async (...args: any[]) => {
          try { setPersonalizedOnce() } catch {}
          return await (fn as any)(...args)
        }
        ;(api[key] as any).__wrapped = true
      }
    }
  }
}
