import { NextResponse } from 'next/server'
export const runtime = 'nodejs'
export async function GET() {
  const url = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = !!process.env.SUPABASE_SERVICE_ROLE_KEY
  return NextResponse.json({ hasUrl: url, hasServiceKey: key })
}
