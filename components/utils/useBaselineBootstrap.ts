// components/utils/useBaselineBootstrap.ts
'use client'

import { useEffect, useRef } from 'react'
import { getSiteBaseline } from '@/app/(app)/baseline/actions'
import { useProdocStore } from '@/components/useProdocStore'

const PERSONALIZED_KEY = 'prodoc_personalized_since'

export function useBaselineBootstrap(){
  const booted = useRef(false)
  const store = useProdocStore()

  useEffect(() => {
    if (booted.current) return
    booted.current = true
    try {
      const hasPersonal = typeof window !== 'undefined' && !!localStorage.getItem(PERSONALIZED_KEY)
      if (hasPersonal) return
    } catch {}
    ;(async () => {
      try {
        const baseline = await getSiteBaseline()
        if (baseline && typeof baseline === 'object') {
          const anyStore: any = useProdocStore as any
          if (typeof anyStore.replaceState === 'function') {
            anyStore.replaceState(baseline)
          } else if (typeof (store as any).setState === 'function') {
            const partial: any = {}
            for (const k of ['menu','activeKey','pages','appearance','profileName','plan','exam','observacoes','medicacoes']) {
              if (baseline[k] !== undefined) partial[k] = baseline[k]
            }
            ;(store as any).setState(partial)
          }
        }
      } catch (e) {
        console.error('Baseline bootstrap failed', e)
      }
    })()
  }, [])
}

export function markPersonalized(){
  try { localStorage.setItem(PERSONALIZED_KEY, String(Date.now())) } catch {}
}
