// src/lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Tenta extrair o access_token de diferentes formatos de cookie
 * que aparecem em projetos com auth-helpers diferentes.
 */
function readServerAccessToken(): string | null {
  const jar = cookies()

  // 1) Formato clássico dos helpers novos
  const sbAccess = jar.get('sb-access-token')?.value
  if (sbAccess && sbAccess.trim().length > 0) return sbAccess

  // 2) Formato antigo/variantes: "supabase-auth-token"
  //    Pode ser:
  //    - JSON URL-encoded com { currentSession: { access_token: ... } }
  //    - Array URL-encoded ["access_token","refresh_token"]
  const legacy = jar.get('supabase-auth-token')?.value
  if (legacy && legacy.length > 0) {
    try {
      const raw = decodeURIComponent(legacy)

      // Tenta como JSON objeto com currentSession
      try {
        const obj = JSON.parse(raw)
        const tok =
          obj?.currentSession?.access_token ??
          obj?.access_token ??
          null
        if (tok && String(tok).length > 0) return String(tok)
      } catch {
        /* segue para tentar como array */
      }

      // Tenta como array ["access","refresh"]
      try {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr) && arr[0] && String(arr[0]).length > 0) {
          return String(arr[0])
        }
      } catch {
        /* ignorar */
      }
    } catch {
      /* ignorar */
    }
  }

  // 3) Outros nomes que às vezes aparecem
  const alt1 = jar.get('sb:token')?.value
  if (alt1 && alt1.trim().length > 0) return alt1

  return null
}

// ⚠️ Use com cautela: client com Service Role (só em rotinas estritamente de backend controladas)
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

// Client ANON "puro"
export function getUserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

// ✅ Client de servidor carregando o token da sessão (se existir)
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const token = readServerAccessToken()

  // Só envia Authorization se encontrou token — evita "Empty JWT"
  return createClient(url, anonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export default createServerClient
