'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabaseClient'

type Mode = 'login' | 'signup' | 'magic'

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const router = useRouter()
  const search = useSearchParams()
  const next = search.get('next') || '/prodoc' // destino padrão após login

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)

    const supabase = getBrowserSupabase()

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push(next)
      }

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMsg('Conta criada! Verifique o e-mail para confirmar.')
      }

      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth-callback?next=${encodeURIComponent(next)}` },
        })
        if (error) throw error
        setMsg('Enviamos um link mágico para seu e-mail.')
      }
    } catch (err: any) {
      setMsg(err?.message ?? 'Falha ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-neutral-900 text-white">
      <div className="w-full max-w-md rounded-2xl bg-neutral-950/70 p-6 shadow-xl ring-1 ring-white/10">
        <h1 className="text-2xl font-extrabold tracking-tight">PRODOC</h1>
        <p className="mt-1 text-sm text-neutral-300">Entre para salvar suas prescrições</p>

        {/* Tabs */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'login' ? 'bg-white text-neutral-900' : 'bg-neutral-800 hover:bg-neutral-700'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'signup' ? 'bg-white text-neutral-900' : 'bg-neutral-800 hover:bg-neutral-700'
            }`}
          >
            Criar conta
          </button>
          <button
            type="button"
            onClick={() => setMode('magic')}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'magic' ? 'bg-white text-neutral-900' : 'bg-neutral-800 hover:bg-neutral-700'
            }`}
          >
            Link mágico
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-neutral-300">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="seu@email.com"
            />
          </div>

          {mode !== 'magic' && (
            <div>
              <label className="mb-1 block text-xs text-neutral-300">Senha</label>
              <input
                type="password"
                required={mode !== 'magic'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-black hover:bg-sky-400 disabled:opacity-60"
          >
            {loading
              ? 'Aguarde...'
              : mode === 'login'
              ? 'Entrar'
              : mode === 'signup'
              ? 'Criar conta'
              : 'Enviar link'}
          </button>

          {msg && (
            <p className="mt-2 text-center text-sm text-rose-300">
              {msg}
            </p>
          )}
        </form>

        {/* Dica de recuperação */}
        {mode === 'login' && (
          <p className="mt-4 text-center text-xs text-neutral-400">
            Esqueceu a senha? Use <button className="underline" onClick={() => setMode('magic')}>link mágico</button>.
          </p>
        )}
      </div>
    </main>
  )
}
