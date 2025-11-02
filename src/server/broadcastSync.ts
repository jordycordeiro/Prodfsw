// src/server/broadcastSync.ts
// BROADCAST não-destrutivo: Admin publica -> cria broadcast.
// Usuário, ao carregar, verifica broadcasts e sincroniza APENAS o que não personalizou.

import { createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

// Para operações admin, use service role
const getServiceClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !serviceKey) {
    throw new Error('Supabase URL ou Service Key não configurados')
  }
  
  return createClient(url, serviceKey)
}

// Ajuste os nomes se seu schema usar outros nomes:
const TABLES = {
  templates: 'templates',         // baseline global
  prescriptions: 'prescriptions', // conteúdo por usuário (forks)
  broadcasts: 'broadcasts',
  userInbox: 'user_inbox',
} as const

const COLS = {
  slug: 'slug',
  title: 'title',
  label: 'label',
  cards: 'cards',
  updatedAt: 'updated_at',
  userId: 'user_id',
  isPersonal: 'is_personal', // booleano: true se o usuário editou (fork)
} as const

type TemplateRow = Record<string, any>
type PrescriptionRow = Record<string, any>

/** ADMIN: publica baseline e dispara broadcast global */
export async function publishBaselineWithBroadcast(template: {
  slug: string
  title: string
  label?: string
  cards: any
}) {
  // Admin usa service-role
  const supabase = getServiceClient()

  // 1) Upsert do baseline global
  const { error: upsertErr } = await supabase
    .from(TABLES.templates)
    .upsert({
      [COLS.slug]: template.slug,
      [COLS.title]: template.title,
      [COLS.label]: template.label ?? template.title,
      [COLS.cards]: template.cards,
      [COLS.updatedAt]: new Date().toISOString(),
    })
  if (upsertErr) throw upsertErr

  // 2) Broadcast para todos
  const { error: bcErr } = await supabase
    .from(TABLES.broadcasts)
    .insert({ type: 'template_updated', payload: { slug: template.slug, title: template.title } })
  if (bcErr) throw bcErr

  return { ok: true }
}

/** USER: verifica broadcasts e sincroniza baseline apenas onde não há personalização */
export async function checkAndSyncUser(userId: string) {
  // Leitura com client do usuário (RLS)
  const supabase = createServerClient()

  // Último broadcast
  const { data: latest, error: latestErr } = await supabase
    .from(TABLES.broadcasts)
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (latestErr) throw latestErr

  if (!latest?.created_at) return { synced: false }

  // Último "visto" do usuário
  const { data: inbox } = await supabase
    .from(TABLES.userInbox)
    .select('last_seen')
    .eq('user_id', userId)
    .maybeSingle()

  const needsSync = !inbox?.last_seen || new Date(inbox.last_seen) < new Date(latest.created_at)
  if (!needsSync) return { synced: false }

  // Carrega templates globais
  const { data: templates, error: tErr } = await supabase.from(TABLES.templates).select('*')
  if (tErr) throw tErr

  // Carrega prescrições do usuário
  const { data: myPresc, error: pErr } = await supabase
    .from(TABLES.prescriptions)
    .select('*')
    .eq(COLS.userId, userId)
  if (pErr) throw pErr

  const bySlugUser: Record<string, PrescriptionRow> = {}
  for (const p of myPresc ?? []) {
    const slug = p[COLS.slug]
    if (slug) bySlugUser[String(slug)] = p
  }

  // Sincroniza onde não há fork (is_personal=false/NULL)
  for (const tpl of (templates ?? []) as TemplateRow[]) {
    const slug = tpl[COLS.slug]
    if (!slug) continue
    const mine = bySlugUser[slug]

    const payload = {
      [COLS.userId]: userId,
      [COLS.slug]: slug,
      [COLS.title]: tpl[COLS.title],
      [COLS.label]: tpl[COLS.label] ?? tpl[COLS.title],
      [COLS.cards]: tpl[COLS.cards],
      [COLS.updatedAt]: new Date().toISOString(),
    }

    if (!mine) {
      await supabase.from(TABLES.prescriptions).insert(payload)
    } else if (mine && (mine[COLS.isPersonal] === false || mine[COLS.isPersonal] == null)) {
      await supabase
        .from(TABLES.prescriptions)
        .update(payload)
        .match({ [COLS.userId]: userId, [COLS.slug]: slug })
    }
  }

  // Marca "visto"
  await supabase.from(TABLES.userInbox).upsert({ user_id: userId, last_seen: new Date().toISOString() })
  return { synced: true }
}