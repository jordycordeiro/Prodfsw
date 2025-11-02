// stores/useAdminComposer.baseline.ts
'use client'

import { useCallback } from 'react'
import { setSiteBaseline } from '@/app/(app)/baseline/actions'
import { useProdocStore } from '@/components/useProdocStore'

export function useAdminBaseline() {
  const store = useProdocStore()
  const saveBaseline = useCallback(async (note?: string) => {
    const anyStore: any = useProdocStore as any
    const state: any = anyStore.getState?.() ?? store
    const snapshot = {
      menu: state.menu,
      activeKey: state.activeKey,
      pages: state.pages,
      appearance: state.appearance,
      profileName: state.profileName,
      plan: state.plan,
      exam: state.exam,
      observacoes: state.observacoes,
      medicacoes: state.medicacoes,
    }
    return await setSiteBaseline(snapshot, note)
  }, [])
  return { saveBaseline }
}
