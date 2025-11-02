'use server'

import { createServerClient } from '@/lib/supabaseServer'

type Kind = 'template' | 'medication' | 'observation' | 'exam' | 'message'

function slugify(input: string){
  return input
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)/g,'')
}

export async function applyAndMergeBroadcast(broadcastId: string){
  const supabase = await createServerClient()

  // 1) Quem é o usuário atual
  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr || !user) throw new Error('Usuário não autenticado')

  // 2) Busque o broadcast completo
  const { data: b, error: bErr } = await supabase
    .from('broadcasts')
    .select('id, title, kind, payload, version_tag, created_at')
    .eq('id', broadcastId)
    .single()

  if (bErr || !b) throw new Error('Broadcast não encontrado')

  const kind = (b.kind || 'template') as Kind
  const title = b.title || 'Sem título'
  const versionTag = b.version_tag || null
  const payload = b.payload || {}

  // 3) Construa um slug determinístico por (kind+title)
  const slug = `${kind}:${slugify(title)}`

  // 4) Monte um conteúdo canônico
  //    Guardamos user_id dentro do content para index auxiliar (idempotência)
  const content = {
    user_id: user.id,
    title,
    kind,
    payload,
    version_tag: versionTag,
    source_broadcast_id: b.id,
    applied_at: new Date().toISOString(),
  }

  // 5) Upsert em prescriptions (por (user_id, slug))
  //    Atenção: essa operação pressupõe as colunas adicionadas pelo addendum SQL.
  //    Se o seu schema já tiver outra estrutura, adapte aqui os nomes.
  const { error: upsertErr } = await supabase
    .from('prescriptions')
    .upsert({
      // Se a sua tabela tiver coluna user_id, use-a diretamente.
      // Algumas estruturas guardam o user_id dentro do JSON (content); por isso o índice criado usa (content->>'user_id').
      slug,
      kind,
      content,
      source_broadcast_id: b.id,
      version_tag: versionTag,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'slug' }) // Único no índice condicional por usuário+slug (ver addendum)

  if (upsertErr) throw new Error(upsertErr.message)

  // 6) Marque a Inbox como aplicada (caso exista para este user)
  await supabase
    .from('user_inbox')
    .update({ status: 'applied', applied_at: new Date().toISOString() })
    .eq('broadcast_id', broadcastId)

  return true
}
