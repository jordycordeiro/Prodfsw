'use client'

import { useState, useCallback } from 'react'
import { saveDraftAdmin, publishAdmin } from '@/app/admin/studio/actions'

type DraftMeta = {
  title: string
  kind: 'queixas' | 'exame' | 'medicacoes' | 'patologia-adulto'
  sex: 'A' | 'M' | 'F'
}

export function useAdminComposer() {
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const _lastSavedIdRef = (globalThis as any).__prodoc_last_id ?? { id: undefined as string | undefined }
  ;(globalThis as any).__prodoc_last_id = _lastSavedIdRef

  const takeFromCanvas = useCallback(async () => {
    // 👉 aqui você monta o objeto que já está construindo em page.tsx
    //    Se já tem essa função noutro lugar, pode simplesmente repassar.
    //    Mantive genérico para não acoplar na store global.
    return {} as any
  }, [])

  const saveDraft = useCallback(async (meta: DraftMeta, content_json: any) => {
    setSaving(true)
    try {
      const res = await saveDraftAdmin({
        id: _lastSavedIdRef.id,
        kind: meta.kind,
        title: meta.title,
        content_json,
        note: ''
      })
      if (!res?.ok) throw new Error((res as any)?.error || 'Falha ao salvar rascunho')
      _lastSavedIdRef.id = res.id
      return { ok: true, id: res.id }
    } catch (e) {
      console.error('useAdminComposer.saveDraft error:', e)
      return { ok: false, error: (e as any)?.message ?? String(e) }
    } finally {
      setSaving(false)
    }
  }, [])

  const publish = useCallback(async (note: string) => {
    setPublishing(true)
    try {
      const id = _lastSavedIdRef.id
      if (!id) throw new Error('Salve como rascunho antes de publicar.')
      const res = await publishAdmin(id, 1, note || 'Atualização')
      if (!res?.ok) throw new Error((res as any)?.error || 'Falha ao publicar')
      return { ok: true }
    } catch (e) {
      console.error('useAdminComposer.publish error:', e)
      return { ok: false, error: (e as any)?.message ?? String(e) }
    } finally {
      setPublishing(false)
    }
  }, [])

  return { saving, publishing, saveDraft, publish, takeFromCanvas }
}
