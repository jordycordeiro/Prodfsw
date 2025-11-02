// src/lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/** Extrai token de sessão de possíveis cookies */
function readServerAccessToken(): string | null {
  const jar = cookies()
  const a = jar.get('sb-access-token')?.value
  if (a && a.trim()) return a

  const legacy = jar.get('supabase-auth-token')?.value
  if (legacy) {
    try {
      const raw = decodeURIComponent(legacy)
      try {
        const obj = JSON.parse(raw)
        const tok = obj?.currentSession?.access_token ?? obj?.access_token ?? null
        if (tok) return String(tok)
      } catch {}
      try {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr) && arr[0]) return String(arr[0])
      } catch {}
    } catch {}
  }
  const alt = jar.get('sb:token')?.value
  if (alt && alt.trim()) return alt
  return null
}

/** 🔑 Service Role — use apenas em actions/rotas de admin */
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

/** Client anônimo */
export function getUserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

/** Client de servidor com a sessão atual (via cookies) */
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const token = readServerAccessToken()

  return createClient(url, anon, {
    global: { headers: token ? { Authorization: `Bearer ${token}` } : {} },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/** ✅ Compatibilidade: função `sb()` usada no seu código legado */
export function sb() {
  return createServerClient()
}

/** ✅ Default também como `sb` para compatibilidade de import default */
export default sb
