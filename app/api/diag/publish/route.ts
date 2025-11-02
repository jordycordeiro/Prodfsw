import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const runtime = 'nodejs'

function sbAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    const db = sbAdmin()
    const { error } = await db.from('templates').update({ status: 'published' }).eq('id', id)
    return NextResponse.json({ ok: !error, error })
  } catch (e: any) {
    return NextResponse.json({ ok: false, caught: e?.message || String(e) }, { status: 200 })
  }
}
