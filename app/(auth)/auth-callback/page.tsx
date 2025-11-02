
'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
export default function AuthCallback(){
  const router = useRouter()
  useEffect(()=>{
    supabase.auth.getSession().then(({ data })=>{
      if(data.session) router.replace('/prodoc'); else router.replace('/login')
    })
  },[router])
  return <div className="min-h-screen grid place-items-center">Validando acesso…</div>
}
