'use server'

/**
 * Actions usadas pelo useAdminComposer (compatibilidade).
 * - saveDraftAdmin: mantém o comportamento atual do seu store (rascunho local/privado).
 * - publishAdmin: publica a baseline global usando nosso publishBaseline (com namespace).
 */

import { publishBaseline } from '@/server/publishBaseline'

// Tipos livres para meta/body, adeque se quiser tipagem estrita
type Meta = { title?: string; kind?: string; sex?: 'A'|'M'|'F'; namespace?: string }
type Body = unknown

export async function saveDraftAdmin(meta: Meta, body: Body) {
  // Se você quiser persistir rascunho em banco, implemente aqui.
  // Por ora, mantemos compatível com o store (sem erro de import).
  return { ok: true }
}

export async function publishAdmin(meta: Meta, body: Body) {
  const slugBase = `${meta?.kind ?? 'geral'}/${(meta?.title ?? 'sem-titulo')
    .toString()
    .trim()
    .toLowerCase()
    .replaceAll(' ', '-')
    .replace(/[^a-z0-9\-\/]/g, '')
  }`

  const namespace = meta?.namespace || process.env.NEXT_PUBLIC_SITE_NAMESPACE || 'site'
  await publishBaseline(slugBase, body, namespace)
  return { ok: true, slug: slugBase, namespace }
}
